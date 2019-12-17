export const allPermutations = <T>(input: Array<T>): Array<Array<T>> => {
  const results: Array<Array<T>> = [];

  if (input.length === 1) return [input];
  if (input.length === 0) return [];

  for (let i = 0; i < input.length; i++) {
    // recurse into allPermutations with all elements removed except input[i]
    let permutations = allPermutations([
      ...input.slice(0, i),
      ...input.slice(i + 1)
    ]);
    // then make a new permutation with input[i] concated with each permutation.
    for (const permutation of permutations) {
      results.push([input[i], ...permutation]);
    }
  }

  return results;
};

export const gcd = (a: number, b: number): number => {
  if (a === 0) return b;
  return gcd(b % a, a);
};

export const lcm = (a: number, b: number): number => {
  return (a * b) / gcd(a, b);
};

export const generate = <T>(
  count: number,
  fn: (index?: number) => T
): Array<T> => {
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(fn(i));
  }
  return results;
};

export const binaryIntSearch = (testCallback: (value: number) => boolean) => {
  let lo = 0;
  let hi = 1;
  let valuesTested: Array<number> = [];
  // phase one, rapidly find some rough upper limit
  while (testCallback(hi)) {
    lo = hi;
    hi = hi * 2;
  }
  // phase two, begin the actual binary search
  while (true) {
    if (valuesTested.includes(hi)) {
      return lo;
    }
    const r = testCallback(hi);
    valuesTested.push(hi);
    if (!r) {
      // lower hi because we're beyond the target...
      hi = hi - Math.floor((hi - lo) / 2);
    } else {
      // increase hi and lo because we're below the target
      let oldlo = lo;
      lo = hi;
      hi = hi + Math.floor((hi - oldlo) / 2);
    }
  }
};
