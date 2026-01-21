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
    const zReal = Math.cos(omega);
    const zImag = Math.sin(omega);

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
