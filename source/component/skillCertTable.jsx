import React from 'react';
import SkillIcon from './skillIcon';

export default class SkillCertTable extends React.Component {
	constructor(props) {
		super(props);
		this.renderHeaderCells = this.renderHeaderCells.bind(this);
		this.renderRowCells = this.renderRowCells.bind(this);
	}
	renderHeaderCells() {
		return this.props.classData.relatedSkills.map((s) => {
			return (<th key={s}><SkillIcon skill={s}></SkillIcon></th>);
		});
	}
	renderRowCells(field) {
		return this.props.classData.relatedSkills.map((skill) => {
			return (<td key={field+':'+skill} className="bold">{this.props.classData[field][skill] || '-'}</td>);
		});
	}
	render() {
		if(this.props.classData.relatedSkills.length === 0) {
			return <div className="">N/A</div>;
		}
		return (<table className="mini-table skill-cert-table">
			<thead>
				<tr>{this.renderHeaderCells()}</tr>
			</thead>
			<tbody>
				<tr className={""}>{this.renderRowCells('certification')}</tr>
				<tr className={""}>{this.renderRowCells('skillBonus')}</tr>
			</tbody>
		</table>);
	}
}