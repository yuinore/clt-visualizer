import type { DiscreteDistribution } from '../types/discreteDistribution';
import type { Distribution } from './base';

/**
 * Threshold for truncating the impulse response: we stop when α^(n-1) falls below this.
 * Using the approximation h[n] ∝ α^(n-1) to determine the effective length.
 */
const IMPULSE_RESPONSE_THRESHOLD = 0.005;

/**
 * Minimum length of the impulse response.
 */
const IMPULSE_RESPONSE_MIN_LENGTH = 6;

function iirFirstOrderLowpassProbabilities(
  params: number[],
): DiscreteDistribution {
  if (params.length !== 1) {
    return { offset: 0, distribution: [1] };
  }
  const alpha = params[0];
  if (alpha < 0 || alpha > 0.95) {
    return { offset: 0, distribution: [1] };
  }

  let length: number;
  if (alpha === 0) {
    length = 2; // 可視化の都合で、最低でも 2 点は表示する
  } else {
    length = Math.max(
      2,
      Math.ceil(Math.log(IMPULSE_RESPONSE_THRESHOLD) / Math.log(alpha)) + 1,
    );
  }

  length = Math.max(length, IMPULSE_RESPONSE_MIN_LENGTH);

  const distribution = Array.from(
    { length },
    (_, k) => (1 - alpha) * Math.pow(alpha, k),
  );

  // 打ち切りによる直流ゲインの誤差を補正する (正規化)
  const sum = distribution.reduce((a, b) => a + b, 0);
  const normalized = sum > 0 ? distribution.map((v) => v / sum) : [1];

  return {
    offset: 0,
    distribution: normalized,
  };
}

export const iirFirstOrderLowpass: Distribution = {
  type: 'iirFirstOrderLowpass',
  name: 'iirFirstOrderLowpass',
  probabilities: iirFirstOrderLowpassProbabilities,
  xAxisLabelKey: 'distribution.xAxisTime',
  params: [
    {
      name: 'alpha',
      type: 'number',
      min: 0,
      max: 0.95,
      step: 0.01,
      defaultValue: 0.5,
    },
  ],
};
