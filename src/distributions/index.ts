import type { DistributionMap } from './base';
import { coin } from './coin';
import { dice } from './dice';
import { fir } from './fir';
import { iir } from './iir';
import { uniform } from './uniform';
import { bernoulli } from './bernoulli';
import { poisson } from './poisson';
import { binomial } from './binomial';
import { differential } from './differential';

export const DISTRIBUTIONS: DistributionMap = {
  [coin.type]: coin,
  [dice.type]: dice,
  [fir.type]: fir,
  [iir.type]: iir,
  [uniform.type]: uniform,
  [bernoulli.type]: bernoulli,
  [poisson.type]: poisson,
  [binomial.type]: binomial,
  [differential.type]: differential,
};

export { coin, dice, fir, iir, uniform, bernoulli, poisson, binomial, differential };
export type { Distribution } from './base';
