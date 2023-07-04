const WebSocketServer = require('ws').WebSocketServer;

const wss = new WebSocketServer({
  port: 8080
})

module.exports = async function (nodecg) {
  const speedcontrol = nodecg.extensions['nodecg-speedcontrol'];

  wss.on('connection', ws => {
    ws.on('error', console.error);

    ws.on('message', (data) => {
      console.log('received', data.toString());
      sendBundleMsg(nodecg, data.toString())
    });
  })
};

const sendBundleMsg = (nodecg, msg) => {
  nodecg.sendMessageToBundle(msg, 'nodecg-speedcontrol', (err) => { console.log(err)})
}
