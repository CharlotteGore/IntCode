export default {
  1: [
    {
      input: `x=495, y=2..7
      y=7, x=495..501
      x=501, y=3..7
      x=498, y=2..4
      x=506, y=1..2
      x=498, y=10..13
      x=504, y=10..13
      y=13, x=498..504`,
      expected: `57`,
      params: {
        starOne: {
          water: [500, 0]
        }
      }
    }
  ],
  2: [
    {
      input: ``,
      expected: ``,
      params: {}
    }
  ]
};
