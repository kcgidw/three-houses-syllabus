export function capitalize(str) {
	return str[0].toUpperCase() + str.slice(1);
}

export function appraiseBaseGrowthRate(val) {
	if(val <= 30) {
		return 'bad';
	}
	if(val >= 50) {
		return 'good';
	}
	return 'neutral';
}
export function appraiseGrowthRateModifier(val) {
	if(val < 0) {
		return 'bad';
	}
	if(val > 0) {
		return 'good';
	}
	return 'neutral';
}
export function renderProficiency(val) {
	let res = val.split('').map((char, i) => {
		switch(char) {
			case '+':
				return <span className="good" key={i}>
					<i className="material-icons">arrow_upward</i>
				</span>;
			case '-':
				return <span className="bad" key={i}>
					<i className="material-icons">arrow_downward</i>
				</span>;
			case 'B':
				return <span className="budding" key={i}>
					<i className="material-icons-outlined">lightbulb</i>
				</span>;
			default:
				console.error(`Bad proficiency ${val}`);
		}
	});
	return res;
}
export function compareClass(dataA, dataB) {
	const tierOrder = ['basic', 'beginner', 'intermediate', 'advanced', 'master', 'event'];
	let a = tierOrder.indexOf(dataA.tier);
	let b = tierOrder.indexOf(dataB.tier);
	if(a - b !== 0) {
		return a- b;
	}
	return dataA.name.localeCompare(dataB.name);
}
export function compareGrade(gradeA, gradeB) {
	const grades = ['E', 'E+', 'D', 'D+', 'C', 'C+', 'B', 'B+', 'A', 'A+', 'S'];
	let a = grades.indexOf(gradeA.tier);
	let b = grades.indexOf(gradeB.tier);
	return a - b;
}