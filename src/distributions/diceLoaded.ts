import type { Distribution } from './base';

export const diceLoaded: Distribution = {
  type: 'diceLoaded',
  name: 'diceLoaded',
  probabilities: [0, 8 / 24, 2 / 24, 2 / 24, 2 / 24, 5 / 24, 5 / 24, 0],
  xAxisLabelKey: 'distribution.xAxisSum',
};
