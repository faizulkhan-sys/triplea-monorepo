"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForFailedMpin = void 0;
const ActivityLog_entity_1 = require("../entities/ActivityLog.entity");
const Customer_entity_1 = require("../entities/Customer.entity");
const Protocol_entity_1 = require("../entities/Protocol.entity");
const typeorm_1 = require("typeorm");
async function checkForFailedMpin(customer, device, ip, login_type, activity_type) {
    await typeorm_1.getConnection().getRepository(ActivityLog_entity_1.ActivityLog).save({
        ip_address: '',
        device_id: device,
        login_type,
        status: false,
        user: customer,
        activity_type,
    });
}
exports.checkForFailedMpin = checkForFailedMpin;
//# sourceMappingURL=dbHelpers.js.map