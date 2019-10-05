const dict = {
	starter: 'Starter',
	beginner: 'BEG.',
	intermediate: 'INT.',
	advanced: 'ADV.',
	master: 'MASTER',
	event: 'Event',
	male: 'Male',
	female: 'Female',
};

export default function localize(str) {
	return dict[str] || str;
}