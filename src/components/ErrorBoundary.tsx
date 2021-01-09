import React from 'react';

type Props = {
  children: any;
  onError: (error: any, done: () => void) => any;
};

type State = {
  error: any;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: any) {
    return { error };
  }

  constructor(props: Props) {
    super(props);
    this.state = { error: undefined };
  }

  componentDidCatch(error: any, info: Object) {
    console.error(error, info);
  }

  done = () => {
    this.setState({ error: undefined });
  };

  render() {
    const { error } = this.state;
    return (error && this.props.onError(error, this.done)) || this.props.children;
  }
}
