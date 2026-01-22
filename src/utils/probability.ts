import { DISTRIBUTIONS } from '../distributions';

export type DistributionType = keyof typeof DISTRIBUTIONS;

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
 * @param count 試行回数
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

/**
 * 確率分布から累積分布関数（CDF）を計算
 * @param distribution 確率分布
 * @returns 累積分布関数（各インデックスiは0からiまでの確率の合計）
 */
export function computeCDF(distribution: number[]): number[] {
  const cdf: number[] = [];
  let cumulative = 0;

  for (let i = 0; i < distribution.length; i++) {
    cumulative += distribution[i];
    cdf.push(cumulative);
  }

  return cdf;
}
