import type { Distribution } from './base';

// 2次中心差分 (インデックスが 0 から始まるため、厳密には中心差分ではない)
export const differentialCentral: Distribution = {
  type: 'differentialCentral',
  name: 'differentialCentral',
  probabilities: [0.5, 0, -0.5],
  xAxisLabelKey: 'distribution.xAxisTime',
};
