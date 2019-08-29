class CharacterList extends React.Component {
	constructor(props) {
		super(props);
	}

	getList() {
		return this.props.characters.map((item) => {
			return (
				<li key={item.Name} className="name">
					{item.Name}
				</li>);
		});
	}

	render() {
		return (
			<div className="characters">
				<ul>
					{this.getList()}
				</ul>
			</div>
		);
	}
}

export default CharacterList;