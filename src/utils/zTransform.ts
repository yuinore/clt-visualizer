export interface AmplitudePoint {
  angularFrequency: number;
  amplitude: number;
}

/**
 * 離散確率分布のz変換を計算し、振幅特性を返す
 * @param distribution 確率分布（配列のインデックスがn、値がp[n]）
 * @param numPoints 計算する点の数（デフォルト: 512）
 * @param maxAngularFrequency 最大角周波数（デフォルト: π）
 * @returns 角周波数と振幅のペアの配列
 */
export function computeZTransform(
  distribution: number[],
  numPoints: number = 512,
  maxAngularFrequency: number = Math.PI
): AmplitudePoint[] {
  const result: AmplitudePoint[] = [];

  for (let i = 0; i < numPoints; i++) {
    const omega = (i / (numPoints - 1)) * maxAngularFrequency;

    let realPart = 0;
    let imagPart = 0;

    for (let n = 0; n < distribution.length; n++) {
      const pn = distribution[n];
      if (pn === 0) continue;

      // z^(-n) = (cos(ω) - i*sin(ω))^n = cos(-nω) + i*sin(-nω)
      const angle = -n * omega;
      const cosAngle = Math.cos(angle);
      const sinAngle = Math.sin(angle);

      realPart += pn * cosAngle;
      imagPart += pn * sinAngle;
    }

    const amplitude = Math.sqrt(realPart * realPart + imagPart * imagPart);
    result.push({
      angularFrequency: omega,
      amplitude,
    });
  }

  return result;
}

/**
 * ステップ関数の振幅特性を計算
 * ステップ関数の振幅特性: 1 / √(2 - 2 cos ω)
 * @param omega 角周波数
 * @returns ステップ関数の振幅特性値
 */
export function computeStepFunctionAmplitude(omega: number): number {
  // ω = 0 の場合は特異点なので、極限値を計算
  if (Math.abs(omega) < 1e-10) {
    // ω → 0 のとき、1 / √(2 - 2 cos ω) → 1 / |ω| (近似)
    // 実際には、CDFのz変換自体がω=0で有限値を持つため、適切な値を使用
    return 1.0;
  }
  
  const denominator = 2 - 2 * Math.cos(omega);
  if (denominator < 1e-10) {
    return 1.0;
  }
  
  return 1.0 / Math.sqrt(denominator);
}

/**
 * 確率分布のz変換結果にステップ関数の振幅特性を掛けて、CDFの振幅特性を計算
 * CDFを直接フーリエ変換すると発散するため、確率分布のz変換結果に
 * ステップ関数の振幅特性 1 / √(2 - 2 cos ω) を掛けることで算出する
 * @param amplitudeData 確率分布のz変換結果（振幅特性）
 * @returns CDFの振幅特性
 */
export function computeCDFAmplitudeFromDistribution(
  amplitudeData: AmplitudePoint[]
): AmplitudePoint[] {
  return amplitudeData.map((point) => {
    const stepAmplitude = computeStepFunctionAmplitude(point.angularFrequency);
    return {
      angularFrequency: point.angularFrequency,
      amplitude: point.amplitude * stepAmplitude,
    };
  });
}
