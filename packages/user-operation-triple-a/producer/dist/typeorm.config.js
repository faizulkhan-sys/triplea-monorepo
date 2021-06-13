"use strict";
const index_1 = require("./config/index");
const typeormConfig = {
    type: 'mssql',
    host: index_1.default.db.host,
    port: index_1.default.db.port,
    username: index_1.default.db.username,
    password: index_1.default.db.password,
    database: index_1.default.db.database,
    entities: [__dirname + '/entities/*{.ts,.js}'],
    synchronize: false,
    logging: 'all',
    logger: 'advanced-console',
    migrationsTableName: 'nest_migration',
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    cli: {
        migrationsDir: 'src/migrations',
        entitiesDir: 'src/entity',
    },
    extra: { max: 20 },
    options: {
        enableArithAbort: true,
    },
};
module.exports = typeormConfig;
//# sourceMappingURL=typeorm.config.js.map