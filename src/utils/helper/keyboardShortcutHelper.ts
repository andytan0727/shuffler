import { useEffect, useRef } from "react";

// -----------------------------------------
// solve Redux state update problem due to javascript closure
// details: https://www.reddit.com/r/reactjs/comments/9zupzn/why_would_i_use_react_hooks_where_the_seteffect/ @VariadicIntegrity
// probably drop with regards to new React API in the future
/**
 * Hooks to add and remove keydown listener with its corresponding handler
 *
 * @param handler Event handler function for keydown event
 */
export const useKeyDown = (handler: (arg0: React.KeyboardEvent) => void) => {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const handleKeyDown = (e: React.KeyboardEvent | Event) => {
      handlerRef.current(e as React.KeyboardEvent);
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
 * @param fn function to execute for escaping overlay
 * @returns event handler function for useKeyDown
 */
export const setEscOverlay = (fn: Function) => (e: React.KeyboardEvent) => {
  if (e.keyCode === 27) {
    fn(e);
  }
};
