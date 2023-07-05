const WebSocketServer = require('ws').WebSocketServer;

const wss = new WebSocketServer({
  port: 8080
});
let prevRun = {};

module.exports = async function (nodecg) {
  const timerReplicant = nodecg.Replicant('timer', 'nodecg-speedcontrol');
  const runDataActiveRun = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');

  wss.on('connection', ws => {
    ws.on('error', console.error);

    ws.on('message', (data) => {
      sendBundleMsg(nodecg, data.toString(), runDataActiveRun.value)
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
  });
  runDataActiveRun.on('change', (newVal, oldVal) => {
    prevRun = oldVal;
  })
};

const sendBundleMsg = (nodecg, msg, runData) => {
  let payload = null;
  if (msg === 'timerStop') {
    payload = { id: runData.teams[0].id, forfeit: false }
  } else if (msg === 'timerUndo') {
    payload = runData.teams[0].id
  } else if (msg === 'twitchStartCommercial') {
    payload = { duration: 180, fromDashboard: false }
  } else if (msg === 'changeActiveRun') {
    if (!prevRun) return;
    payload = prevRun.id
  }
  nodecg.sendMessageToBundle(msg, 'nodecg-speedcontrol', payload, (err) => { console.log(err) });
}
