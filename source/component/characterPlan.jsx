import * as Data from '../data';
import * as Util from '../util';
import * as Roster from '../roster';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import React, { Component, PropTypes } from 'react';
import ClassCard from './classCard';
import GrowthsTable from './growthsTable';
import SkillLevelsTable from './skillLevelsTable';
import StarButton from './star';
import SkillIcon from './skill-icon';

class CharacterPlan extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			charPlan: Roster.findCharPlan(this.props.roster, this.props.charData.name),
			// supportable: this.getSupportable(),
		};
		if(!this.state.charPlan) {
			throw `Can't find charPlan for ` + this.props.charData.name;
		}
		this.renderCharPlanClasses = this.renderCharPlanClasses.bind(this);
		this.renderClasses = this.renderClasses.bind(this);
		this.renderLearnableRow = this.renderLearnableRow.bind(this);
		this.renderAllLearnableRows = this.renderAllLearnableRows.bind(this);
		this.renderLearnedRows = this.renderLearnedRows.bind(this);
	}
	// getSupportable() {
	// 	let allSupports = this.props.charData.supports;
	// 	let res = allSupports.filter((name) => {
	// 		return Roster.findActiveCharPlan(this.props.roster, name);
	// 	});
	// 	return res;
	// }
	renderCharPlanClasses() {
		return Object.keys(this.state.charPlan.classes)
			.map((name) => {
				return Data.findClass(name);
			})
			.sort(Util.compareClass)
			.map((classData) => {
				let action = () => {
					this.props.updateRoster(Roster.toggleClass(this.props.roster, this.state.charPlan, classData.name));
				};
				return (<li key={classData.name}>
					<ClassCard data={classData} handleClick={action} isPinned={true} />
				</li>);
			});
	}
	renderClasses() {
		return Data.STATIC.classes
			.map((classData) => {
				let name = classData.name;
				let action = () => {
					this.props.updateRoster(Roster.toggleClass(this.props.roster, this.state.charPlan, name));
				};
				return (<li key={name}>
					<ClassCard data={classData} handleClick={action} isPinned={Roster.hasPinnedClass(this.state.charPlan, name)} />
				</li>);
			});
	}
	renderLearnableRow(skill, grade, abilityData, active, onClick) {
		return (<tr className="learnable-row" key={abilityData.name}>
			<td className="learnable-row-star"><StarButton active={active} onClick={onClick}></StarButton></td>
			<td className="learnable-row-skill"><SkillIcon skill={skill} /></td>
			<td className="learnable-row-grade">{grade}</td>
			<td className="learnable-row-name">{abilityData.name}</td>
			<td className="learnable-row-desc">{abilityData.desc}</td>
		</tr>);
	}
	renderLearnedRows() {
		let learned = this.state.charPlan.learned;
		let flat = [];
		if (learned) {
			for (let abilityName in learned) {
				let ability = Data.findAbility(abilityName);
				let onClick = () => {
					this.props.updateRoster(Roster.toggleLearn(this.props.roster, this.state.charPlan, abilityName));
				};
				let reqs = Roster.getAbilityRequirements(this.state.charPlan, abilityName);
				flat.push(this.renderLearnableRow(reqs.skill, reqs.grade, ability, true, onClick));
			}
		}
		return flat.sort(Util.compareSkill);
	}
	renderAllLearnableRows() {
		let flat = [];
		let all = this.props.charData.allLearnables;
		for (let skill of Data.STATIC.skillCategories) {
			// iterate over all categories, not just the valid ones, to go through categories in correct order
			if(all[skill]) {
				for (let grade in all[skill]) {
					let learnables = all[skill][grade];
					learnables.forEach((x) => {
						let isAbility = x.type === 'ABILITY';
						if(isAbility) {
							let ability = Data.findAbility(x.name);
							let isLearned = Roster.hasLearnedAbility(this.state.charPlan, ability.name);
							let onClick = () => {
								this.props.updateRoster(Roster.toggleLearn(this.props.roster, this.state.charPlan, ability.name));
							};
							flat.push(this.renderLearnableRow(skill, grade, ability, isLearned, onClick));
						}
					});
				}
			}
		}
		return flat;
	}
	render() {
		return (<div className="main-card">
			<div id="character-name" className="main-card-header">
				<h1>{this.props.charData.name}</h1>
			</div>
			<div className="main-card-body has-tabs">
				<Tabs forceRenderTabPanel>
					<TabList>
						<Tab>Overview</Tab>
						<Tab>Classes</Tab>
						<Tab>Learning</Tab>
					</TabList>
					<TabPanel>
						<div id="overview-content" className="character-body main-card-content">
							<div id="base-growths" className="overview-unit">
								<h3>Growths</h3>
								<GrowthsTable growths={this.props.charData.growths} tableType="BASE" />
							</div>
							<div id="base-proficiencies" className="overview-unit">
								<h3>Proficiencies</h3>
								<SkillLevelsTable data={this.props.charData.skillLevels} />
							</div>
						</div>
					</TabPanel>
					<TabPanel>
						<div id="classes-content" className="main-card-content">
							<ol className="classes-list">
								{this.renderCharPlanClasses()}
							</ol>
							<ol className="classes-list">
								{this.renderClasses()}
							</ol>
						</div>
					</TabPanel>
					<TabPanel>
						<div id="learning-content" className="main-card-content">
							<div className="antiflex-wrapper">
								<div id="learning-pinned-abilities">
									<table className="skill-level-learned big-table">
										<tbody>
											{this.renderLearnedRows()}
										</tbody>
									</table>
								</div>
								{Object.keys(this.state.charPlan.learned).length > 0 ? <br/> : undefined}
								<div id="learning-learnable-abilities">
									<table className="skill-level-data big-table">
										<tbody>
											{this.renderAllLearnableRows()}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</TabPanel>
				</Tabs>

			</div>
		</div>);
	}
}

export default CharacterPlan;