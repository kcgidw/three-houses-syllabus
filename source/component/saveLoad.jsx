import * as Data from '../data';
import * as Util from '../util';
import * as Roster from '../roster';

export default class SaveLoadView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			json: JSON.stringify(this.props.roster),
		};
		this.onLoadSubmit = this.onLoadSubmit.bind(this);
	}
	updateJsonSave() {
		this.setState({
			json: JSON.stringify(this.props.roster),
		});
	}
	componentDidUpdate(prevProps) {
		if(prevProps != this.props) {
			this.updateJsonSave();
		}
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
					<h2>Roster Serialization</h2>
					<p>The text below is your roster's current state converted into JSON text.</p>
					<textarea value={this.state.json} readOnly></textarea>
				</div>
				<br />
				<div id="load">
					<h2>Load Roster</h2>
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