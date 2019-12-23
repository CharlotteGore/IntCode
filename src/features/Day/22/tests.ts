export default {
  1: [
    {
      input: `deal with increment 7
      deal into new stack
      deal into new stack`,
      expected: 1,
      params: {
        l: 10,
        c: 3
      }
    },
    {
      input: `cut 6
      deal with increment 7
      deal into new stack`,
      expected: 0,
      params: {
        l: 10,
        c: 3
      }
    },
    {
      input: `deal with increment 7
      deal with increment 9
      cut -2`,
      expected: 1,
      params: {
        l: 10,
        c: 3
      }
    },
    {
      input: `deal into new stack
      cut -2
      deal with increment 7
      cut 8
      cut -4
      deal with increment 7
      cut 3
      deal with increment 9
      deal with increment 3
      cut -1`,
      expected: 8,
      params: {
        l: 10,
        c: 3
      }
    }
  ],
  2: [
    /* {
      input: ``,
      expected: ``,
      params: {}
    } */
  ]
};
