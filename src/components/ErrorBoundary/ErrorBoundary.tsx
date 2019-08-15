import React, { Component } from "react";

import SomethingWentWrong from "./SomethingWentWrong";

export default class ErrorBoundary extends Component<
  {},
  {
    hasError: boolean;
  }
> {
  public constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error | null, errorInfo: object) {
    console.log(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <SomethingWentWrong />;
    }

    return this.props.children;
  }
}
