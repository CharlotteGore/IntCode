import produce from 'immer';
import { number } from 'prop-types';

const createStackInput = (array: Array<number> = [])  => {
    let stack = produce(array, draft => draft);
    let done = false;
    let runNextStep: Function | null = null;


   function push (item: number) {
        stack = produce(stack, draft => {
            draft.push(item);
        });
        if (runNextStep) runNextStep();
    }

    function pop () {
        let popped;
        stack = produce(stack, draft => {
            popped = draft.pop();
        });
        return popped;
    }

    function unshift (item: number) {
        stack = produce(stack, draft => {
            draft.unshift(item);
        })
        if (runNextStep) runNextStep();
    }

    function shift () {
        let shifted;
        stack = produce(stack, draft => {
            shifted = draft.shift();
        });
        return shifted;
    }

    async function readyForNext () {
        return new Promise(resolve => {
            runNextStep = () => {
                runNextStep = null;
                resolve(true);
            }
        });
    } 

    async function *generator (): AsyncGenerator<number, null, boolean> {
        while(!done) {
            if (!stack.length) {
                await readyForNext();
            }
            let popped: number;
            stack = produce(stack, draft => {
                popped = draft.pop()!;
            });
            yield popped!;
        }
        return null;
    }

    return {
        push,
        pop,
        unshift,
        shift,
        generator,
    };
}


export default createStackInput;