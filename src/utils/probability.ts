import type { DiscreteDistribution } from '../types/discreteDistribution';

/**
 * 2つの確率分布を畳み込む
 * @param dist1 最初の確率分布
 * @param dist2 2番目の確率分布
 * @returns 畳み込み結果の確率分布
 */
export function convolve(
  dist1WithOffset: DiscreteDistribution,
  dist2WithOffset: DiscreteDistribution,
): DiscreteDistribution {
  const dist1 = dist1WithOffset.distribution;
  const dist2 = dist2WithOffset.distribution;

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

  return {
    offset: dist1WithOffset.offset + dist2WithOffset.offset,
    distribution: result,
  };
}

/**
 * 確率分布から累積分布関数（CDF）を計算
 * @param distribution 確率分布
 * @returns 累積分布関数（各インデックスiは0からiまでの確率の合計）
 */
export function computeCDF(
  distribution: DiscreteDistribution,
): DiscreteDistribution {
  const cdfDistribution: DiscreteDistribution = {
    offset: distribution.offset,
    distribution: [],
  };

  let cumulative = 0;

  for (let i = 0; i < distribution.distribution.length; i++) {
    cumulative += distribution.distribution[i];
    cdfDistribution.distribution.push(cumulative);
  }

  return cdfDistribution;
}
