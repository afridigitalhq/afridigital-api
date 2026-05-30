const http = require('http');

class GossipTransport {
  constructor(nodeId){
    this.nodeId = nodeId;
    this.peers = new Set();
  }

  addPeer(url){
    this.peers.add(url);
  }

  async send(peer, event){
    try{
      const data = JSON.stringify(event);

      const req = http.request(peer + '/mesh/gossip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      });

      req.write(data);
      req.end();
    }catch(e){}
  }

  broadcast(event){
    for(const peer of this.peers){
      this.send(peer, event);
    }
  }
}

module.exports = GossipTransport;
