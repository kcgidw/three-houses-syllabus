import GrowthsTable from "./growthsTable";
import SkillLevelsTable from "./skillLevelsTable";
import * as Data from '../data';
import * as Roster from '../roster';

export default class ClassCard extends React.Component {
	constructor(props) {
		super(props);
		this.renderTags = this.renderTags.bind(this);
		this.renderMasteredAbility = this.renderMasteredAbility.bind(this);
		this.renderMasteredCombatArt = this.renderMasteredCombatArt.bind(this);
		this.renderActionButton = this.renderActionButton.bind(this);
	}

	renderTags() {
		return [this.props.data.tier].concat(this.props.data.tags).map((t) => {
			return (<li className="pill" key={t}>{t}</li>);
		});
	}

	renderMasteredAbility() {
		if (this.props.data.masteredAbility) {
			let desc = Data.findAbility(this.props.data.masteredAbility).desc;
			return (<div className="class-card-section">
				<div className="class-card-unit">
					<h4>Mastered Ability</h4>
					<strong>{this.props.data.masteredAbility}:</strong> {desc}
				</div>
			</div>);
		}
	}

	renderMasteredCombatArt() {
		if (this.props.data.masteredAbility) {
			return (<div className="class-card-section">
				<div className="class-card-unit">
					<h4>Mastered Combat Art</h4>
					{this.props.data.masteredCombatArt}
				</div>
			</div>);
		}
	}

	renderActionButton() {
		if(this.props.isPinned) {
			return (<button className="btn secondary" onClick={this.props.handleClick}>Unpin</button>);
		}
		return (<button className="btn primary" onClick={this.props.handleClick}>Pin</button>);
	}

	render() {
		return (
			<div className={"class-card card " + (this.props.isPinned ? "pinned" : "")}>
				<div className="class-card-header class-card-section">
					<div className="class-card-unit">
						<h2 className="class-name">{this.props.data.name}</h2>
					</div>
					<div className="class-tags class-card-unit">
						<ol>
							{this.renderTags()}
						</ol>
					</div>
				</div>
				<div className="class-card-section class-cert">
					<div className="class-card-unit class-cert">
						<h4>Certification</h4>
						<ol>
							<SkillLevelsTable data={this.props.data.certification} />
						</ol>
					</div>
					<div className="class-card-unit class-growths">
						<h4>Growths</h4>
						<ol>
							<GrowthsTable growths={this.props.data.growths} tableType="MODIFIER"/>
						</ol>
					</div>
				</div>
				{this.renderMasteredAbility()}
				<div className="class-card-section class-card-action">
					{this.renderActionButton()}
				</div>
			</div>
		);
	}
}
