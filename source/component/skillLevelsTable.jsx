import * as Data from '../data';
import * as Util from '../util';
import SkillIcon from './skill-icon';

const TABLE_TYPE = {
	GRADE: 'GRADE',
	PROFICIENCY: 'PROFICIENCY',
};

export default class SkillLevelsTable extends React.Component {
	constructor(props) {
		super(props);
		this.renderHeaderCells = this.renderHeaderCells.bind(this);
		this.renderRowCells = this.renderRowCells.bind(this);
	}
	renderHeaderCells() {
		return Object.keys(this.props.data).map((s) => {
			// return (<th key={s}>{Util.capitalize(s)}</th>);
			return (<th key={s}><SkillIcon skill={s}></SkillIcon></th>);
		});
	}
	renderRowCells() {
		let data = this.props.data;
		return Object.keys(data).map((slColumn) => {
			let val = data[slColumn];
			let className = '';
			if (this.props.tableType === TABLE_TYPE.PROFICIENCY) {
				val = Util.renderProficiency(val);
			}
			if (this.props.tableType === TABLE_TYPE.GRADE) {
				className = 'bold';
			}
			return (<td key={slColumn} className={className}>{val}</td>);
		});
	}
	render() {
		if(Object.keys(this.props.data).length === 0) {
			return <div className="skill-levels-table">N/A</div>;
		}
		return (<table className="skill-levels-table">
			<thead>
				<tr>{this.renderHeaderCells()}</tr>
			</thead>
			<tbody>
				<tr className={""}>{this.renderRowCells()}</tr>
			</tbody>
		</table>);
	}
}