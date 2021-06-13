export const EMPLOYER_AVAILABLE_NOTIFICATION_PAYLOAD = {
	employee_idx: '',
	action_alias: 'employer_available',
	data: [
		// {
		//   'key': 'employee_name',
		//   'value': 'Spider Man'
		// },
		// {
		//   'key': 'employer_name',
		//   'value': 'Employer Spider'
		// }
	],
	label: `SINGLE_NOTIFICATION`,
};

export const EMPLOYER_ADDED_PAYLOAD = {
	employer_idx: '',
	action_alias: 'employer_added_by_orbis_admin',
	data: [
		// {
		//   'key': 'employer_name',
		//   'value': 'Employer Spider'
		// },
	],
	label: `SINGLE_NOTIFICATION`,
};

export const EMPLOYER_TERMINATED_PAYLOAD = {
	employer_idx: '',
	action_alias: 'employer_terminated_by_orbis_admin',
	data: [
		// {
		//   'key': 'employer_name',
		//   'value': 'Employer Spider'
		// },
	],
	label: `SINGLE_NOTIFICATION`,
};
