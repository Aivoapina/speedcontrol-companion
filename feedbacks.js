import { combineRgb } from '@companion-module/base';

export function getFeedbacks() {
	const blue = combineRgb(0, 0, 255);
	const green = combineRgb(0, 255, 0);
	const black = combineRgb(0, 0, 0);
	const white = combineRgb(255, 255, 255);
	const yellow = combineRgb(255, 255, 0);

	return {
		playing: {
			name: 'Timer active',
			type: 'advanced',
			options: [],
			callback: () => {
				if (this.state.timerState === 'running') {
					return { text: 'Pause Timer' };
				}
				return { text: 'Start Timer' }
			},
		},
		setTimer: {
			name: 'Shows current timer value',
			type: 'advanced',
			options: [],
			callback: () => {
				let bgColor = black;
				let color = white;
				if (this.state.timerState === 'running') {
					bgColor = blue
				} else if (this.state.timerState === 'finished') {
					bgColor = green;
				} else if (this.state.timerState === 'paused') {
					bgColor = yellow;
					color = black;
				}
				return { text: this.state.timerTime, bgcolor: bgColor, color }
			}
		}
	}
}
