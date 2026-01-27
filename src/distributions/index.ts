import type { DistributionMap } from './base';
import { coin } from './coin';
import { dice } from './dice';
import { diceLoaded } from './diceLoaded';
import { fir } from './fir';
import { iir } from './iir';
import { uniform } from './uniform';
import { bernoulli } from './bernoulli';
import { poisson } from './poisson';
import { binomial } from './binomial';
import { differential } from './differential';
import { differentialCentral } from './differentialCentral';
import { degenerate } from './degenerate';
import { lattice } from './lattice';
import { customFir } from './customFir';
import { zeta } from './zeta';
import { normal } from './normal';

export const DISTRIBUTIONS: DistributionMap = {
  [coin.type]: coin,
  [dice.type]: dice,
  [diceLoaded.type]: diceLoaded,
  [fir.type]: fir,
  [iir.type]: iir,
  [uniform.type]: uniform,
  [bernoulli.type]: bernoulli,
  [poisson.type]: poisson,
  [binomial.type]: binomial,
  [differential.type]: differential,
  [differentialCentral.type]: differentialCentral,
  [degenerate.type]: degenerate,
  [lattice.type]: lattice,
  [customFir.type]: customFir,
  [zeta.type]: zeta,
  [normal.type]: normal,
};

export {
  coin,
  dice,
  diceLoaded,
  fir,
  iir,
  uniform,
  bernoulli,
  poisson,
  binomial,
  differential,
  differentialCentral,
  degenerate,
  lattice,
  customFir,
  zeta,
  normal,
};
export type { Distribution } from './base';
