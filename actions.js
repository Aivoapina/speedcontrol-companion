export function getActions() {
  return {
    startTimer: {
      name: 'Start/pause Timer',
      options: [],
      callback: () => {
        if (this.state.timerState === 'running') {
          this.sendMessage('timerPause');
        } else {
          this.sendMessage('timerStart');
        }
      }
    },
    pauseTimer: {
      name: 'Pause Timer',
      options: [],
      callback: () => {
        this.sendMessage('timerPause')
      }
    },
    resetTimer: {
      name: 'Reset Timer',
      options: [],
      callback: () => {
        this.sendMessage('timerReset')
      }
    },
    stopTimer: {
      name: 'Stop Timer',
      options: [],
      callback: () => {
        this.sendMessage('timerStop')
      }
    },
    undoTimer: {
      name: 'Undo Timer',
      options: [],
      callback: () => {
        this.sendMessage('timerUndo')
      }
    },
    changeToNextRun: {
      name: 'Change to next run',
      options: [],
      callback: () => {
        this.sendMessage('changeToNextRun')
      }
    },
    changeToPrevRun: {
      name: 'Change to previous run',
      options: [],
      callback: () => {
        this.sendMessage('changeActiveRun')
      }
    },
    twitchStartCommercial: {
      name: 'Run Twitch Commercial',
      options: [],
      callback: () => {
        this.sendMessage('twitchStartCommercial')
      }
    }
  }
}
