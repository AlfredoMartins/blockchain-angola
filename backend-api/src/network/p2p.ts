import { Console } from "console";
import { HashMap } from "../blockchain/data_types";
import axios from 'axios';

export interface Data {
    peerId: string,
    url: string
}

class P2P {
    peers: Map<string, Data>;
    myPeer: Data;

    constructor() {
        this.peers = new Map<string, Data>();
    }

    public addPeer(data: Data) {
        if (!this.containsPeer(data.peerId) && data.peerId !== this.myPeer.peerId) {
            this.peers.set(data.peerId, data);
        }
    }

    public setMyPeerData(data: Data) {
        this.myPeer = data;
    }

    public removePeer(peerId) {
        this.peers.delete(peerId);
    }

    public containsPeer(peerId: string) {
        return this.peers.has(peerId);
    }

    public getPeers() {
        const arr: Data[] = [];
        this.peers.forEach((value, key) => {
            arr.push(value);
        });

        return arr;
    }

    public async broadcastPeers(data: Data) {
        const newNodeUrl = data.url;
        this.addPeer(data);

        const peers = Array.from(this.peers.values());
        const requests = [];
        peers.forEach(x => {
            const opt = {
                url: x.url + "/register-node",
                method: "post",
                data: data,
            };

            requests.push(axios(opt));
        });

        try {
            await Promise.all(requests)
                .then(x => {
                    const opt = {
                        url: newNodeUrl + "/register-nodes-bulk",
                        method: "post",
                        data: { nodes: [...peers, this.myPeer] }
                    };

                    return axios(opt);
                }).then(x => {
                    //console.log(x);
                })
                .catch(error => {
                    console.log("Error: ", error);
                });
        } catch (error) {
            console.error('Error occurred during the broadcast:', error);
        }
    }

}

module.exports = P2P;