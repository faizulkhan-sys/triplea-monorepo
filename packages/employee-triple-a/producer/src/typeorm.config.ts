import config from '@config/index';
import { ConnectionOptions } from 'typeorm';

const typeormConfig: ConnectionOptions = {
  type: 'mssql',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
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

export = typeormConfig;
