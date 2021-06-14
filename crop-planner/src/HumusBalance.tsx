import { PureComponent } from 'react'
import classNames from 'classnames'

type Props = {
  humusBalance: number | undefined,
  className: string | undefined,
}

type State = {
  previousHumusBalance: number | undefined,
  initial: boolean,
  direction: string | null,
  animationClassName: string,
  animationFinished: boolean,
}

export default class HumusBalance extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      previousHumusBalance: 0,
      initial: true,
      direction: null,
      animationClassName: '',
      animationFinished: true,
    };
  }

  static getDerivedStateFromProps(props: Props, state: State): State {
    if (
      typeof props.humusBalance !== 'undefined' &&
      typeof state.previousHumusBalance !== 'undefined' &&
      props.humusBalance !== state.previousHumusBalance
    ) {
      if (!state.initial) state.direction = props.humusBalance > state.previousHumusBalance ? 'up' : 'down';
      state.initial = false;
      state.previousHumusBalance = props.humusBalance;
    }

    return state;
  }

  componentDidUpdate = (prevProps: Props): void => {
    if (
      prevProps.humusBalance !== this.props.humusBalance &&
      this.state.direction &&
      !this.state.initial
    ) {
      this.startAnimating();
    }
  }

  startAnimating = (): void => {
    if (!this.state.animationFinished) {
      this.setState({
        animationClassName: '',
        animationFinished: true
      }, () => {
        // Ensure end of callstack execution to easily make sure
        // animation re-triggers even if already in progress with
        // the same css classes.
        // setTimeout 0 is a dirty hack but it works.
        setTimeout(() => this.setState({
          animationClassName: 'animating'
        }), 0);
      });
    } else {
      this.setState({
        animationClassName: 'animating',
      });
    }
  }

  onAnimationStart = (): void => {
    this.setState({
      animationFinished: false
    });
  }

  onAnimationEnd = () => {
    this.setState({
      animationFinished: true,
      animationClassName: ''
    });
  }

  getDirectionClassName = (): string => {
    if (!this.state.direction) return '';

    return 'humus-balance__direction--' + this.state.direction;
  }

  render = () =>
    <div
      className={
        classNames(
          this.getDirectionClassName(),
          this.state.animationClassName,
          this.props.className
        )
      }
      onAnimationStart={this.onAnimationStart}
      onAnimationEnd={this.onAnimationEnd}
    >
      {
        (this.props.humusBalance || 0).toFixed(2)
      }
    </div>
};
