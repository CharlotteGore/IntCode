export type QueueInput = {
  generator: () => AsyncGenerator<number, null, boolean>;
  addItem: (item: number) => void;
  addItems: (items: Array<number>) => void;
  setQueue: (newQueue: Array<number>) => void;
  quit: () => void;
};

const createQueueInput = (array: Array<number>): QueueInput => {
  let quit = false;
  async function* generator(): AsyncGenerator<number, null, boolean> {
    while (!quit) {
      if (array.length) {
        const next = array.pop();
        yield next!;
      } else {
        await itemAvailable();
      }
    }
    return null;
  }

  let unblocker: (() => void) | null = null;

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

  const addItems = (items: Array<number>) => {
    array.unshift(...items);
    if (unblocker) unblocker();
  };

  const setQueue = (newQueue: Array<number>) => {
    array = newQueue;
    if (array.length && unblocker) unblocker();
  };

  const doQuit = () => {
    quit = true;
  };

  return {
    generator,
    addItem,
    addItems,
    setQueue,
    quit: doQuit
  };
};

export default createQueueInput;
