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
  if (a == 0) return b;
  return gcd(b % a, a);
};

export const lcm = (a: number, b: number): number => {
  return (a * b) / gcd(a, b);
};
