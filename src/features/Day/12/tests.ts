export default {
  1: [
    {
      input: `<x=-1, y=0, z=2>
      <x=2, y=-10, z=-7>
      <x=4, y=-8, z=8>
      <x=3, y=5, z=-1>`,
      expected: `179`,
      params: {
        steps: 10
      }
    },
    {
      input: `<x=-8, y=-10, z=0>
      <x=5, y=5, z=10>
      <x=2, y=-7, z=3>
      <x=9, y=-8, z=-3>`,
      expected: `1940`,
      params: {
        steps: 100
      }
    }
  ],
  2: [
    {
      input: `<x=-1, y=0, z=2>
      <x=2, y=-10, z=-7>
      <x=4, y=-8, z=8>
      <x=3, y=5, z=-1>`,
      expected: `2772`,
      params: {}
    }
  ]
};
