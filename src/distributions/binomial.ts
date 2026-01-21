import type { Distribution } from './base';

/**
 * 組み合わせ C(n, k) = n! / (k! * (n-k)!)
 */
function combination(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  
  // 計算効率のため、C(n,k) = C(n, n-k) を利用
  k = Math.min(k, n - k);
  
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = result * (n - i) / (i + 1);
  }
  return result;
}

/**
 * 二項分布の確率質量関数
 * P(X=k) = C(n,k) * p^k * (1-p)^(n-k)
 */
function binomialProbabilities(params: number[]): number[] {
  if (params.length !== 2) {
    return [1];
  }
  const n = Math.floor(params[0]);
  const p = params[1];
  
  if (n < 1) {
    return [1];
  }
  if (p < 0) {
    return Array(n + 1).fill(0).map((_, k) => k === 0 ? 1 : 0);
  }
  if (p > 1) {
    return Array(n + 1).fill(0).map((_, k) => k === n ? 1 : 0);
  }

  const probabilities: number[] = [];
  for (let k = 0; k <= n; k++) {
    const comb = combination(n, k);
    const prob = comb * Math.pow(p, k) * Math.pow(1 - p, n - k);
    probabilities.push(prob);
  }

  return probabilities;
}

export const binomial: Distribution = {
  type: 'binomial',
  name: 'binomial',
  probabilities: binomialProbabilities,
  params: [
    {
      name: 'n',
      type: 'number',
      min: 1,
      max: 20,
      step: 1,
      defaultValue: 10,
    },
    {
      name: 'p',
      type: 'number',
      min: 0.05,
      max: 0.95,
      step: 0.05,
      defaultValue: 0.5,
    },
  ],
};
