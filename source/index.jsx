import { loadData } from "./data";
import CharacterList from "./component/characterList";
import Character from "./component/character";
import ReactDOM from 'react-dom';
import * as Roster from './roster';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			charFocus: this.props.data.characters[0],
			roster: Roster.createRoster(this.props.data.characters),
		};
		this.selectChar = this.selectChar.bind(this);
	}
	selectChar(char) {
		this.setState({
			charFocus: char,
		});
	}
	render() {
		return (<div id="wrapper">
			<div id="top-header" className="bg">
				<h1>Syllabus</h1>
			</div>
			<div id="left-sidebar">
				<CharacterList characters={this.props.data.characters} selected={this.state.charFocus} selectChar={this.selectChar}/>
			</div>
			<div id="main">
				<Character charData={this.state.charFocus} roster={this.state.roster}/>
			</div>
		</div>);
	}
}

loadData(function(data) {
	ReactDOM.render(<App data={data}/>, document.getElementById('root'));
});