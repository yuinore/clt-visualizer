import type { DistributionMap } from './base';
import { coin } from './coin';
import { dice } from './dice';
import { fir } from './fir';
import { iir } from './iir';
import { uniform } from './uniform';

export const DISTRIBUTIONS: DistributionMap = {
  [coin.type]: coin,
  [dice.type]: dice,
  [fir.type]: fir,
  [iir.type]: iir,
  [uniform.type]: uniform,
};

export { coin, dice, fir, iir, uniform };
export type { Distribution } from './base';
