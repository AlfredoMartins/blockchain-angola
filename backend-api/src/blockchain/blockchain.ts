import * as CryptoJS from 'crypto-js';
import sha256 from 'crypto-js/sha256';
import assert from 'assert';
import { Block, BlockHeader, Voter, Transaction } from './data_types';
import SmartContract from '../smart_contract/smart_contract';
import { readChain, writeChain, deployCandidates, deployVotersGenerated, readVoterCitizenRelation, updateVoter, clearChains } from '../leveldb';
import CryptoBlockchain from '../crypto/cryptoBlockchain';

const CryptoBlockIdentifier = new CryptoBlockchain(process.env.SECRET_KEY_IDENTIFIER, process.env.SECRET_IV_IDENTIFIER);
const CryptoBlockVote = new CryptoBlockchain(process.env.SECRET_KEY_VOTES, process.env.SECRET_IV_VOTES);

class BlockChain {
    chain: Block[];
    transactionPool: Transaction[]; // Pending Transactions
    smartContract: SmartContract;
    nodeAddress: string;

    constructor() {
        this.chain = [this.getGenesisBlock()];
        this.transactionPool = [];

        try {
            this.smartContract = new SmartContract();
        } catch (e) { };
    }

    public setNodeAddress(nodeAddress: string) {
        this.nodeAddress = nodeAddress;
        this.loadChain();
    }

    private async loadChain() {
        try {
            this.chain = await readChain();
        } catch (e) { };
    }

    public async clearChainsFromStorage() {
        try {
            await clearChains().then(res => {
                this.loadChain();
                this.smartContract = new SmartContract();
            });
        } catch (error) { }

        return [];
    }

    private saveChain() {
        try {
            writeChain(this.chain);
        } catch (e) { };
    }

    private getGenesisBlock(): Block {
        return this.createGenesisBlock();
    }

    public getChain(): Block[] {
        return this.chain;
    }

    public getLengthChain(): number {
        return this.chain.length;
    }

    public replaceChain(chain: Block[]): boolean {
        if (this.isValidChain(chain)) {
            //console.log("Valid chain (:)[^_^](:)");
            this.chain = chain;
            return true;
        }

        return false;
    }

    public addBlock(block: Block): boolean {
        try {
            if (this.isValidBlock(block)) {
                this.chain.push(block);

                // Update voter in the database
                block.transactions.forEach(x => {
                    updateVoter(x.data.identifier, x.data);
                })

                this.transactionPool = []; // Clear the transaction pool (pending transactions)
                this.smartContract.update();

                this.saveChain();

                return true;
            }
        } catch (e) { }

        return false;
    }

    private getLastBlock(): Block {
        const lastIndex: number = this.chain.length - 1;
        if (lastIndex < 0) null;
        return this.chain[lastIndex];
    }

    private isBlockLast(block: Block) {
        const lastBlock: Block = this.getLastBlock();
        if (lastBlock !== null) return true;
        return lastBlock.blockHeader.blockHash === block.blockHeader.previousBlockHash && lastBlock.blockIndex + 1 === block.blockIndex;
    }

    private isValidBlock(block: Block): boolean {
        if (!this.isBlockLast(block)) {
            return false;
        }

        if (block !== null && !this.isSHA256(block.blockHeader.blockHash)) {
            return false;
        }

        if (!this.isValidTimestampDifference(block.blockHeader.timestamp)) {
            return false;
        }

        if (!this.isValidTransactionPool(block.transactions)) {
            return false;
        }

        return true;
    }

    public addPendingTransaction(identifier: string, electoralId: string, electoralIdIV: string, choiceCode: string, choiceCodeIV: string, secret: string): Transaction {
        if (!this.smartContract.isValidElectionTime()) {
            return null;
        }

        let transaction: Transaction = this.createTransaction(identifier, electoralId, electoralIdIV, choiceCode, choiceCodeIV, secret);
        if (this.isValidTransaction(transaction)) {
            this.transactionPool.push(transaction);
            return transaction;
        }

        return null;
    }

    public hashBlock(previousBlockHash: string, merkleRoot: string, nonce: number): string {
        let concat: string = previousBlockHash + merkleRoot + "" + nonce;
        return this.hashData(concat);
    }

    public createBlock(hash: string, previousBlockHash: string, nonce: number) {
        let blockHeader: BlockHeader =
        {
            version: "1",
            blockHash: "",
            previousBlockHash: this.getLastBlock().blockHeader.blockHash,
            merkleRoot: this.createMarkle(this.transactionPool),
            timestamp: Date.now(),
            difficultyTarget: -1,
            nonce: nonce
        };

        blockHeader.blockHash = this.hashBlock(previousBlockHash, blockHeader.merkleRoot, nonce);

        let newBlock: Block =
        {
            blockIndex: this.chain.length,
            blockSize: 285,
            blockHeader: blockHeader,
            transactionCounter: this.transactionPool.length,
            transactions: this.transactionPool
        };

        return newBlock;
    }

    private createGenesisBlock() {
        let blockHeader: BlockHeader =
        {
            version: "1",
            blockHash: "-",
            previousBlockHash: "-",
            merkleRoot: "-",
            timestamp: new Date('2022-09-03').getTime(), // It must be static ...
            difficultyTarget: 1234,
            nonce: 1234
        };

        let genesisBlock: Block =
        {
            blockIndex: 0,
            blockSize: 285,
            blockHeader: blockHeader,
            transactionCounter: 2,
            transactions: [this.createTransaction('00000', '00000', '-', "-", "-", "-"), this.createTransaction('20000', '00000', '-', "-", "-", "-")]
        };

        blockHeader.blockHash = this.hashBlock('-', blockHeader.merkleRoot, 1234);

        for (let i = 0; i < genesisBlock.transactionCounter; i++) {
            genesisBlock.transactions[i].data.voteTime = blockHeader.timestamp;
        }

        genesisBlock.blockHeader.merkleRoot = this.createMarkle(genesisBlock.transactions);

        return genesisBlock;
    }

    public async getSmartContractVoters() {
        try {
            const ans = await this.smartContract.getVoters();
            return ans;
        } catch (e) { }

        return null;
    }

    public async getSmartContractCandidates() {
        try {
            const ans = await this.smartContract.getCandidates();
            return ans;
        } catch (e) { }

        return null;
    }

    public async deployVoters() {
        try {
            const ans = await deployVotersGenerated();

            try {
                this.smartContract = new SmartContract();
            } catch (e) { };

            return ans;
        } catch (e) { }

        return null;
    }

    public async deployCandidatesBlockchain() {
        try {
            const ans = await deployCandidates();
            return ans;
        } catch (e) { }

        return null;
    }

    public encryptDataIdentifier(data) {
        return CryptoBlockIdentifier.encryptData(data);
    }

    public encryptDataVoter(data) {
        return CryptoBlockVote.encryptData(data);
    }

    public decryptDataIdentifier(data) {
        return CryptoBlockIdentifier.decryptData(data);
    }

    public decryptDataVoter(data) {
        return CryptoBlockVote.decryptData(data);
    }

    private createTransaction(identifier: string, electoralId: string, electoralIdIV, choiceCode: string, choiceCodeIV: string, secret: string): Transaction {
        let vote: Voter = { identifier: identifier, electoralId: electoralId, electoralIV: electoralIdIV, choiceCode: choiceCode, state: true, secret: secret, voteTime: Date.now(), IV: choiceCodeIV };

        let hashDigest: string = "" + vote.identifier + vote.choiceCode + vote.state;
        let transactionHash: string = this.hashData(hashDigest);

        let transaction: Transaction = { data: vote, transactionHash: transactionHash };
        return transaction;
    }

    private hashData(data: string): string {
        return sha256(data).toString();
    }

    private areObjectsEqual(obj1: Block, obj2: Block) {
        const a = JSON.stringify(obj1);
        const b = JSON.stringify(obj2);
        return a === b;
    }

    private isValidChain(chain: Block[]): boolean {
        const genesisBlock: Block = this.getGenesisBlock();
        if (!this.areObjectsEqual(chain[0], genesisBlock)) {
            return false;
        }

        // We skip genesis block in the loop
        for (let i: number = 1; i < chain.length; ++i) {
            let prevBlock: Block = chain[i - 1];
            let curBlock: Block = chain[i];

            if (prevBlock.blockIndex + 1 !== curBlock.blockIndex)
                return false;

            if (prevBlock.blockHeader.blockHash !== curBlock.blockHeader.previousBlockHash)
                return false;

            let blockHash: string = this.hashBlock(prevBlock.blockHeader.blockHash, curBlock.blockHeader.merkleRoot, curBlock.blockHeader.nonce);

            if (blockHash !== curBlock.blockHeader.blockHash)
                return false;
        }

        return true;
    }

    public proofOfIdentity() { }
    public proofOfImportance() { }

    public mineBlock(): Block {
        const DIFFICULTY_TARGET = 4;
        let lastHashBlock: string = this.getLastBlock().blockHeader.blockHash;

        if (!this.isValidTransactionPool(this.transactionPool)) {
            return null;
        }

        let merkleRoot: string = this.createMarkle(this.transactionPool);
        let nonce: number = this.proofOfWork(lastHashBlock, merkleRoot, DIFFICULTY_TARGET);

        let candidateBlock: Block = this.createBlock(this.hashBlock(lastHashBlock, merkleRoot, nonce), lastHashBlock, nonce);
        // this.addBlock(candidateBlock); It adds int the receive method

        return candidateBlock;
    }

    // Retargeting to Adjust Difficulty
    private retargetAdjustDifficulty(): number {
        // New Target = Old Target * (Actual Time of Last 2016 Blocks / 20160 minutes)
        // Read the book, page 236. (MASTER BITCOIN)
        return 0;
    }

    private isSHA256(str: string): boolean {
        const regExp: RegExp = /^[0-9a-fA-F]{64}$/;
        return regExp.test(str);
    }

    private isValidVote(vote: Voter): boolean {
        let length: number = vote.identifier.length;
        if (length <= 5 || length >= 50)
            return false;

        if (vote.choiceCode.length === 0)
            return false;

        if (vote.secret.length === 0)
            return false;

        // Is in the smart-contract
        return true;
    }

    private isValidTransactionPool(transactions: Transaction[]): boolean {
        const len: boolean = transactions.length > 0;
        const mapped = transactions.map(x => this.isValidTransaction(x));

        const validTransactions: boolean = mapped.every(x => x);

        return len && validTransactions;
    }

    public isValidTransaction(transaction: Transaction): boolean {
        // The transaction size in bytes is less than MAX_BLOCK_SIZE.

        /*        if (this.isPresentedInTransactionPool(transaction)) {
                    console.log("Transaction Pool: ", this.transactionPool);
                    console.log("Error in isPresentedInTransactionPool");
                    return false;
                }*/

        if (this.isPresentedInChain(transaction)) {
            // console.log("[present] -> transaction: ", transaction);
            return false;
        }

        if (transaction != null && !this.isSHA256(transaction.transactionHash) || !this.isValidVote(transaction.data))
            return false;

        return true;
    }

    private isPresentedInTransactionPool(transaction: Transaction): boolean {
        return this.transactionPool.findIndex(x => x === transaction) >= 0;
    }

    private isPresentedInChain(transaction: Transaction): boolean {
        return this.getTransactions().findIndex(x => x.transactionHash === transaction.transactionHash || x.identifier === transaction.data.identifier) >= 0;
    }

    private isValidTimestampDifference(timestamp: number): boolean {
        let currentTime = new Date(Date.now());
        const hours = 2;
        currentTime.setHours(currentTime.getHours() + hours); // Add two hours.

        let futureTime = currentTime.setHours(currentTime.getHours() + hours);

        return timestamp <= futureTime;
    }

    public proofOfWork(previousBlockHash: string, merkleRoot: string, difficultyTarget: number) {
        // Later, improve the difficultyTarget to auto adjust and increase the difficulty to find the nonce :)
        let nonce: number = 0;
        let hash = this.hashBlock(previousBlockHash, merkleRoot, nonce);

        let prefixHash = "0".repeat(difficultyTarget);
        let sub = hash.substring(0, difficultyTarget);

        // Bruteforce until find the correct hash. It may take a lot of time depending on "difficulty target".
        while (prefixHash !== sub) {
            nonce++;
            let hash = this.hashBlock(previousBlockHash, merkleRoot, nonce);
            sub = hash.substring(0, difficultyTarget);
        } return nonce;
    }

    toString(): string {
        return `Blockchain: ${this.chain}\nPendingTransaction: ${this.transactionPool}`;
    }

    private createMarkle(transactions: Transaction[]): string {
        let hashList: string[] = transactions.map((x) => x.transactionHash);

        // Stop if hash list is empty
        if (hashList.length === 0) {
            return null;
        } else if (hashList.length === 1)
            return hashList[0];

        // While there is more than 1 hash in the list, keep looping ...
        while (hashList.length > 1) {
            // If number of hashes is ood, duplicate last hash in the list.
            if (hashList.length % 2 !== 0) {
                let index_last = hashList.length - 1;
                let last: string = hashList[index_last];
                hashList.push(last);
            }

            // List size is now even
            assert(hashList.length % 2 === 0);

            // New hash list
            let newHashList: string[] = [];

            // Loop though hashes 2 at a time.
            for (let i = 0; i < hashList.length; i += 2) {
                // Join both current hashes together (concatenate).
                let current: string = hashList[0];
                let next: string = hashList[i + 1];

                let concat: string = `${current}${next}`;

                // Hash both of the hashes.
                let newRoot: string = this.hashData(concat);

                // Add this to the new list.
                newHashList.push(newRoot);
            }

            // This is the new list.
            hashList = newHashList;
        }

        // DEBUG output ----------------------------------------
        hashList.forEach(element => {
            // console.log(" " + element);
        });

        // -----------------------------------------------------

        // Finally we end up with a single item.
        return hashList[0];
    }

    public getPendingTransactions() {
        const x = this.transactionPool.map((x, index) => {
            const newVal = {
                id: index + 1,
                transactionHash: x.transactionHash,
                identifier: x.data.identifier,
                choiceCode: x.data.choiceCode,
                voteTime: x.data.voteTime,
            };

            return newVal;
        }
        );

        return x;
    }

    public getTransactions() {
        const x = this.chain.map((x, index) => x.transactions).flat(1);
        const res = x.map((x, index) => {
            const newVal = {
                id: index + 1,
                transactionHash: x.transactionHash,
                identifier: x.data.identifier,
                choiceCode: x.data.choiceCode,
                voteTime: x.data.voteTime,
            };

            return newVal;
        });

        return res;
    }

    public getBlocks() {
        const res = this.chain.map((x, index) => {
            const newVal = {
                id: index + 1,
                hashBlock: x.blockHeader.blockHash,
                nonce: x.blockHeader.nonce,
                numOfTransactions: x.transactionCounter,
                dateAndTime: x.blockHeader.timestamp,
                size: x.blockSize,
            };

            return newVal;
        });

        return res;
    }

    public getBlockDetails(blockHash: string) {
        const x = this.chain.find(x => x.blockHeader.blockHash === blockHash);
        return x;
    }

    public async getCitizenRelatedIdentifier(electoralId: string) {
        try {
            const electoralIdEncrypted = CryptoBlockIdentifier.encryptData(electoralId);
            const identifier = await readVoterCitizenRelation(electoralIdEncrypted.CIPHER_TEXT);
            return identifier;
        } catch (e) {
            //console.log(e);
        }

        return null;
    }
}

/*
    Code processing results.
    in the level db, the transaction and the header metadate are separated.
*/

export default BlockChain;