import { IntcodePipe } from "./pipe";

export const createSynchronousOutputPipe = (
  id: number,
  onMessage: (id: number, x: number, y: number) => void
): IntcodePipe => {
  let array: number[] = [];
  async function* generator(): AsyncGenerator<number, null, boolean> {
    while (true) {
      if (array.length) {
        const next = array.pop();
        if (next === null) {
          return null;
        }
        yield next!;
      } else {
        await itemAvailable();
      }
    }
  }

  const itemAvailable = async (): Promise<boolean> => {
    return new Promise(resolve => {
      unblocker = () => {
        unblocker = null;
        resolve(true);
      };
    });
  };

  let unblocker: (() => void) | null = null;

  const addItem = (item: number) => {
    debugger;
    array.push(item);
    if (array.length === 3) {
      onMessage(array[0], array[1], array[2]);
      array = [];
    }

    if (unblocker) unblocker();
  };

  const getId = () => id;

  const close = () => {
    //array.unshift(null);
    //if (unblocker) unblocker();
  };

  return {
    generator,
    addItem,
    close,
    getId,
    setId: () => {
      console.warn("not implemented");
    },
    setDefaultOutput: () => {
      console.warn("not implemented");
    }
  };
};
