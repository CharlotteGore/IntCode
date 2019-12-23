export interface IntcodePipe {
  generator: () => AsyncGenerator<number, null, boolean>;
  addItem: (item: number) => void;
  close: () => void;
  setId: (id: string | number) => void;
  getId: () => string | number | null;
  setDefaultOutput: (value: number) => void;
}

const createIntcodePipe = (array: Array<number | null> = []): IntcodePipe => {
  let _id: string | number | null = null;
  let defaultOutput: number | null = null;
  async function* generator(): AsyncGenerator<number, null, boolean> {
    while (true) {
      if (array.length) {
        const next = array.pop();
        if (next === null) {
          return null;
        }
        yield next!;
      } else if (defaultOutput !== null) {
        yield defaultOutput;
      } else {
        await itemAvailable();
      }
    }
  }

  let unblocker: (() => void) | null = null;

  const setDefaultOutput = (value: number) => {
    defaultOutput = value;
  };

  const itemAvailable = async (): Promise<boolean> => {
    return new Promise(resolve => {
      unblocker = () => {
        unblocker = null;
        resolve(true);
      };
    });
  };

  const addItem = (item: number) => {
    array.unshift(item);
    if (unblocker) unblocker();
  };

  const setId = (id: string | number) => {
    _id = id;
  };

  const getId = () => _id;

  const close = () => {
    array.unshift(null);
    if (unblocker) unblocker();
  };

  return {
    generator,
    addItem,
    close,
    getId,
    setId,
    setDefaultOutput
  };
};

export default createIntcodePipe;
