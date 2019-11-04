import * as Data from '../data';
import * as Util from '../util';
import * as Roster from '../roster';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import React, { Component, PropTypes } from 'react';
import ClassCard from './ClassCard';
import GrowthsTable from './GrowthsTable';
import SkillLevelsTable from './SkillLevelsTable';
import StarButton from './Star';
import SkillIcon from './SkillIcon';
import localize from '../l10n';
import { LEARNABLE_TYPE } from '../enum';
import ClassList from './ClassList';

class UnitPlan extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			unitPlan: Roster.findUnitPlan(this.props.roster, this.props.unitData.name),
			tab: 0,
			classesRendered: false, // rendering classes is expensive so hold off if possible
		};
		if(!this.state.unitPlan) {
			throw `Can't find unitPlan for ` + this.props.unitData.name;
		}
		this.renderUnitPlanClasses = this.renderUnitPlanClasses.bind(this);
		this.renderClasses = this.renderClasses.bind(this);
		this.renderLearnableRow = this.renderLearnableRow.bind(this);
		this.renderAllLearnableRows = this.renderAllLearnableRows.bind(this);
		this.renderLearnedRows = this.renderLearnedRows.bind(this);
	}
	renderUnitPlanClasses() {
		return Object.keys(this.state.unitPlan.classes)
			.map((name) => {
				return Data.findClass(name);
			})
			.sort(Util.compareClass)
			.map((classData) => {
				let action = () => {
					this.props.updateRoster(Roster.toggleClass(this.props.roster, this.state.unitPlan, classData.name));
				};
				return (<ClassCard key={classData.name} data={classData} handleClick={action} isPinned={true} />);
			});
	}
	renderClasses() {
		return Data.filterClasses(this.state.unitPlan)
			.map((classData) => {
				let name = classData.name;
				let action = () => {
					this.props.updateRoster(Roster.toggleClass(this.props.roster, this.state.unitPlan, name));
				};
				return (
					<ClassCard key={name} data={classData} handleClick={action} isPinned={Roster.hasPinnedClass(this.state.unitPlan, name)} />
				);
			});
	}
	renderLearnableRow(skillCat, grade, learnableInfo, type, active, onClick) {
		if(grade === 'BT') {
			grade = <span className="budding">
				<i className="material-icons">lightbulb</i>
			</span>;
		}
		return (<tr className="learnable-row" key={learnableInfo.name}>
			<td className="learnable-row-star"><StarButton active={active} onClick={onClick}></StarButton></td>
			<td className="learnable-row-skill"><span><SkillIcon skillCat={skillCat} />&nbsp;{grade}</span></td>
			<td className="learnable-row-name">{learnableInfo.name}</td>
			<td className="learnable-row-type">{localize(type)}</td>
			<td className="learnable-row-desc">{learnableInfo.desc}</td>
		</tr>);
	}
	renderLearnedRows() {
		let allLearned = this.state.unitPlan.learned;
		let flat = [];
		if (allLearned) {
			for (let learnedName in allLearned) {
				let learned;
				let type = Data.determineLearnableType(learnedName);
				if(LEARNABLE_TYPE.ABILITY === type) {
					learned = Data.findAbility(learnedName);
				} else {
					learned = Data.findCombatArt(learnedName);
				}
				let onClick = () => {
					this.props.updateRoster(Roster.toggleLearn(this.props.roster, this.state.unitPlan, learnedName));
				};
				let reqs = Roster.getAbilityRequirements(this.state.unitPlan, learnedName);
				flat.push(this.renderLearnableRow(reqs.skillCat, reqs.grade, learned, type, true, onClick));
			}
		}
		// TODO doesn't sort skills correctly because we're pushing the rendered content, not the learnable
		return flat.sort(Util.compareSkill);
	}
	renderAllLearnableRows() {
		let flat = [];
		let all = this.props.unitData.allLearnables;
		for (let skillCat of Data.STATIC.skillCategories) {
			// iterate over all categories, not just the valid ones, to go through categories in correct order
			if(all[skillCat]) {
				for (let grade of Data.STATIC.grades) {
					if(all[skillCat][grade]) {
						let learnables = all[skillCat][grade];
						learnables.forEach((x) => {
							let info;
							let isAbility = x.type === LEARNABLE_TYPE.ABILITY;
							if(isAbility) {
								info = Data.findAbility(x.name);
							} else {
								info = Data.findCombatArt(x.name);
							}
							let isLearned = Roster.hasLearnedAbility(this.state.unitPlan, info.name);
							let onClick = () => {
								this.props.updateRoster(Roster.toggleLearn(this.props.roster, this.state.unitPlan, info.name));
							};
							flat.push(this.renderLearnableRow(skillCat, grade, info, x.type, isLearned, onClick));
						});
					}
				}
			}
		}
		return flat;
	}
	render() {
		let classesTopDisplay;
		if(this.state.unitPlan.classes && Object.keys(this.state.unitPlan.classes).length > 0) {
			classesTopDisplay = <React.Fragment>
				<h2>Pinned</h2>
				<ol className="classes-list">
					{this.renderUnitPlanClasses()}
				</ol>
			</React.Fragment>;
		}
		let learnedTopDisplay;
		if(this.state.unitPlan.learned && Object.keys(this.state.unitPlan.learned).length > 0) {
			learnedTopDisplay = <React.Fragment>
				<div id="learning-pinned-abilities">
					<h2>Pinned</h2>
					<table className="learnables-table skill-level-learned big-table">
						<tbody>
							{this.renderLearnedRows()}
						</tbody>
					</table>
				</div>
				{Object.keys(this.state.unitPlan.learned).length > 0 ? <br/> : undefined}
			</React.Fragment>;
		}

		return (<div className="main-card has-tabs">
			<Tabs forceRenderTabPanel onSelect={(idx) => {
				this.setState({
					tab: idx,
					classesRendered: this.state.classesRendered || idx === 1,
				});
			}}>
				<TabList>
					<Tab>Overview</Tab>
					<Tab>Classes</Tab>
					<Tab>Learning</Tab>
				</TabList>
				<TabPanel>
					<div id="overview-content" className="unit-body main-card-content">
						<div id="overview-content-wrapper">
							<div id="base-growths" className="overview-unit">
								<h3>Growths</h3>
								<GrowthsTable growths={this.props.unitData.growths} tableType="BASE" />
							</div>
							<div id="base-proficiencies" className="overview-unit">
								<h3>Proficiencies</h3>
								<SkillLevelsTable data={this.props.unitData.skillLevels} />
							</div>
							<div id="base-proficiencies" className="overview-unit">
								<h3>Supports: {Roster.getActiveSupports(this.props.roster, this.props.unitData).length}</h3>
								{this.props.unitData.supports.map((supportName) => {
									const uPlan = Roster.findUnitPlan(this.props.roster, supportName);
									const cn = uPlan.active ? 'active-support' : 'inactive-support';
									return <li key={supportName} className={cn}>{supportName}</li>;
								})}
							</div>
						</div>
					</div>
				</TabPanel>
				<TabPanel>
					<div id="classes-content" className="main-card-content noflex">
						{classesTopDisplay}
						<h2>Browse</h2>
						<ClassList
							roster={this.props.roster}
							shouldRender={this.state.classesRendered}
							showFilter={true}
							unitPlan={this.state.unitPlan}
							updateRoster={this.props.updateRoster} />
					</div>
				</TabPanel>
				<TabPanel>
					<div id="learning-content" className="main-card-content">
						<div id="learning-content-wrapper">
							<div id="learning-learnable-abilities">
								{learnedTopDisplay}
								<h2>Browse</h2>
								<table className="learnables-table skill-level-data big-table">
									<tbody>
										{this.renderAllLearnableRows()}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</TabPanel>
			</Tabs>
		</div>);
	}
}

export default UnitPlan;