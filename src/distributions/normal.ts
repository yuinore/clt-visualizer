import type { DiscreteDistribution } from '../types/discreteDistribution';
import type { Distribution } from './base';

function normalProbabilities(params: number[]): DiscreteDistribution {
  if (params.length !== 2) {
    return {
      offset: 0,
      distribution: [1],
    };
  }
  const mean = params[0];
  const std = params[1];
  if (std <= 0) {
    return {
      offset: 0,
      distribution: [1],
    };
  }

  // Normal distribution centered around mean
  // P(X = x) ∝ exp(-(x - mean)^2 / (2 * std^2))
  const sigma = std;
  const halfLength = Math.ceil(sigma * 5);
  const xOffset = Math.round(mean);
  const arrayOffset = xOffset - halfLength;
  const length = Math.ceil(halfLength * 2 + 1);

  // Calculate probabilities for each x value: x = i + arrayOffset
  const arr = Array.from({ length }, (_, i) => {
    const x = i + arrayOffset;
    return Math.exp(-((x - mean) * (x - mean)) / (2 * std * std));
  });

  const sum = arr.reduce((sum, val) => sum + val, 0);
  if (arrayOffset > 0) {
    return {
      offset: 0,
      distribution: [
        // shift the array to the right
        ...Array(arrayOffset).fill(0),
        ...arr.map((val) => val / sum),
      ],
    };
  }
  if (arrayOffset + arr.length < 0) {
    // append (arrayOffset + arr.length) zeros
    return {
      offset: arrayOffset,
      distribution: [
        ...arr.map((val) => val / sum),
        ...Array(-(arrayOffset + arr.length)).fill(0),
      ],
    };
  }
  return {
    offset: arrayOffset,
    distribution: arr.map((val) => val / sum),
  };
}

export const normal: Distribution = {
  type: 'normal',
  name: 'normal',
  probabilities: normalProbabilities,
  xAxisLabelKey: 'distribution.xAxisValue',
  params: [
    {
      name: 'mean',
      type: 'number',
      min: -50,
      max: 50,
      step: 1,
      defaultValue: 10,
    },
    {
      name: 'std',
      type: 'number',
      min: 0.1,
      max: 5.0,
      step: 0.1,
      defaultValue: 3.0,
    },
  ],
};
