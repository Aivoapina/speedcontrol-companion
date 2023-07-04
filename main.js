import { InstanceBase, Regex, runEntrypoint, InstanceStatus } from '@companion-module/base'
import WebSocket from 'ws'
import UpgradeScripts from './upgrades.js'
import { getActions } from './actions.js';
import UpdateFeedbacks from './feedbacks.js';
import UpdateVariableDefinitions from './variables.js';

class SpeedControl extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

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
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}

  async connectToWS() {
    if (this.ws) {
      await this.disconnectWS();
    } else {
      this.ws = new WebSocket(`ws://${this.config.host}:${this.config.port}`)
    }
  }

  async disconnectWS() {
    if (this.ws) {
      this.ws.close();
    }
  }

  async sendMessage(type) {
    console.log('Sending message', type);
    this.ws.send(type, (err) => {
      console.log(err)
    })
  }
}

runEntrypoint(SpeedControl, UpgradeScripts)
