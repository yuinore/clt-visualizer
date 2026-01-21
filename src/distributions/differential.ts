import type { Distribution } from './base';

// 1次前進差分
export const differential: Distribution = {
  type: 'differential',
  name: 'differential',
  probabilities: [0.5, -0.5],
  xAxisLabelKey: 'distribution.xAxisTime',
};
