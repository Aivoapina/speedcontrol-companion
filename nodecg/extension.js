const WebSocketServer = require('ws').WebSocketServer;

const wss = new WebSocketServer({
  port: 8080
});
let prevRun = {};

const BUNDLE_NAME = 'nodecg-speedcontrol';

module.exports = async function (nodecg) {
  const timerReplicant = nodecg.Replicant('timer', BUNDLE_NAME);
  const runDataActiveRun = nodecg.Replicant('runDataActiveRun', BUNDLE_NAME);
  const donateStatus = nodecg.Replicant('donateStatus', BUNDLE_NAME);

  wss.on('connection', ws => {
    ws.on('error', console.error);

    ws.on('message', (data) => {
      sendBundleMsg(JSON.parse(data.toString()), runDataActiveRun.value)
    });

    timerReplicant.on('change', (newVal, oldVal) => {
      if (!newVal || !oldVal) {
        return;
      }
      if (newVal.time !== oldVal.time || newVal.state !== oldVal.state) {
        const data = JSON.stringify({ type: 'timer', ...newVal });
        ws.send(data);
      }
    });

    donateStatus.on('change', newVal => {
      const data = JSON.stringify({ type: 'donateStatus', value: newVal });
      ws.send(data);
    });

    runDataActiveRun.on('change', (newVal, oldVal) => {
      const data = JSON.stringify({ type: 'runData', ...newVal })
      ws.send(data)
      prevRun = oldVal;
    })
  });

  const sendBundleMsg = (msg, runData) => {
    let payload = null;
    if (msg.type === 'timerStop') {
      payload = { id: msg.id, forfeit: false }
    } else if (msg.type === 'timerUndo') {
      payload = msg.id
    } else if (msg.type === 'twitchStartCommercial') {
      payload = { duration: 180, fromDashboard: false }
    } else if (msg.type === 'changeActiveRun') {
      if (!prevRun) return;
      payload = prevRun.id
    } else if (msg.type === 'donateStatus') {
      donateStatus.value = msg.status
    }
    nodecg.sendMessageToBundle(msg.type, 'nodecg-speedcontrol', payload, (err) => { console.log(err) });
  }
};


