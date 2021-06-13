"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForFailedMpin = void 0;
const ActivityLog_entity_1 = require("../entities/ActivityLog.entity");
const Customer_entity_1 = require("../entities/Customer.entity");
const Protocol_entity_1 = require("../entities/Protocol.entity");
const common_1 = require("@nestjs/common");
const date_fns_1 = require("date-fns");
const typeorm_1 = require("typeorm");
const helpers_1 = require("./helpers");
async function checkForFailedMpin(customer, device, ip, login_type, activity_type) {
    await typeorm_1.getConnection().getRepository(ActivityLog_entity_1.ActivityLog).save({
        ip_address: '',
        device_id: device,
        login_type,
        status: false,
        user: customer,
        activity_type,
    });
    const protocolSettings = await typeorm_1.getConnection()
        .getRepository(Protocol_entity_1.Protocol)
        .findOne({
        where: {
            is_active: true,
            is_obsolete: false,
        },
        select: [
            'mpin_attempt_interval',
            'mpin_interval_unit',
            'mpin_max_retry',
        ],
    });
    const activityLog = await typeorm_1.getConnection()
        .getRepository(ActivityLog_entity_1.ActivityLog)
        .find({
        where: {
            created_on: typeorm_1.Between(date_fns_1.startOfDay(helpers_1.subtractDate(protocolSettings.login_interval_unit, protocolSettings.login_attempt_interval)).toISOString(), date_fns_1.endOfDay(new Date()).toISOString()),
            status: false,
            user: customer,
            activity_type: 'MPIN_VERIFY',
        },
    });
    if (activityLog.length >= protocolSettings.mpin_max_retry) {
        await typeorm_1.getConnection()
            .getRepository(Customer_entity_1.Customer)
            .update({ id: customer.id }, { is_active: false });
        throw new common_1.HttpException({
            message: 'Oops! ',
            sub: 'Sorry the account has been locked. Please connect with our Customer Care.',
        }, common_1.HttpStatus.FORBIDDEN);
    }
    throw new common_1.HttpException({
        message: 'Oops! Invalid MPIN',
        sub: `Sorry the MPIN was invalid.You have ${protocolSettings.mpin_max_retry - activityLog.length} attempts left before your account gets locked.`,
    }, common_1.HttpStatus.UNAUTHORIZED);
}
exports.checkForFailedMpin = checkForFailedMpin;
//# sourceMappingURL=dbHelpers.js.map