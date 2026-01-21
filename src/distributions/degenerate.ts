import type { Distribution } from './base';

// Degenerate distribution: all probability mass at 0
export const degenerate: Distribution = {
  type: 'degenerate',
  name: 'degenerate',
  probabilities: [1,0],
  xAxisLabelKey: 'distribution.xAxisValue',
};
