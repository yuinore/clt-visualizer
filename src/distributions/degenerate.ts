import type { Distribution } from './base';

// Degenerate distribution: all probability mass at 0
export const degenerate: Distribution = {
  type: 'degenerate',
  name: 'degenerate',
  probabilities: () => ({
    offset: -1,
    distribution: [0, 1, 0],
  }),
  xAxisLabelKey: 'distribution.xAxisValue',
};
