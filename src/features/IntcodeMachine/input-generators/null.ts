const createNullInput = () => {
    async function* generator(): AsyncGenerator<number, null, boolean> {
        return null;
    }

    return {
        generator
    }
}

export default createNullInput;