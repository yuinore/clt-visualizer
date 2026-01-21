import type { Distribution } from './base';

/**
 * カスタムFIRフィルタのインパルス応答を計算
 * 8個のサンプル値を-1から1の範囲で指定し、絶対値の総和で正規化
 */
function customFirProbabilities(params: number[]): number[] {
  if (params.length !== 8) {
    // デフォルト値: すべて0（正規化できない場合は[1,0,...]を返す）
    return [1, 0, 0, 0, 0, 0, 0, 0];
  }

  // 絶対値の総和を計算
  const sumAbs = params.reduce((sum, val) => sum + Math.abs(val), 0);

  // 絶対値の総和が0の場合は、デフォルト値を返す
  if (sumAbs === 0) {
    return [1, 0, 0, 0, 0, 0, 0, 0];
  }

  // 絶対値の総和で正規化
  return params.map((val) => val / sumAbs);
}

export const customFir: Distribution = {
  type: 'customFir',
  name: 'customFir',
  probabilities: customFirProbabilities,
  xAxisLabelKey: 'distribution.xAxisTime',
  params: [
    {
      name: 'sample0',
      type: 'number',
      min: -1,
      max: 1,
      step: 0.01,
      defaultValue: 0,
    },
    {
      name: 'sample1',
      type: 'number',
      min: -1,
      max: 1,
      step: 0.01,
      defaultValue: 0,
    },
    {
      name: 'sample2',
      type: 'number',
      min: -1,
      max: 1,
      step: 0.01,
      defaultValue: 0,
    },
    {
      name: 'sample3',
      type: 'number',
      min: -1,
      max: 1,
      step: 0.01,
      defaultValue: 0,
    },
    {
      name: 'sample4',
      type: 'number',
      min: -1,
      max: 1,
      step: 0.01,
      defaultValue: 0,
    },
    {
      name: 'sample5',
      type: 'number',
      min: -1,
      max: 1,
      step: 0.01,
      defaultValue: 0,
    },
    {
      name: 'sample6',
      type: 'number',
      min: -1,
      max: 1,
      step: 0.01,
      defaultValue: 0,
    },
    {
      name: 'sample7',
      type: 'number',
      min: -1,
      max: 1,
      step: 0.01,
      defaultValue: 0,
    },
  ],
};
