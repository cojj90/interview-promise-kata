//delete global.Promise

class Promise {

    static all(promises) {

        let total = promises.length;
        let resolveCounter = 0;
        let values = [];
        return new Promise((resolve, reject) => {
            promises.forEach((promise, index) => {
                promise.then((result) => {
                    values[index] = result;
                    resolveCounter++;
                    if (resolveCounter === total) resolve(values);
                })
            });
        })

    }

    constructor(callback) {
        this.resolve = this.resolve.bind(this);
        this.reject = this.reject.bind(this);
        this.state = "pending";
        callback(this.resolve, this.reject);
    }

    then(callback) {

        return new Promise((resolve) => {
            const handleCallback = () => {
                const nextValue = callback(this.value);

                if (nextValue instanceof Promise) {
                    nextValue.then(resolve);
                } else {
                    resolve(nextValue);
                }
            };

            if (this.state === "fulfilled") {
                handleCallback();
            } else {
                this.thenCallback = handleCallback;
            }
        })

    }

    catch(callback) {
        if (this.state === "rejected") {
            callback(this.value);
        } else {
            this.catchCallback = callback;
        }
    }

    resolve(value) {
        this.state = "fulfilled";
        this.value = value;

        if (typeof this.thenCallback !== 'undefined') this.thenCallback(this.value);
    }

    reject(value) {
        this.state = "rejected";
        this.value = value;

        if (typeof this.catchCallback !== 'undefined') this.catchCallback(this.value);

    }
}

export default Promise
