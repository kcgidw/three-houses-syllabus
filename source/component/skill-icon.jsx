export default class SkillIcon extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<img src={`/images/skill-icons/${this.props.skill}.png`} title={this.props.skill} alt={this.props.skill} className="skill-icon"></img>);
	}
}