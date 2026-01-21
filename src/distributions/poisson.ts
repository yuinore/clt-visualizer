import type { Distribution } from './base';

/**
 * 階乗を計算する
 */
function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * ポアソン分布の確率質量関数
 * P(X=k) = (λ^k * e^(-λ)) / k!
 */
function poissonProbabilities(params: number[]): number[] {
  if (params.length !== 1) {
    return [1];
  }
  const lambda = params[0];
  if (lambda <= 0) {
    return [1];
  }

  // 実用的な範囲で計算（確率が十分に小さくなるまで）
  const probabilities: number[] = [];
  const maxK = Math.min(50, Math.ceil(lambda * 3 + 10)); // 3σ + 余裕を持たせる
  
  for (let k = 0; k <= maxK; k++) {
    const logProb = k * Math.log(lambda) - lambda - Math.log(factorial(k));
    const prob = Math.exp(logProb);
    probabilities.push(prob);
    
    // 確率が非常に小さくなったら終了
    if (prob < 1e-5 && k > lambda) {
      break;
    }
  }

  // 正規化（浮動小数点誤差の補正）
  const sum = probabilities.reduce((a, b) => a + b, 0);
  return probabilities.map(p => p / sum);
}

export const poisson: Distribution = {
  type: 'poisson',
  name: 'poisson',
  probabilities: poissonProbabilities,
  params: [
    {
      name: 'lambda',
      type: 'number',
      min: 0.5,
      max: 10,
      step: 0.5,
      defaultValue: 2,
    },
  ],
};
