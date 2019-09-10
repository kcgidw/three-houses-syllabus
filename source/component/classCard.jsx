import GrowthsTable from "./growthsTable";
import SkillLevelsTable from "./skillLevelsTable";
import * as Data from '../data';
import * as Roster from '../roster';

export default class ClassCard extends React.Component {
	constructor(props) {
		super(props);
		this.renderMasteredAbility = this.renderMasteredAbility.bind(this);
		this.renderMasteredCombatArt = this.renderMasteredCombatArt.bind(this);
		this.renderActionButton = this.renderActionButton.bind(this);
	}

	renderMasteredAbility() {
		if (this.props.data.masteredAbility) {
			let desc = Data.findAbility(this.props.data.masteredAbility).desc;
			return (<div className="class-card-section class-master-ability">
				<h3>Mastered Ability</h3>
				<strong>{this.props.data.masteredAbility}:</strong> {desc}
			</div>);
		}
	}

	renderMasteredCombatArt() {
		if (this.props.data.masteredAbility) {
			return (<div className="class-card-section class-master-ability">
				<h3>Mastered Combat Art</h3>
				{this.props.data.masteredCombatArt}
			</div>);
		}
	}

	renderActionButton() {
		// debugger;
		if(this.props.isAdded) {
			return (<button className="btn secondary" onClick={this.props.handleClick}>Remove</button>);
		}
		return (<button className="btn primary" onClick={this.props.handleClick}>Add</button>);
	}

	render() {
		return (
			<div className="class-card card">
				<h2 className="class-card-header class-name">{this.props.data.name}</h2>
				{/* <div className="class-card-section class-tier"></div> */}
				<div className="class-card-section class-cert">
					<h3>Certification</h3>
					<ol>
						<SkillLevelsTable data={this.props.data.certification} />
					</ol>
				</div>
				<div className="class-card-section class-growths">
					<h3>Growths</h3>
					<ol>
						<GrowthsTable growths={this.props.data.growths} tableType="MODIFIER"/>
					</ol>
				</div>
				{this.renderMasteredAbility()}
				<div className="class-card-section class-card-action">
					{this.renderActionButton()}
				</div>
			</div>
		);
	}
}
