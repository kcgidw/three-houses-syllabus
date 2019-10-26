import cn from 'classnames';
import React from 'react';
import * as Data from '../data';
import localize from "../l10n";
import GrowthsTable from "./GrowthsTable";
import SkillCertTable from "./SkillCertTable";
import StarButton from './Star';

export default class ClassCard extends React.Component {
	constructor(props) {
		super(props);
		this.renderTags = this.renderTags.bind(this);
		this.renderMasteredAbility = this.renderMasteredAbility.bind(this);
		this.renderMasteredCombatArt = this.renderMasteredCombatArt.bind(this);
	}

	renderTags() {
		return [this.props.data.tier].concat(this.props.data.tags).map((t) => {
			return (<li key={t} className={'pill ' + t}>{localize(t)}</li>);
		});
	}

	renderMasteredAbility() {
		if (this.props.data.masteredAbility) {
			let desc = Data.findAbility(this.props.data.masteredAbility).desc;
			return (
				<p><strong>{this.props.data.masteredAbility}:</strong> {desc}</p>
			);
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

	render() {
		let cardCn = cn({
			'class-card': true,
			'card': true,
			'col2': true,
			'pinned': this.props.isPinned,
		});
		return (
			<li className={cardCn}>
				<div className="row">
					<StarButton active={this.props.isPinned} onClick={this.props.handleClick} />
					<h2 className="class-name">{this.props.data.name}</h2>
					<ol>
						{this.renderTags()}
					</ol>
				</div>
				<div className="row">
					<div className="class-card-unit class-cert">
						<h4>Cert / Bonus</h4>
						<SkillCertTable classData={this.props.data} />
					</div>
					<div className="class-card-unit class-growths">
						<h4>Growths</h4>
						<ol>
							<GrowthsTable growths={this.props.data.growths} tableType="MODIFIER"/>
						</ol>
					</div>
					<div className="class-card-unit class-growths tail">
						<h4>Mastered Ability</h4>
						{this.renderMasteredAbility()}
					</div>
				</div>
			</li>
		);
	}
}
