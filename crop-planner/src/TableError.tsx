import { PureComponent } from 'react'
import classNames from 'classnames'

type State = {}

type Props = {
  errorMessage: string | null | undefined,
  onComplete: () => void,
}

const ERROR_TIMEOUT = 2500; //ms

export default class TableError extends PureComponent<Props, State> {
  private timeout: ReturnType<typeof setTimeout> | null;

  constructor(props: Props) {
    super(props);
    this.timeout = null;
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.props.errorMessage !== prevProps.errorMessage) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => this.props.onComplete(), ERROR_TIMEOUT);
    }
  }

  render = () =>
    <div className={classNames("table__error", {
      'table__error--visible': this.props.errorMessage,
    })}>
      { this.props.errorMessage ? 'Error: ' + this.props.errorMessage : '' }
    </div>
}
