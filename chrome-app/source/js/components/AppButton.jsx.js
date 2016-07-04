class AppButton extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <button className={"styled-box btn " + this.props.classNames} disabled={!this.props.active} onClick={this.props.handleClick}>{this.props.text}</button>
    );
  }
}
