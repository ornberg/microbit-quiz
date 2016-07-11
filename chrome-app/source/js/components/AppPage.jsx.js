class AppPage extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div className={"page " + this.props.name}>{this.props.content}</div>
    );
  }
}
