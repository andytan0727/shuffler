// Retry dynamic import with React lazy
// Solves dynamic import falls in slow network or other network related issues
// Reference: https://goenning.net/2018/11/16/how-to-retry-dynamic-import-with-react-lazy/
const retryLazy = (lazyFn, retriesLeft = 5, interval = 1500) => {
  return new Promise((resolve, reject) => {
    lazyFn()
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          console.log("retrying failed promise...");

          // falls after retriesLeft
          if (retriesLeft === 1) {
            reject(error);
            return;
          }

          retryLazy(lazyFn, retriesLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
};

export { retryLazy };
