const createArrayInput = (array: Array<number>) => {
    async function* generator (): AsyncGenerator<number, null, boolean> {
        for (let i = 0; i < array.length; i++) {
            yield array[i];
        }
        return null;
    }

    return {
        generator
    }
}

export default createArrayInput;