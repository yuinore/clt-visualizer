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
}

export type DistributionMap = Record<string, Distribution>;
