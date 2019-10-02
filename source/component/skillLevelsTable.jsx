import * as Util from '../util';
import SkillIcon from './skill-icon';
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
			val = Util.renderProficiency(val);
			return (<td key={slColumn} className={className}>{val}</td>);
		});
	}
	render() {
		if(Object.keys(this.props.data).length === 0) {
			return <div className="">N/A</div>;
		}
		return (<table className="mini-table skill-levels-table">
			<thead>
				<tr>{this.renderHeaderCells()}</tr>
			</thead>
			<tbody>
				<tr className={""}>{this.renderRowCells()}</tr>
			</tbody>
		</table>);
	}
}