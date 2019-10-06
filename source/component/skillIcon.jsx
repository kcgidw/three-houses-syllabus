import sword from '../../public/images/skill-icons/sword.png';
import lance from '../../public/images/skill-icons/lance.png';
import axe from '../../public/images/skill-icons/axe.png';
import bow from '../../public/images/skill-icons/bow.png';
import brawling from '../../public/images/skill-icons/brawling.png';
import faith from '../../public/images/skill-icons/faith.png';
import reason from '../../public/images/skill-icons/reason.png';
import riding from '../../public/images/skill-icons/riding.png';
import flying from '../../public/images/skill-icons/flying.png';
import authority from '../../public/images/skill-icons/authority.png';
import heavyArmor from '../../public/images/skill-icons/heavyArmor.png';

const images = {sword, lance, axe, bow, brawling, faith, reason, riding, flying, authority, heavyArmor};

export default class SkillIcon extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<img src={images[this.props.skill]} title={this.props.skill} alt={this.props.skill} className="skill-icon"></img>);
	}
}