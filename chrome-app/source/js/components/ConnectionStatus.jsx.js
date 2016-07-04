class ConnectionStatus extends React.Component {
  constructor() {
    super();
    this.state = {
      connected: false
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({connected: !this.state.connected});
  }
  render() {
    const text = s.isConnected() ? 'Your Micro:bit is connected :)' : 'There is no Micro:bit connected :(';
    return (
      <div onClick={this.handleClick}>
        {text}
      </div>
    );
  }
}
