export interface DistributionParam {
  name: string;
  type: 'number';
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface Distribution {
  type: string;
  name: string;
  probabilities: number[] | ((params: number[]) => number[]);
  params?: DistributionParam[];
  /**
   * i18n key for x-axis label of the probability chart
   * e.g. 'distribution.xAxisSum'
   */
  xAxisLabelKey?: DistributionXAxisKey;
}

/**
 * Keys for x-axis labels per distribution.
 */
export type DistributionXAxisKey =
  | 'distribution.xAxis'
  | 'distribution.xAxisSum'
  | 'distribution.xAxisSuccessCount'
  | 'distribution.xAxisOccurrenceCount'
  | 'distribution.xAxisValue'
  | 'distribution.xAxisTime';

export type DistributionMap = Record<string, Distribution>;
