import GrowthsTable from "./growthsTable";

export default class ClassCard extends React.Component {
	constructor(props) {
		super(props);
		this.renderCertification = this.renderCertification.bind(this);
		this.renderMasteredCombatArt = this.renderMasteredCombatArt.bind(this);
	}

	renderMasteredAbility() {
		if (this.props.data.masteredAbility) {
			return (<div className="class-master-ability">
				<h3>Mastered Ability</h3>
				{this.props.data.masteredAbility}
			</div>);
		}
	}
	renderMasteredCombatArt() {
		if (this.props.data.masteredAbility) {
			return (<div className="class-master-ability">
				<h3>Mastered Combat Art</h3>
				{this.props.data.masteredCombatArt}
			</div>);
		}
	}
	renderCertification() {

	}

	render() {
		return (
			<div className="class-card">
				<div className="class-tier"></div>
				<div className="class-name">{this.props.data.name}</div>
				<div className="class-cert">
					<h3>Certification</h3>
					<ol>
						{this.renderCertification()}
					</ol>
				</div>
				<div className="class-growths">
					<h3>Growths</h3>
					<ol>
						{/* <GrowthsTable growths={this.props.data.growths} /> */}
					</ol>
				</div>
				{this.renderMasteredAbility()}
			</div>
		);
	}
}
