const playerNumberOption = {
  type: 'number',
  label: 'Player number',
  id: 'playerNum',
  default: 1,
  min: 1,
  max: 4,
  range: false
}

export function getActions() {
  return {
    startTimer: {
      name: 'Start/pause Timer',
      options: [],
      callback: () => {
        if (this.state.timerState === 'running') {
          this.sendMessage({ type: 'timerPause' });
        } else {
          this.sendMessage({ type: 'timerStart' });
        }
      }
    },
    pauseTimer: {
      name: 'Pause Timer',
      options: [],
      callback: () => {
        this.sendMessage({ type: 'timerPause' })
      }
    },
    resetTimer: {
      name: 'Reset Timer',
      options: [],
      callback: () => {
        this.sendMessage({ type: 'timerReset' })
      }
    },
    stopTimer: {
      name: 'Stop Timer',
      options: [
        playerNumberOption
      ],
      callback: (action) => {
        const { playerNum } = action.options;
        this.sendMessage({ type: 'timerStop', id: this.state.teams[playerNum - 1].id })
      }
    },
    undoTimer: {
      name: 'Undo Timer',
      options: [playerNumberOption],
      callback: (action) => {
        const { playerNum } = action.options;
        this.sendMessage({ type: 'timerUndo', id: this.state.teams[playerNum - 1].id })
      }
    },
    changeToNextRun: {
      name: 'Change to next run',
      options: [],
      callback: () => {
        this.sendMessage({ type: 'changeToNextRun' })
      }
    },
    changeToPrevRun: {
      name: 'Change to previous run',
      options: [],
      callback: () => {
        this.sendMessage({ type: 'changeActiveRun' })
      }
    },
    twitchStartCommercial: {
      name: 'Run Twitch Commercial',
      options: [],
      callback: () => {
        this.sendMessage({ type: 'twitchStartCommercial' })
      }
    },
    toggleDonationStatus: {
      name: 'Change donation status',
      options: [],
      callback: () => {
        this.sendMessage({ type: 'donateStatus', status: !this.state.donateStatus })
      }
    }
  }
}
