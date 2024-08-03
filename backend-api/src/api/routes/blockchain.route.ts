import { setMaxListeners } from 'events';
import BlockChain from '../../blockchain/blockchain';
import { Block } from '../../blockchain/data_types';

const axios = require('axios');
const LOCALHOST = 'http://localhost:';
const OFFSET = '/api/blockchain'; // Adjust the offset based on the way to structured the blockchain, for now It starts from api/blockchain
const NODE_ADDRESS = "?"; //Let's assume we already know comming from the higher level.

const dotenv = require("dotenv");
dotenv.config();

const express = require("express")
const router = express.Router()

const verifyJWTWeb = require('../../middleware/verifyJWTWeb');

module.exports = function (blockchain: BlockChain, allNodes) {

   router.get('/', (req, res) => {
      res.json(blockchain);
   })

   router.get('/pending-transactions', (req, res) => {
      res.json(blockchain.getPendingTransactions());
   })

   router.get('/transactions', (req, res) => {
      res.json(blockchain.getTransactions());
   })

   router.get('/blocks', (req, res) => {
      res.json(blockchain.getBlocks());
   })

   router.get('/block-detail/:id', (req, res) => {
      const blockHash = req.params.id;
      res.json(blockchain.getBlockDetails(blockHash));
   })

   router.get('/chain', (req, res) => {
      res.json(blockchain);
   })

   router.get('/get-results', verifyJWTWeb, async (req, res) => {
      res.json(await blockchain.smartContract.getResults());
   })

   router.get('/get-results-computed', async (req, res) => {
      res.json(await blockchain.smartContract.getResultsComputed());
   })

   setMaxListeners(15);

   const checkVote = (identifier: string, choiceCode: number): boolean => {
      if (!identifier || !choiceCode) return false;
      return true;
   }
   
   router.post('/transaction', async (req, res) => {
      let data = req.body;
      
      try {
         if (checkVote(data.identifier, parseInt(data.choiceCode))) {
            const electoralId: string = data.identifier;
            console.log("identifier: ", electoralId);
            const identifier = await blockchain.getCitizenRelatedIdentifier(electoralId);
            if (!identifier) {
               res.status(401).send({ node: 'Something went wrong!' });
               return;
            }

            const choiceCode: number = parseInt(data.choiceCode);
            
            const choiceEncrypted = blockchain.encryptDataVoter(choiceCode.toString()); // choiceCode.toString(); 
            const electoralIdEncrypted = blockchain.encryptDataIdentifier(electoralId.toString()); // choiceCode.toString(); 
            const secret: string = data.secret; // Add this information to the vote before encrypt ...

            const ans = blockchain.addPendingTransaction(identifier, electoralIdEncrypted.CIPHER_TEXT, electoralIdEncrypted.IV, choiceEncrypted.CIPHER_TEXT, choiceEncrypted.IV, secret);
            
            if (ans) {
               res.status(201).send({ node: 'Data received and will be added to the transactions.', details: ans });
            } else {
               res.status(401).send({ node: 'Data received but invalid. Please try again later!', ans });
            }
         } else {
            res.status(500).send({ node: 'Failed!', data });
         }
      } catch (error) {
         res.status(401).send({ node: 'Data received but invalid. Please try again later!', data });
      }
   })

   router.post('/transaction/broadcast', (req, res) => {
      let data = req.body;
      let ans = blockchain.addPendingTransaction(data.identifier, data.electoralId, data.electoralIdIV, data.choiceCode, data.IV, data.secret);

      broadcastData('/receive-new-block', data, res);
   })

   router.get('/voters', async (req, res) => {
      const ans = await blockchain.getSmartContractVoters();
      res.json({ voters: ans, note: "Request accepted ..." });
   })

   router.get('/clear-voters', async (req, res) => {
      const ans = await blockchain.smartContract.eraseVoters();
      res.json({ votes: await blockchain.smartContract.getVoters(), note: "Request accepted ..." });
   })

   router.get('/clear-results', async (req, res) => {
      res.json({ results: await blockchain.smartContract.eraseResults(), note: "Request accepted ..." });
   })

   router.get('/clear-chains', async (req, res) => {
      res.json({ results: await blockchain.clearChainsFromStorage(), note: "Request accepted ..." });
   })

   router.get('/candidates', async (req, res) => {
      const ans = await blockchain.getSmartContractCandidates();
      res.json({ candidates: ans, note: "Request accepted ..." });
   })

   router.get('/deploy-voters', async (req, res) => {
      const ans = await blockchain.deployVoters();
      if (ans !== null) {
         const votersDeployed = await blockchain.getSmartContractVoters();
         res.json({ voters: votersDeployed, note: "Request accepted ..." });
      } else {
         res.status(401).json({ registers: ans, note: "Failed ..." });
      }
   })

   router.get('/deploy-candidates', async (req, res) => {
      const ans = await blockchain.deployCandidatesBlockchain();
      if (ans !== null) {
         const candidatesDeployed = await blockchain.getSmartContractCandidates();
         res.json({ registers: candidatesDeployed, note: "Request accepted ..." });
      } else {
         res.status(401).json({ candidates: ans, note: "Failed ..." });
      }
   })

   router.post('/receive-new-block', (req, res) => {
      let block = req.body;
      let ans: boolean = blockchain.addBlock(block);

      if (ans) {
         res.send({ node: 'Block accepted and added to the chain successfully.', data: block });
      } else {
         res.send({ node: 'New block rejected. Block not added to the chain.', data: block });
      }

      runConsensus(res);
   })

   const broadcastData = (endpoint, data, res) => {
      const requests = allNodes.filter(url => url !== NODE_ADDRESS).map(url => {
         const URI = LOCALHOST + url + OFFSET + endpoint;
         return axios.post(URI, data);
      });

      Promise.all(requests)
         .then(data => {
            const allResp = [];
            data.forEach(x => {
               allResp.push(x.data);
            })
         })
         .catch(error => {
            // console.error(error);
         });

   }

   router.get('/mine', (req, res) => {
      let block: Block = blockchain.mineBlock();;

      broadcastData('/receive-new-block', block, res);

      if (block) {
         res.status(200).send({ node: 'New block to be mined. Check for confirmation!', data: block });
      } else {
         res.send({ node: 'Error. Something went wrong!', data: block });
      }
   })

   router.post('/synchronize-chain', (req, res) => {
      let data = req.body;
      if (!data.chain) res.status(401);

      let chain: Block[] = data.chain;
      let ans = blockchain.replaceChain(chain);

      if (ans) {
         res.send({ node: 'Chain synchronized.' });
      } else {
         res.send({ node: 'Failed to synchronize the chain.' });
      }
   })

   const runConsensus = (res) => {

      // Here we apply the longest chain rule.
      const requests = allNodes.filter(url => url !== NODE_ADDRESS).map(url => {
         const URI = LOCALHOST + url + OFFSET; // + endpoint
         return axios.get(URI);
      });

      let longestBlockchain: BlockChain = null;
      Promise.all(requests).then(resp => {

         let blockchains: BlockChain[] = [blockchain];
         resp.forEach(element => {
            blockchains.push(element.data);
         });

         longestBlockchain = blockchains.reduce((prev: BlockChain, cur: BlockChain) => {
            const condition = cur.getLengthChain >= prev.getLengthChain;

            return condition ? cur : prev;
         }, new BlockChain());

      }).then(data => {
         broadcastData('/synchronize-chain', longestBlockchain, res);
      }).catch(error => {
         //console.error(error);
      });
   };

   return router;
}