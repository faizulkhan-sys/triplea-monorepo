"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMPLOYER_TERMINATED_PAYLOAD = exports.EMPLOYER_ADDED_PAYLOAD = exports.EMPLOYER_AVAILABLE_NOTIFICATION_PAYLOAD = void 0;
exports.EMPLOYER_AVAILABLE_NOTIFICATION_PAYLOAD = {
    employee_idx: '',
    action_alias: 'employer_available',
    data: [],
    label: `SINGLE_NOTIFICATION`,
};
exports.EMPLOYER_ADDED_PAYLOAD = {
    employer_idx: '',
    action_alias: 'employer_added_by_orbis_admin',
    data: [],
    label: `SINGLE_NOTIFICATION`,
};
exports.EMPLOYER_TERMINATED_PAYLOAD = {
    employer_idx: '',
    action_alias: 'employer_terminated_by_orbis_admin',
    data: [],
    label: `SINGLE_NOTIFICATION`,
};
//# sourceMappingURL=notification.payload.js.map