export type DistributionType = 'coin' | 'dice';

export interface Distribution {
  type: DistributionType;
  name: string;
  probabilities: number[];
}

export const DISTRIBUTIONS: Record<DistributionType, Distribution> = {
  coin: {
    type: 'coin',
    name: 'coin',
    probabilities: [0.5, 0.5],
  },
  dice: {
    type: 'dice',
    name: 'dice',
    probabilities: [0, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6],
  },
};

/**
 * 2つの確率分布を畳み込む
 * @param dist1 最初の確率分布
 * @param dist2 2番目の確率分布
 * @returns 畳み込み結果の確率分布
 */
export function convolve(dist1: number[], dist2: number[]): number[] {
  const result: number[] = [];
  const maxIndex = dist1.length + dist2.length - 2;

  for (let i = 0; i <= maxIndex; i++) {
    let sum = 0;
    for (let j = 0; j < dist1.length; j++) {
      const k = i - j;
      if (k >= 0 && k < dist2.length) {
        sum += dist1[j] * dist2[k];
      }
    }
    result.push(sum);
  }

  return result;
}

/**
 * 同じ確率分布を複数回畳み込む
 * @param distribution 元の確率分布
 * @param count 畳み込み回数
 * @returns 畳み込み結果の確率分布
 */
export function convolveMultiple(
  distribution: number[],
  count: number
): number[] {
  if (count <= 0) {
    return [];
  }
  if (count === 1) {
    return [...distribution];
  }

  let result = [...distribution];
  for (let i = 1; i < count; i++) {
    result = convolve(result, distribution);
  }

  return result;
}
