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

/**
 * Helper function to delay the painting of lazy loaded component
 * to prevent flash screen if the component is loaded too fast (approx <100ms)
 *
 * @param {function():Promise} lazyFun Lazy import function
 * @param {number} [timeout=1000] Timeout to resolve promise and return lazy imported module
 * @returns {Promise<*>}
 */
export const delayLazy = (lazyFun, timeout = 1000) =>
  Promise.all([
    lazyFun(),
    new Promise((resolve) => setTimeout(resolve, timeout)),
  ]).then(([importedModule]) => importedModule);
