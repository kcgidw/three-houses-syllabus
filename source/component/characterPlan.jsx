import * as Data from '../data';
import * as Util from '../util';
import * as Roster from '../roster';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import React, { Component, PropTypes } from 'react';
import ClassCard from './classCard';

class CharacterPlan extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			charPlan: Roster.findCharPlan(this.props.roster, this.props.charData.name),
			supportable: this.getSupportable(),
		};
		if(!this.state.charPlan) {
			throw `Can't find charPlan for ` + this.props.charData.name;
		}
		this.getTableColumns = this.getTableColumns.bind(this);
		this.getGrowths = this.getGrowths.bind(this);
		this.getSupportable = this.getSupportable.bind(this);
	}
	getTableColumns() {
		return Data.STATIC.stats.map((s) => {
			return (<th key={s}>{Util.capitalize(s)}</th>);
		});
	}
	getGrowths() {
		let growths = this.props.charData.growths;
		return Object.keys(growths).map((g) => {
			let val = growths[g];
			let classes = Util.getGrowthClassName(val);
			return (<td key={g} className={classes}>{val}</td>);
		});
	}
	getSupportable() {
		let allSupports = this.props.charData.supports;
		let res = allSupports.filter((name) => {
			return Roster.findActiveCharPlan(this.props.roster, name);
		});
		return res;
	}
	renderClasses() {
		return Object.keys(this.state.charPlan.classes).map((className) => {
			let classData = Data.findClass(className);
			return (<li key={className}>
				<ClassCard data={classData} />
			</li>);
		});
	}
	render() {
		return (<div className="main-card">
			<div id="character-name" className="main-card-header">
				<h1>{this.props.charData.name}</h1>
			</div>
			<div className="main-card-body has-tabs">
				<Tabs>
					<TabList>
						<Tab>Overview</Tab>
						<Tab>Classes</Tab>
						<Tab>Skill Levels</Tab>
						<Tab>Abilities</Tab>
					</TabList>
					<TabPanel>
						<div className="character-body main-card-content">
							<div id="supportable" className="card">
								<span className="heavy">{this.state.supportable.length}</span> supportable allies
							</div>
							<div id="base-growths" className="card">
								<h3>Growths</h3>
								<table>
									<thead>
										<tr>{this.getTableColumns()}</tr>
									</thead>
									<tbody>
										<tr className="number">{this.getGrowths()}</tr>
									</tbody>
								</table>
							</div>
						</div>
					</TabPanel>
					<TabPanel>
						<button className="btn primary">Add Class</button>
						<ol>
							{this.renderClasses()}
						</ol>
					</TabPanel>
					<TabPanel>
					</TabPanel>
					<TabPanel>
					</TabPanel>
				</Tabs>

			</div>
		</div>);
	}
}

export default CharacterPlan;