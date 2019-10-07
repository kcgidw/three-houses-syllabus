import { capitalize } from "./util";
import { LEARNABLE_TYPE } from "./enum";

const dict = {
	beginner: 'BEG.',
	intermediate: 'INT.',
	advanced: 'ADV.',
	master: 'MASTER',
	[LEARNABLE_TYPE.COMBAT_ART]: 'C. Art',
	[LEARNABLE_TYPE.ABILITY]: 'Ability',
	heavyArmor: 'Heavy Armor',
};

export default function localize(str) {
	return dict[str] || capitalize(str);
}