import React from 'react';
import sword from 'assets/images/skill-icons/sword.png';
import lance from 'assets/images/skill-icons/lance.png';
import axe from 'assets/images/skill-icons/axe.png';
import bow from 'assets/images/skill-icons/bow.png';
import brawling from 'assets/images/skill-icons/brawling.png';
import faith from 'assets/images/skill-icons/faith.png';
import reason from 'assets/images/skill-icons/reason.png';
import riding from 'assets/images/skill-icons/riding.png';
import flying from 'assets/images/skill-icons/flying.png';
import authority from 'assets/images/skill-icons/authority.png';
import heavyArmor from 'assets/images/skill-icons/heavyArmor.png';
import localize from '../l10n';

const images = {sword, lance, axe, bow, brawling, faith, reason, riding, flying, authority, heavyArmor};

const SkillIcon = ({skillCat}) => {
	return (<img src={images[skillCat]} title={skillCat} alt={localize(skillCat)} className="skill-icon"></img>);
};

export default SkillIcon;