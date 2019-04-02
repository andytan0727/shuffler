import { useRef, useEffect } from "react";

// -----------------------------------------
// solve Redux state update problem due to javascript closure
// details: https://www.reddit.com/r/reactjs/comments/9zupzn/why_would_i_use_react_hooks_where_the_seteffect/ @VariadicIntegrity
// probably drop with regards to new React API in the future
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

export { useKeyDown };
