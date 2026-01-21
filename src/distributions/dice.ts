import type { Distribution } from './base';

export const dice: Distribution = {
  type: 'dice',
  name: 'dice',
  probabilities: [0, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 0],
  xAxisLabelKey: 'distribution.xAxisSum',
};
