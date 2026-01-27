/**
 * 離散的な確率分布 (確率質量関数、または、累積分布関数)
 */
export interface DiscreteDistribution {
  offset: number;
  distribution: number[];
}

export function isDiscreteDistribution(
  distribution: any,
): distribution is DiscreteDistribution {
  return (
    typeof distribution === 'object' &&
    'offset' in distribution &&
    'distribution' in distribution
  );
}

export function cloneDiscreteDistribution(
  distribution: DiscreteDistribution,
): DiscreteDistribution {
  return {
    offset: distribution.offset,
    distribution: [...distribution.distribution],
  };
}

export function limitRange(
  distribution: DiscreteDistribution,
  min: number,
  max: number,
): DiscreteDistribution {
  // clone only if mutation is needed
  let result = distribution;

  const currentMin = result.offset;
  if (currentMin < min) {
    // ignore first (min - currentMin) elements
    result = {
      offset: min,
      distribution: [...result.distribution.slice(min - currentMin)],
    };
  }

  const currentMax = result.offset + result.distribution.length - 1;
  if (currentMax > max) {
    // ignore last (currentMax - max) elements
    const ignoreCount = currentMax - max;
    result = {
      offset: result.offset,
      distribution: [
        ...result.distribution.slice(
          0,
          result.distribution.length - ignoreCount,
        ),
      ],
    };
  }
  return result;
}
