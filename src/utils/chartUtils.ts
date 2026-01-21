/**
 * チャート表示用の共通ユーティリティ関数
 */

/**
 * 試行回数に基づいて色相（hue）を取得
 * @param index 試行回数のインデックス（0から始まる）
 * @returns 色相値（0-360）
 */
export function getHue(index: number): number {
  const hues = [0, 25, 50, 70, 120, 180, 210, 250, 290, 330];
  return hues[index % 10];
}

/**
 * 試行回数に基づいて明度（luminance）を取得
 * @param index 試行回数のインデックス（0から始まる）
 * @returns 明度値（0-100）
 */
export function getLuminance(index: number): number {
  const luminances = [70, 60, 50, 48, 60, 50, 60, 70, 70, 70];
  return luminances[index % 10];
}

/**
 * 振幅をdBに変換
 * @param amp 振幅値
 * @returns dB値
 */
export function toDb(amp: number): number {
  return 20 * Math.log10(Math.max(amp, 1e-12));
}
