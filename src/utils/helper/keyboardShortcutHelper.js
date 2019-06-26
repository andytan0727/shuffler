import { useRef, useEffect } from "react";

// -----------------------------------------
// solve Redux state update problem due to javascript closure
// details: https://www.reddit.com/r/reactjs/comments/9zupzn/why_would_i_use_react_hooks_where_the_seteffect/ @VariadicIntegrity
// probably drop with regards to new React API in the future
/**
 * Hooks to add and remove keydown listener with its corresponding handler
 *
 * @param {function} handler Event handler function for keydown event
 */
const useKeyDown = (handler) => {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      handlerRef.current(e);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });
};

/**
 * Set ESC as the shortcut for exiting overlay
 *
 * @param {function} fn function to execute for escaping overlay
 * @returns {function(Event)} event handler function for useKeyDown
 */
const setEscOverlay = (fn) => (e) => {
  if (e.keyCode === 27) {
    fn(e);
  }
};

export { useKeyDown, setEscOverlay };
