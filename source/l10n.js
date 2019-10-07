import { capitalize } from "./util";

const dict = {
	beginner: 'BEG.',
	intermediate: 'INT.',
	advanced: 'ADV.',
	master: 'MASTER',
	'Combat Art': 'C. Art',
	heavyArmor: 'Heavy Armor',
};

export default function localize(str) {
	return dict[str] || capitalize(str);
}