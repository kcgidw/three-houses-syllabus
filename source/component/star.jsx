export default class StarButton extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return <button className={"star-btn " + (this.props.active && 'active')} onClick={this.props.onClick}>
			<i className='material-icons'>star</i>
		</button>;
	}
}