import * as Data from '../data';
import * as Util from '../util';
import * as Roster from '../roster';

export default class SaveLoadView extends React.Component {
	constructor(props) {
		super(props);
		this.onSaveSubmit = this.onSaveSubmit.bind(this);
		this.onLoadSubmit = this.onLoadSubmit.bind(this);
	}
	onSaveSubmit(e) {
		let text = e.target[0];
		text.value = JSON.stringify(this.props.roster);
		e.preventDefault();
	}
	onLoadSubmit(e) {
		let text = e.target[0].value;
		if (text) {
			this.props.loadRosterJSON(text);
		} else {
			console.warn('no text to load');
		}
		e.preventDefault();
	}
	render() {
		return (<div id="load-body" className="main-card">
			<div className="main-card-header">
				<h1>Save / Load</h1>
			</div>
			<div className="main-card-body">
				{/* <p>Syllabus auto-saves your roster state Into your browser.</p> */}
				<div id="save">
					<h3>Save Roster</h3>
					<form onSubmit={this.onSaveSubmit}>
						<p>Serialize your roster's current state into JSON text.</p>
						<textarea></textarea>
						<br />
						<input className="btn primary" type="submit" value="Save" />
					</form>
				</div>
				<div id="load">
					<h3>Load Roster</h3>
					<form onSubmit={this.onLoadSubmit}>
						<p>Paste a previously copied serialization into the box below.</p>
						<textarea></textarea>
						<br />
						<input className="btn primary" type="submit" value="Load" />
					</form>
				</div>
			</div>
		</div>);
	}
}