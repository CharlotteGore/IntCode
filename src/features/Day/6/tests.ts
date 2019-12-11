export default {
  1: [
    {
      input: `COM)B
      B)C
      C)D
      D)E
      E)F
      B)G
      G)H
      D)I
      E)J
      J)K
      K)L`,
      expected: `42`,
      params: {}
    }
  ],
  2: [
    {
      input: `COM)B
      B)C
      C)D
      D)E
      E)F
      B)G
      G)H
      D)I
      E)J
      J)K
      K)L
      K)YOU
      I)SAN`,
      expected: `4`,
      params: {
        starTwo: ['YOU', 'SAN']
      }
    }
  ]
};
