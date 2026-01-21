import type { Distribution } from './base';

export const differential: Distribution = {
  type: 'differential',
  name: 'differential',
  probabilities: [0.5, -0.5],
};
