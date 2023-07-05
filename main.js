import { InstanceBase, Regex, runEntrypoint, InstanceStatus } from '@companion-module/base'
import WebSocket from 'ws'
import UpgradeScripts from './upgrades.js'
import { getActions } from './actions.js';
import { getFeedbacks } from './feedbacks.js';
import { getVariables } from './variables.js';

class SpeedControl extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	state = {
		timerState: 'stopped',
		timerTime: '00:00:00'
	}

	reconnectInterval = null;

	async init(config) {
		this.config = config

		this.updateStatus(InstanceStatus.Ok)

		if (this.config.host && this.config.port) {
			await this.connectToWS()
		} else if (this.config.host && !this.config.port) {
			this.updateStatus('bad_config', 'Missing WebSocket Server port')
		} else if (!this.config.host && this.config.port) {
			this.updateStatus('bad_config', 'Missing WebSocket Server IP address or hostname')
		} else {
			this.updateStatus('bad_config', 'Missing WebSocket Server connection info')
		}

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
	}

	async destroy() {
		this.log('debug', 'destroy');
		this.disconnectWS();
	}

	async configUpdated(config) {
		this.init(config)
	}

	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Websocket IP',
				width: 8,
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Websocket Port',
				width: 4,
				regex: Regex.PORT,
			},
		]
	}

	updateActions() {
		const actions = getActions.bind(this)()
		this.setActionDefinitions(actions)
	}

	updateFeedbacks() {
		const feedbacks = getFeedbacks.bind(this)();
		this.setFeedbackDefinitions(feedbacks);
	}

	updateVariableDefinitions() {
		const variables = getVariables.bind(this)();
		this.setVariableDefinitions(variables);
	}

	async connectToWS() {
		if (this.ws) {
			await this.disconnectWS();
		} else {
			this.ws = new WebSocket(`ws://${this.config.host}:${this.config.port}`);
			this.ws.on('error', () => this.tryReconnectWS());
			this.startFeedbackListener();
		}
	}

	async tryReconnectWS() {
		console.log('Trying to reconnect');
		this.stopReconnectInterval();
		this.reconnectInterval = setInterval(() => {
			this.connectToWS();
		}, 5000);
	}

	async stopReconnectInterval() {
		if (this.reconnectInterval) {
			clearInterval(this.reconnectInterval)
			this.reconnectInterval
		}
	}

	async disconnectWS() {
		if (this.ws) {
			this.ws.close();
			this.ws = null;
		}
	}

	async sendMessage(type) {
		this.ws.send(type, (err) => {
			console.log(err)
		})
	}

	async startFeedbackListener() {
		this.ws.on('message', data => {
			const parsedData = JSON.parse(data.toString());
			if (parsedData.type === 'timer') {
				this.state.timerTime = parsedData.time;
				this.state.timerState = parsedData.state;
				this.checkFeedbacks();
			}
		})
	}

}

runEntrypoint(SpeedControl, UpgradeScripts)
