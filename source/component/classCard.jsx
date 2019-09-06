export default class ClassCard extends React.Component {
	constructor(props) {
		super(props);
		this.renderCertification = this.renderCertification.bind(this);
	}

	renderCertification() {

	}

	render() {
		return (
			<div className="class-card">
				<div className="class-rank"></div>
				<div className="class-name">{this.props.name}</div>
				<div className="class-cert">
					<h3>Certification</h3>
					<ol>
						{this.renderCertification()}
					</ol>
				</div>
				<div className="class-master-ability">
					<h3>Mastered Ability</h3>

				</div>
				<div className="class-master-combart">
					<h3>Mastered Combat Art</h3>
				</div>
			</div>
		);
	}
}
