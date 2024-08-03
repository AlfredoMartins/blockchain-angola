import { request } from "axios";
import { randomUUID } from "crypto";
import BlockChain from "../blockchain/blockchain";

// P2P Star Topology network
const baseConfig = require('../config');

const axios = require('axios');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const P2pNetwork = require('./p2p');
const io = new Server(server);

const PARAM = process.argv[2];
const SERVER_PORT = PARAM ? PARAM : baseConfig.DEFAULT_PORT_SERVER;
const LOCALHOST = 'http://localhost:';
const HOSTNAME_ADDRESS = LOCALHOST + SERVER_PORT;
const peerId = randomUUID().split('-').join('').substr(0, 4);
const NODE_ADDRESS = PARAM ? PARAM : peerId;

// Topology
let allNodes = [NODE_ADDRESS];
const p2p = new P2pNetwork();

const blockchain = new BlockChain()

const redirectRoute = (text) => require(text)(blockchain, allNodes);

app.use('/api', redirectRoute('../api/index'));

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/network', function (req, res) {
  res.status(200).json({ network: getAllNodes() });
});

app.post('/update_nodes', function (req, res) {
  const data = req.body;
  const urls = data.urls;

  urls.forEach(node => {
    addNode(node);
  });

  requestConnection(getAllNodes(), getAllNodes());

  setTimeout(() => {
    res.status(200).json({ node: 'New node added successfully!', currentUrl: NODE_ADDRESS, myUrls: getAllNodes() });
  }, 50);
});

app.post('/connect_node', function (req, res) {
  const data = req.body;
  const urls = data.urls;

  if (!urls) res.status(401);

  urls.forEach(url => {
    newClient(url);
  });

  setTimeout(() => {
      res.status(201).json({ node: 'New node added successfully!', currentUrl: NODE_ADDRESS, myUrls: getAllNodes() });
  }, 100);
});

const isNodePresent = (node) => {
  if (node === NODE_ADDRESS) return true;
  return allNodes.findIndex(x => x == node) !== -1;
}

const removeAllNodes = () => {
  const nodeList = [NODE_ADDRESS]
  return nodeList;
}

const getAllNodes = () => {
  const nodeList = [...new Set(allNodes)]
  nodeList.sort();
  return nodeList;
}

const isCurrentNode = (node) => node === NODE_ADDRESS;

const removeDuplicated = (list) => [...new Set([...list])];

const addNode = (node) => {
  if (isCurrentNode(node)) return;
  allNodes.push(node);
  allNodes = removeDuplicated(allNodes);
}

const requestSingleConnection = (url, thisAllNodes) => {
  axios.
    post(LOCALHOST + url + '/update_nodes', { urls: thisAllNodes }).
    then(_ => { }).catch(error => console.error(error))
}

const requestConnection = (thisAllNodes, destines) => {
  thisAllNodes = [...thisAllNodes, ...getAllNodes()];
  thisAllNodes = removeDuplicated(thisAllNodes);

  let fullUpdated = {}
  let nodesListed = [...thisAllNodes];

  const requests = [];
  destines.forEach(url => {
    // console.log("? URL => ", url);

    const request = axios
      .post(LOCALHOST + url + '/connect_node',
        { urls: thisAllNodes })
      .then(response => {
        let urls_x = response.data.myUrls;
        fullUpdated[url] = urls_x;

        nodesListed = [...nodesListed, ...urls_x];
        nodesListed = removeDuplicated(nodesListed);

      }).catch(error => console.error(error))
    requests.push(request);
  });

  Promise.all(requests).then(data => { }).then(data => {
    let allGood = true;
    let newNodes = [];

    thisAllNodes.forEach(element => {
      if (!fullUpdated[element] || fullUpdated[NODE_ADDRESS]) 
        return;

      if (!areEqualUpdated(fullUpdated[element], fullUpdated[NODE_ADDRESS])) {

        console.log("fullUpdated: ", fullUpdated[NODE_ADDRESS]);

        newNodes = [...newNodes, ...fullUpdated[NODE_ADDRESS], ...fullUpdated[element]];
        newNodes = removeDuplicated(newNodes);

        allGood = false;
        let merged = [...fullUpdated[element], ...fullUpdated[NODE_ADDRESS]];

        // If there's no connection between them, ... Connect :)
        requestSingleConnection(element, merged);
        requestSingleConnection(NODE_ADDRESS, merged);
      }
    });

    if (!allGood) {
      requestConnection(newNodes, newNodes);
    }
  }).catch(error => console.error(error));

}

const isUpdated = (nodeList) => {
  let currentNodeList = getAllNodes();
  currentNodeList.sort();
  nodeList.sort();

  if (JSON.stringify(currentNodeList) === JSON.stringify(nodeList)) {
    return true;
  }

  return false;
}

const areEqualUpdated = (nodeList1, nodeList2) => {
  if (nodeList1 === undefined || nodeList2 === undefined) return false;

  nodeList1.sort();
  nodeList2.sort();

  if (JSON.stringify(nodeList1) === JSON.stringify(nodeList2)) {
    return true;
  }

  return false;
}

const clientConnected = (socket) => {
  // Ask for new nodes
  socket.emit('post-nodes', getAllNodes(), NODE_ADDRESS, false);
  requestConnection(getAllNodes(), getAllNodes());

  // Register new nodes
  socket.on('post-nodes', (thisAllNodes, node, firstTime) => {
    if (!firstTime) {
      addNode(node);
      // Connect to a node if not present.
      thisAllNodes.forEach(node => {
        addNode(node);
      });

      requestConnection(getAllNodes(), getAllNodes());
      socket.emit('post-nodes', getAllNodes(), NODE_ADDRESS, true);
    } else {
      if (!isUpdated(thisAllNodes)) {
        addNode(node);

        // Connect to a node if not present.
        thisAllNodes.forEach(node => {
          addNode(node);
        });

        requestConnection(getAllNodes(), getAllNodes());

        socket.emit('post-nodes', getAllNodes(), NODE_ADDRESS, firstTime);
      }
    }

    requestConnection(getAllNodes(), getAllNodes());
  });
}

const serverConnected = (socket) => {
  clientConnected(socket);
}

io.on('connection', (socket) => {
  clientConnected(socket);
});

const serverDisplay = () => {
  console.clear();
  console.log('SOCKET: listening on *: ' + SERVER_PORT + ' | NODE ADDRESS: ' + NODE_ADDRESS);
  const data = { peerId: NODE_ADDRESS, url: HOSTNAME_ADDRESS };
  p2p.setMyPeerData(data);
  blockchain.setNodeAddress(NODE_ADDRESS);

  askQuestion();
}

server.listen(SERVER_PORT, (_) => {
  serverDisplay();
});

const askQuestion = () => {
  console.log('Press "M" or "m" to open the menu.');
  rl.question('', (answer) => {
    if (answer.toLowerCase() === 'm') {
      printHeader();
    } else {
      serverDisplay();
    }
  });
}

// --> CLIENT <--

const io_client = require("socket.io-client");
let clients = {}

const newClient = (url) => {
  const client = io_client.connect(url);
  clients[url] = clients[url] ? clients[url] : client;
  clients[url].on('connect', (data) => {
    console.log('I am a client, I could connect.');
    serverConnected(client);
  });
}

// <- Data Center ->

import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// process.stdin.setRawMode(true);

const printHeader = (): void => {
  console.clear();
  const now = new Date().toUTCString();
  let text = "=======================================================================\n";
  text += `Made by: MARTINS Alfredo | ELTE, Budapest ${now}\n`;
  text += "=======================================================================\n";
  text += ":: WELCOME TO THE ELECTION DATA CENTER ::\n";
  text += "OPTIONS:\n";
  text += "\t:: A - Add a new or more nodes ::\n";
  text += "\t:: L - List nodes ::\n";
  text += "\t:: R - Remove nodes ::\n";
  text += "\t:: C - Close Data Center ::\n";

  console.log(text);

  askOption(); // Ensure this function is defined elsewhere
}

const resetNode = () => {
  removeAllNodes();
}

const addNewNode = (): void => {
  console.clear();

  rl.question("<node1, node2, ...> Enter the list node(s) to add: ", (input) => {

    const nodes = input.trim().split(',').map(x => x.trim());

    const ENDPOINT = '/connect_node';

    const newObj = {
      urls: [...nodes].map(URL => LOCALHOST + URL)
    }

    console.log("New obj: ", newObj);
    const URI = LOCALHOST + SERVER_PORT + ENDPOINT;

    axios.post(URI, newObj).then(data => {
      if (data.status === 201) {
        console.log("Nodes added.");
      }
    }).catch(_ => console.error("Failure detected."));

    setTimeout(listNodes, 500);
  });
};

const listNodes = (): void => {
  console.log("Nodes connected: ", getAllNodes());
  setTimeout(printHeader, 5000);
}

const removeNode = (): void => {
  console.clear();

  rl.question("<node1, node2, ...> Enter the list node(s) to remove: ", (input) => {
    let nodes = input.trim().split(',');
    allNodes = allNodes.filter(x => (!nodes.includes(x) || x === NODE_ADDRESS));

    allNodes.forEach(url => {
      if (clients[url]) {
        clients[url].disconnect();
        clientConnected[url] = null;
      }
    })

    setTimeout(listNodes, 500);
  });
}

const printfInvalidOperation = (): void => {
  console.log("!!! ALERT !!!");
  console.log("==> Invalid operation <==");
};

const dismiss = (): void => {
  console.log("Network shut down :). Any further requests will be denied ...");
  console.log(`THANK YOU FOR USING MY SCRIPT :) ${new Date()}`);
  console.log("Copyright© ELTE 2024, MARTINS Alfredo");

  setTimeout(serverDisplay, 2000); // Wait for 2 seconds before listing nodes
};

const askOption = (): void => {
  rl.question("Enter the option: ", (input) => {
    const option = input.trim().toUpperCase();
    console.log(option);

    switch (option.charAt(0)) {
      case 'L':
        listNodes();
        break;
      case 'C':
        dismiss();
        break;
      case 'R':
        removeNode();
        break;
      case 'A':
        addNewNode();
        break;
      default:
        printfInvalidOperation();
        setTimeout(printHeader, 1000); // Wait 1 second before printing the header again
        break;
    }
  });
};