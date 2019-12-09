export type NullInput = {
  generator: () => AsyncGenerator<number, null, boolean>;
  quit: () => void;
};

const createNullInput = () => {
  async function* generator(): AsyncGenerator<number, null, boolean> {
    return null;
  }

  const doQuit = () => {};

  return {
    generator,
    quit: doQuit
  };
};

export default createNullInput;
