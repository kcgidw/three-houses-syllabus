import { loadData } from "./data";
import CharacterList from "./component/characters";
import ReactDOM from 'react-dom';

loadData(function(data) {
	console.log(data);
	ReactDOM.render(<CharacterList characters={data.characters}/>, document.getElementById('root'));
});