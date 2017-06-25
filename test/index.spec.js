import test from 'ava'

import Promise from '../src/index'
import BlueBird from 'bluebird'

test('Can create a new Promise', (t) => {
  const promise = new Promise(() => { })
  t.truthy(promise)
})

test('Is .then a function', (t) => {
  const promise = new Promise(() => { });
  t.truthy(promise.then);
})

test('Is first arg of a promise a function', (t) => {
  let callback = (resolve, reject) => {
    t.pass();
  }
  const promise = new Promise(callback);
  t.plan(1);
})

test('callback receieves resolve/reject arguments', (t) => {
  let callback = (resolve, reject) => {
    t.is(typeof resolve, 'function');
    t.is(typeof reject, 'function');
  }
  const promise = new Promise(callback);
  t.plan(2);
})

test('Initial state is pending', (t) => {
  const promise = new Promise(() => { });
  t.is(promise.state, "pending");
})

test('Test change state to fulfilled', (t) => {
  let callback = (resolve, reject) => {
    resolve();
  }

  const promise = new Promise(callback);
  t.is(promise.state, "fulfilled");
  t.plan(1);
})

test('Test change state to rejected', (t) => {
  let callback = (resolve, reject) => {
    reject();
  }

  const promise = new Promise(callback);
  t.is(promise.state, "rejected");
  t.plan(1);
})

test('Test .then is a callback', (t) => {
  let callback = (resolve, reject) => {
    resolve();
  }
  const promise = new Promise(callback);
  promise.then(() => {
    t.pass();
  });
  t.plan(1);
})

test('Test .then is a callback with an argument', (t) => {
  let callback = (resolve, reject) => {
    resolve(5);
  }
  const promise = new Promise(callback);
  promise.then((response) => {
    t.is(response, 5);
  });
  t.plan(1);
})

test('Test .then is a async callback with an argument', (t) => {
  return new global.Promise((done) => {
    let callback = (resolve, reject) => {
      setTimeout(() => {
        resolve(5);
      }, 1000)
    }
    const promise = new Promise(callback);
    promise.then((response) => {
      t.is(response, 5);
      done();
    });

    t.plan(1);
  })
})


test('Test .catch is a callback', (t) => {
  let callback = (resolve, reject) => {
    reject();
  }
  const promise = new Promise(callback);
  promise.catch(() => {
    t.pass();
  });

  t.plan(1);
})

test('Test .catch is a callback with an argument', (t) => {
  let callback = (resolve, reject) => {
    reject(5);
  }
  const promise = new Promise(callback);
  promise.catch((response) => {
    t.is(response, 5);
  });
  t.plan(1);
})

test('Test .catch is a async callback with an argument', (t) => {
  return new global.Promise((done) => {
    let callback = (resolve, reject) => {
      setTimeout(() => {
        reject(5);
      }, 1000)
    }
    const promise = new Promise(callback);
    promise.catch((response) => {
      t.is(response, 5);
      done();
    });

    t.plan(1);
  })
})

test('Test .then chaining', (t) => {
  const promise1 = new Promise((resolve, reject) => {
    resolve(1);
  });
  const promise2 = promise1.then((response) => {
    t.is(response, 1);
    return 2;
  });
  const promise3 = promise2.then((response) => {
    t.is(response, 2);
    return 3;
  })
  promise3.then((response) => {
    t.is(response, 3);
  })
  t.plan(3);
})

test('Test async .then chaining', (t) => {
  return new global.Promise((done) => {
    const promise1 = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1);
      }, 1000)
    });

    const promise2 = promise1.then((response) => {
      t.is(response, 1);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(2);
        }, 1000)
      });
    });

    promise2.then((response) => {

      t.is(response, 2);
      done();
    })
    t.plan(2);
  });
})



test('Test promise.all passes', (t) => {
  return new global.Promise((done) => {
    const promise = Promise.all([
      new Promise((resolve)=>{
        resolve(1);
      }),
      new Promise((resolve)=>{
        resolve(2);
      })
    ]);

    promise.then((response)=>{
      t.is(response[0], 1);
      t.is(response[1], 2);
      done();
    })

    t.plan(2);
  })
  
});
// const promise = new Promise((resolve, reject)=>{
//     setTimeout(()=>{
//       resolve(1);
//     },3000);
// })

// promise.then(()=>{
//   return fetch("")
// })