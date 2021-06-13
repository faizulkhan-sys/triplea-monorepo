import { MigrationInterface, QueryRunner } from 'typeorm';
import { insertBaseRate } from '../seeds/insertbasepayrate.seed';

const formattedInsertBase = insertBaseRate
  .replace(/(\r\n|\n|\r)/gm, ' ') // remove newlines
  .replace(/\s+/g, ' '); // excess white space

export class init1606199064027 implements MigrationInterface {
  name = 'init1606199064027';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "dbo"."GlobalSaPolicy" ("id" int NOT NULL IDENTITY(1,1), "idx" uniqueidentifier NOT NULL CONSTRAINT "DF_b9816ab1c71cf2550e41fdeb9c1" DEFAULT NEWSEQUENTIALID(), "name" varchar(150) NOT NULL, "min_value" float NOT NULL, "max_value" float NOT NULL, "is_default_policy" bit NOT NULL CONSTRAINT "DF_9c0d8caff2db5b4fa4afb3f100a" DEFAULT 0, "is_active" bit NOT NULL CONSTRAINT "DF_7c90571abadb179fb0e8ed3334a" DEFAULT 0, "is_obsolete" bit NOT NULL CONSTRAINT "DF_c2e9df1e0c8d89e5bdf36d05acd" DEFAULT 0, "created_on" datetime NOT NULL CONSTRAINT "DF_16523969d8b5ed2dc72a59a7eb4" DEFAULT getdate(), "created_by" uniqueidentifier NOT NULL, "modified_on" datetime CONSTRAINT "DF_1261736d5c083d11335727429f6" DEFAULT getdate(), "modified_by" uniqueidentifier, "is_on_edit" bit NOT NULL CONSTRAINT "DF_b9e3e7d3e6f701f7b1ea4c261b0" DEFAULT 0, CONSTRAINT "UQ_b9816ab1c71cf2550e41fdeb9c1" UNIQUE ("idx"), CONSTRAINT "PK_d64faadc2fcc8bbd6748d93b492" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dbo"."EmployerPolicySetting" ("id" int NOT NULL IDENTITY(1,1), "idx" uniqueidentifier NOT NULL CONSTRAINT "DF_9f1e8c83513cdde4c96a9a6abb0" DEFAULT NEWSEQUENTIALID(), "employer_id" uniqueidentifier, "is_active" bit NOT NULL CONSTRAINT "DF_7fd15b439678af476c7eee2ff86" DEFAULT 0, "is_obsolete" bit NOT NULL CONSTRAINT "DF_c9655cf1fc2f921579aeb5386c8" DEFAULT 0, "created_on" datetime NOT NULL CONSTRAINT "DF_238a29b277088ac679b092a2d3a" DEFAULT getdate(), "created_by" uniqueidentifier NOT NULL, "modified_on" datetime CONSTRAINT "DF_cccdc19e68c7989f2d14bb0b063" DEFAULT getdate(), "modified_by" uniqueidentifier, "is_on_edit" bit NOT NULL CONSTRAINT "DF_9420049478379017e198df53b0a" DEFAULT 0, "global_policy_id" int, CONSTRAINT "UQ_9f1e8c83513cdde4c96a9a6abb0" UNIQUE ("idx"), CONSTRAINT "PK_829d8fb9e7e845eb72b3f0738a8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dbo"."EmployerPolicySettingTemp" ("id" int NOT NULL IDENTITY(1,1), "idx" uniqueidentifier NOT NULL CONSTRAINT "DF_b362c6cd9ac9460c0c441c46a44" DEFAULT NEWSEQUENTIALID(), "employer_id" uniqueidentifier, "is_active" bit NOT NULL CONSTRAINT "DF_4ea115329fc3903e5a1e6d682f9" DEFAULT 0, "is_obsolete" bit NOT NULL CONSTRAINT "DF_01e5ac0d7592f0a23ad86ff1bf5" DEFAULT 0, "created_on" datetime NOT NULL CONSTRAINT "DF_c94b13580edf9b50d0f1379f73e" DEFAULT getdate(), "created_by" uniqueidentifier NOT NULL, "status" varchar(150) NOT NULL, "approved_by" uniqueidentifier, "operation" varchar(150) NOT NULL, "rejection_reason" varchar(150), "modified_on" datetime CONSTRAINT "DF_8c0d8edf71d8902c901da5d51bf" DEFAULT getdate(), "modified_by" uniqueidentifier, "sa_policy_id" int, "global_policy_id" int, CONSTRAINT "UQ_b362c6cd9ac9460c0c441c46a44" UNIQUE ("idx"), CONSTRAINT "PK_aff359ac2bb786c4b3057b02b5d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dbo"."GlobalSaPolicyTemp" ("id" int NOT NULL IDENTITY(1,1), "idx" uniqueidentifier NOT NULL CONSTRAINT "DF_a0dc4986bf9a505e46c9e666193" DEFAULT NEWSEQUENTIALID(), "name" varchar(150) NOT NULL, "min_value" float NOT NULL, "max_value" float NOT NULL, "is_default_policy" bit NOT NULL CONSTRAINT "DF_9ff6a6deef15469b393c4a5e74a" DEFAULT 0, "is_active" bit NOT NULL CONSTRAINT "DF_2a7a59b00904c488f44ea128248" DEFAULT 0, "is_obsolete" bit NOT NULL CONSTRAINT "DF_cb3b8c33f8cbd16c1aa88a2c03b" DEFAULT 0, "created_on" datetime NOT NULL CONSTRAINT "DF_d9d01d2fa7f016876da82d994a2" DEFAULT getdate(), "created_by" uniqueidentifier NOT NULL, "status" varchar(150) NOT NULL, "approved_by" uniqueidentifier, "operation" varchar(150) NOT NULL, "rejection_reason" varchar(150), "modified_on" datetime CONSTRAINT "DF_f0adf4231ef8e564d4274684fd3" DEFAULT getdate(), "modified_by" uniqueidentifier, "sa_policy_id" int, CONSTRAINT "UQ_a0dc4986bf9a505e46c9e666193" UNIQUE ("idx"), CONSTRAINT "PK_e6c84b54f07a851a1b15f7e6888" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dbo"."SaFreeTransactionHistory" ("id" int NOT NULL IDENTITY(1,1), "idx" uniqueidentifier NOT NULL CONSTRAINT "DF_271a8f46c52d01153460dba8c58" DEFAULT NEWSEQUENTIALID(), "employer_id" uniqueidentifier NOT NULL, "employee_id" uniqueidentifier NOT NULL, "created_on" datetime NOT NULL CONSTRAINT "DF_7ef8f14b7c0ed94251e1cd76674" DEFAULT getdate(), "loan_id" bigint, CONSTRAINT "UQ_271a8f46c52d01153460dba8c58" UNIQUE ("idx"), CONSTRAINT "PK_3ab8cb2839986c6e66d286551f8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dbo"."SaApplication" ("id" bigint NOT NULL IDENTITY(1,1), "idx" uniqueidentifier NOT NULL CONSTRAINT "DF_dd26f33c8ffaf2f4af5751c5f61" DEFAULT NEWSEQUENTIALID(), "employee_id" varchar(100) NOT NULL, "employer_id" varchar(100) NOT NULL, "amount" float, "policy_id" uniqueidentifier NOT NULL, "charge" float NOT NULL, "emi_due" float NOT NULL, "emi_due_date" date NOT NULL, "emi_remaining" float NOT NULL, "status" bit NOT NULL CONSTRAINT "DF_f16bf99043ccd93cbc4d88476d8" DEFAULT 0, "is_obsolete" bit NOT NULL CONSTRAINT "DF_c4f64d10c6d6a08401c563e1814" DEFAULT 0, "created_on" datetime NOT NULL CONSTRAINT "DF_6dbbffde63766003bfa53417e19" DEFAULT getdate(), "modified_on" datetime CONSTRAINT "DF_3952cf3289bd10c8f791d4636c5" DEFAULT getdate(), "modified_by" uniqueidentifier, CONSTRAINT "UQ_dd26f33c8ffaf2f4af5751c5f61" UNIQUE ("idx"), CONSTRAINT "PK_9f79e6e6eefc879b787ecec07cb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dbo"."SaBasepayRate" ("id" bigint NOT NULL IDENTITY(1,1), "idx" uniqueidentifier NOT NULL CONSTRAINT "DF_01181231a48e550908c305874eb" DEFAULT NEWSEQUENTIALID(), "employee_type" varchar(150) NOT NULL, "base_rate" float NOT NULL, CONSTRAINT "UQ_01181231a48e550908c305874eb" UNIQUE ("idx"), CONSTRAINT "PK_0bc74e56153cea59b5634807040" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dbo"."SaCharge" ("id" int NOT NULL IDENTITY(1,1), "idx" uniqueidentifier NOT NULL CONSTRAINT "DF_9ee55ebda358e68c33cb9e0efed" DEFAULT NEWSEQUENTIALID(), "name" varchar(150) NOT NULL, "charge_value" float NOT NULL, "charge_type" varchar(50) NOT NULL, "is_default_charge" bit NOT NULL CONSTRAINT "DF_75b34e98df2ced304a33d0e0a35" DEFAULT 0, "expires_on" date, "charge_payer" varchar(50) NOT NULL, "is_active" bit NOT NULL CONSTRAINT "DF_6c389a86767514e26fe867509b6" DEFAULT 0, "is_obsolete" bit NOT NULL CONSTRAINT "DF_c88f6f2baad9580a0fb3406bf73" DEFAULT 0, "created_on" datetime NOT NULL CONSTRAINT "DF_40a90d9de28143d76274924508b" DEFAULT getdate(), "created_by" uniqueidentifier NOT NULL, "modified_on" datetime CONSTRAINT "DF_a26ee45ca84e42bc51068037f8f" DEFAULT getdate(), "modified_by" uniqueidentifier, "is_on_edit" bit NOT NULL CONSTRAINT "DF_07cf717d6a523f619d0aaa0a397" DEFAULT 0, "default_charge_id" int, CONSTRAINT "UQ_9ee55ebda358e68c33cb9e0efed" UNIQUE ("idx"), CONSTRAINT "PK_aa300adf0b0ec95bad2a5779f9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dbo"."SaChargeTemp" ("id" int NOT NULL IDENTITY(1,1), "idx" uniqueidentifier NOT NULL CONSTRAINT "DF_2c8684797439192f157ca728ce7" DEFAULT NEWSEQUENTIALID(), "name" varchar(150) NOT NULL, "charge_value" float NOT NULL, "charge_type" varchar(50) NOT NULL, "is_default_charge" bit NOT NULL CONSTRAINT "DF_01e4f32133215252d214e0fc467" DEFAULT 0, "expires_on" date, "charge_payer" varchar(50) NOT NULL, "is_active" bit NOT NULL CONSTRAINT "DF_8afbee7d06ed736edf1afe87d50" DEFAULT 0, "created_on" datetime NOT NULL CONSTRAINT "DF_e2bd49ee5dde215d07713a1b7ab" DEFAULT getdate(), "status" varchar(150) NOT NULL, "created_by" uniqueidentifier NOT NULL, "approved_by" uniqueidentifier, "operation" varchar(150) NOT NULL, "rejection_reason" varchar(150), "modified_on" datetime CONSTRAINT "DF_27c39fa730be2a2ea5e21542b94" DEFAULT getdate(), "modified_by" uniqueidentifier, "charge_id" int, "default_charge_id" int, CONSTRAINT "UQ_2c8684797439192f157ca728ce7" UNIQUE ("idx"), CONSTRAINT "PK_b1cdf4c9e65314a275a879e9756" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dbo"."SaSubscription" ("id" int NOT NULL IDENTITY(1,1), "idx" uniqueidentifier NOT NULL CONSTRAINT "DF_f8b5486daf4b48336170a555f21" DEFAULT NEWSEQUENTIALID(), "name" varchar(150) NOT NULL, "base_period" varchar(50) NOT NULL, "expires_on" date, "no_of_free_transaction" int NOT NULL, "is_default_subscription" bit NOT NULL CONSTRAINT "DF_63fc51148d9417e9c20ee6f79e3" DEFAULT 0, "charge_value" float NOT NULL, "charge_payer" varchar(50) NOT NULL, "is_active" bit NOT NULL CONSTRAINT "DF_2e500864a381384194f21beb130" DEFAULT 0, "is_obsolete" bit NOT NULL CONSTRAINT "DF_47248237ed9de27e6db4ae62d2d" DEFAULT 0, "created_on" datetime NOT NULL CONSTRAINT "DF_76c1c32efe7693cb344a72746e0" DEFAULT getdate(), "created_by" uniqueidentifier NOT NULL, "modified_on" datetime CONSTRAINT "DF_99f72c49e5d1522861dd1dc636e" DEFAULT getdate(), "modified_by" uniqueidentifier, "is_on_edit" bit NOT NULL CONSTRAINT "DF_0f631377cecbe66bd94466eb5b3" DEFAULT 0, "default_subscription_id" int, CONSTRAINT "UQ_f8b5486daf4b48336170a555f21" UNIQUE ("idx"), CONSTRAINT "UQ_b80e0d059120d3e185d1880af08" UNIQUE ("name"), CONSTRAINT "PK_98b324b9dbe92db516ee7a08fd3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dbo"."SaChargeTemplates" ("id" int NOT NULL IDENTITY(1,1), "idx" uniqueidentifier NOT NULL CONSTRAINT "DF_b68eb98e8bcc09915cecd722090" DEFAULT NEWSEQUENTIALID(), "template_name" varchar(150) NOT NULL, "template_description" varchar(150) NOT NULL, "employer_id" uniqueidentifier NOT NULL, "employee_type" varchar(50) NOT NULL, "service_type" varchar(50) NOT NULL, "is_active" bit NOT NULL CONSTRAINT "DF_dbd1a8a449c7906746db7405ec3" DEFAULT 0, "is_obsolete" bit NOT NULL CONSTRAINT "DF_c8e9d5279ebf9add064480f0c5f" DEFAULT 0, "created_on" datetime NOT NULL CONSTRAINT "DF_312d56e2e6f0cc7069cb64f2c9b" DEFAULT getdate(), "created_by" uniqueidentifier, "modified_on" datetime CONSTRAINT "DF_6deeb9c599a4d2237aacd9d6ac3" DEFAULT getdate(), "modified_by" uniqueidentifier, "is_on_edit" bit NOT NULL CONSTRAINT "DF_4781c6be7c4177bda721b6f43dc" DEFAULT 0, "charge_id" int, "subscription_id" int, CONSTRAINT "UQ_b68eb98e8bcc09915cecd722090" UNIQUE ("idx"), CONSTRAINT "PK_cff854a86b4e37c9584204aa20c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dbo"."SaChargeTemplatesTemp" ("id" int NOT NULL IDENTITY(1,1), "idx" uniqueidentifier NOT NULL CONSTRAINT "DF_9f706d15c49946c2042c331bc6b" DEFAULT NEWSEQUENTIALID(), "template_name" varchar(150) NOT NULL, "template_description" varchar(150) NOT NULL, "employer_id" uniqueidentifier NOT NULL, "employee_type" varchar(50) NOT NULL, "service_type" varchar(50) NOT NULL, "is_active" bit NOT NULL CONSTRAINT "DF_0a67885c7628c99165f1471c8c1" DEFAULT 0, "created_on" datetime NOT NULL CONSTRAINT "DF_b16ef0d888ba26673a496fa7cbd" DEFAULT getdate(), "status" varchar(150) NOT NULL, "created_by" uniqueidentifier NOT NULL, "approved_by" uniqueidentifier, "operation" varchar(150) NOT NULL, "rejection_reason" varchar(150), "modified_on" datetime CONSTRAINT "DF_577e47d8bbe5e90791634e0a9ae" DEFAULT getdate(), "modified_by" uniqueidentifier, "charge_template_id" int, "charge_id" int, "subscription_id" int, CONSTRAINT "UQ_9f706d15c49946c2042c331bc6b" UNIQUE ("idx"), CONSTRAINT "PK_dfad5d205cd6c726c5bc88e0a2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dbo"."SaDeductionReport" ("idx" uniqueidentifier NOT NULL CONSTRAINT "DF_bcef93f542c39c8e66511be5b1e" DEFAULT NEWSEQUENTIALID(), "employer_id" varchar(150), "employee_id" varchar(150), "data" ntext, "is_approved" bit NOT NULL CONSTRAINT "DF_696f5c95ce8c120c147bc467368" DEFAULT (0), "created_on" datetime NOT NULL CONSTRAINT "DF_fcfa471b8c94ce16d86015e6e6e" DEFAULT getdate(), "is_active" bit NOT NULL CONSTRAINT "DF_9e915632f917f003bf0a133d6c9" DEFAULT (0), "is_obsolete" bit NOT NULL CONSTRAINT "DF_9d2ae221592789829ae2a3a3bc6" DEFAULT (0), "modified_on" datetime CONSTRAINT "DF_db694cd637a673b5ef069a0a4db" DEFAULT getdate(), CONSTRAINT "PK_bcef93f542c39c8e66511be5b1e" PRIMARY KEY ("idx"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dbo"."SaEligibility" ("idx" uniqueidentifier NOT NULL CONSTRAINT "DF_4c126a3754cb677fc0771df87c6" DEFAULT NEWSEQUENTIALID(), "employee_id" uniqueidentifier NOT NULL, "eligible_status" bit NOT NULL CONSTRAINT "DF_5a828605cc87824f46f6e258142" DEFAULT (1), "total_soa_taken" int, "payment_status" bit NOT NULL, "created_on" datetime NOT NULL CONSTRAINT "DF_a121f698c4dcdc41a3b6aee4eb0" DEFAULT getdate(), "is_active" bit NOT NULL CONSTRAINT "DF_68b992f3287f0ac1eb44056a6fd" DEFAULT (0), "is_obsolete" bit NOT NULL CONSTRAINT "DF_f890fa4bfc7e8cf8e2df6e2a77f" DEFAULT (0), "modified_on" datetime CONSTRAINT "DF_8172528e73d1a67fa5e49113c49" DEFAULT getdate(), CONSTRAINT "PK_ae95dfcb10eec52d0057b588058" PRIMARY KEY ("employee_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dbo"."SaEmployee" ("idx" uniqueidentifier NOT NULL CONSTRAINT "DF_96d0aadc0548c2917d338666452" DEFAULT NEWSEQUENTIALID(), "sa_id" int NOT NULL, "employee_id" uniqueidentifier NOT NULL, "sa_status" bit NOT NULL CONSTRAINT "DF_cc2c81b75699e3606c2f7a9e7e6" DEFAULT (0), "created_on" datetime NOT NULL CONSTRAINT "DF_22010cdf122168109f327144948" DEFAULT getdate(), "is_obsolete" bit NOT NULL CONSTRAINT "DF_bb4af71e9874223e23375a3f0fb" DEFAULT (0), "is_active" bit NOT NULL CONSTRAINT "DF_bb6cc8b2029f1f72edc0e9f2072" DEFAULT (0), "modified_on" datetime CONSTRAINT "DF_6ba6a2992932fc74a6141fc49d2" DEFAULT getdate(), CONSTRAINT "PK_f4164a58120219f29e898070e10" PRIMARY KEY ("sa_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dbo"."SaPolicy" ("id" int NOT NULL IDENTITY(1,1), "idx" uniqueidentifier CONSTRAINT "DF_b8fb22487fa62edfd8adc41de08" DEFAULT NEWSEQUENTIALID(), "no_of_time_allowed_per_cycle" int, "max_percent_of_salary" float, "total_emi_duration" int, "is_active" bit CONSTRAINT "DF_babf1050da9808ea982806b3a9a" DEFAULT 0, "payment_cycle" varchar(50), "created_on" datetime CONSTRAINT "DF_3bbfbbfd80fc988c1b8de2a24fa" DEFAULT getdate(), "modified_on" datetime CONSTRAINT "DF_a4d3b21a97a2aa53cd874b7bdb4" DEFAULT getdate(), CONSTRAINT "UQ_b8fb22487fa62edfd8adc41de08" UNIQUE ("idx"), CONSTRAINT "PK_305deb625874c6bc31ec96c6f77" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dbo"."SaEmployerPolicy" ("id" int NOT NULL IDENTITY(1,1), "idx" uniqueidentifier NOT NULL CONSTRAINT "DF_8998198fb9c3c204249abf7da68" DEFAULT NEWSEQUENTIALID(), "sa_policy_id" int NOT NULL, "employer_id" uniqueidentifier NOT NULL, "is_active" bit NOT NULL CONSTRAINT "DF_a6c9c139d01cbf7d587bba63fa0" DEFAULT 0, "pay_cycle_start_on" date, "last_disbursed_on" date, "created_on" datetime NOT NULL CONSTRAINT "DF_85f03dc9fe6691c8417599e43cd" DEFAULT getdate(), "modified_on" datetime CONSTRAINT "DF_37c6de32a271449a7bd98995fe3" DEFAULT getdate(), CONSTRAINT "UQ_8998198fb9c3c204249abf7da68" UNIQUE ("idx"), CONSTRAINT "PK_1759f0ed31e581ba4e84efc0a39" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dbo"."SaExcelHistory" ("id" int NOT NULL IDENTITY(1,1), "idx" uniqueidentifier NOT NULL CONSTRAINT "DF_05132f774ee36125bab0bc961a1" DEFAULT NEWSEQUENTIALID(), "file_name" varchar(150) NOT NULL, "employer_id" varchar(100), "employee_id" varchar(100), "is_active" bit NOT NULL CONSTRAINT "DF_49f6d90a871a8caec324357b28c" DEFAULT 0, "is_obsolete" bit NOT NULL CONSTRAINT "DF_3cfe11ff956386d758d16440a79" DEFAULT 0, "created_on" datetime NOT NULL CONSTRAINT "DF_427baad7b68e2c783d07e20002d" DEFAULT getdate(), "modified_on" datetime CONSTRAINT "DF_2cbf37a1c17b8130cb21ebf24b7" DEFAULT getdate(), CONSTRAINT "UQ_05132f774ee36125bab0bc961a1" UNIQUE ("idx"), CONSTRAINT "UQ_6d1c075b893e8480adad8750372" UNIQUE ("file_name"), CONSTRAINT "PK_7b873b6d3b88648a44f18c857ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dbo"."SaHistory" ("idx" uniqueidentifier NOT NULL CONSTRAINT "DF_b97317c89c8f60b101f188e282f" DEFAULT NEWSEQUENTIALID(), "loan_id" varchar(150), "employer_id" varchar(150), "loan_amount" int, "payment_due" varchar(150), "due_date" datetime NOT NULL, "created_on" datetime NOT NULL CONSTRAINT "DF_b1d4a7d19769d270d6ccdc7089e" DEFAULT getdate(), "is_active" bit NOT NULL CONSTRAINT "DF_dca83bf8f02963c12a479d456b2" DEFAULT (0), "is_obsolete" bit NOT NULL CONSTRAINT "DF_627cd5e08b211bffd9e2d132def" DEFAULT (0), "modified_on" datetime CONSTRAINT "DF_b91aa0709617ffee09475cdc36c" DEFAULT getdate(), CONSTRAINT "PK_b97317c89c8f60b101f188e282f" PRIMARY KEY ("idx"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dbo"."SaSubscriptionTemp" ("id" int NOT NULL IDENTITY(1,1), "idx" uniqueidentifier NOT NULL CONSTRAINT "DF_dbbfafb40ba827fb0db02db82f3" DEFAULT NEWSEQUENTIALID(), "name" varchar(150) NOT NULL, "base_period" varchar(50) NOT NULL, "no_of_free_transaction" int NOT NULL, "is_default_subscription" bit NOT NULL CONSTRAINT "DF_fb5ad540d9dc6e5a7adaa678a96" DEFAULT 0, "expires_on" date, "charge_value" float NOT NULL, "charge_payer" varchar(50) NOT NULL, "is_active" bit NOT NULL CONSTRAINT "DF_7c2095829c4089e9698b485ea07" DEFAULT 0, "status" varchar(150) NOT NULL, "approved_by" uniqueidentifier, "operation" varchar(150) NOT NULL, "rejection_reason" varchar(150), "created_on" datetime NOT NULL CONSTRAINT "DF_a22d197f02714134dc8d693553e" DEFAULT getdate(), "created_by" uniqueidentifier NOT NULL, "modified_on" datetime CONSTRAINT "DF_d81feea46e1abe0a3e302ee571f" DEFAULT getdate(), "modified_by" uniqueidentifier, "subscription_id" int, "default_subscription_id" int, CONSTRAINT "UQ_dbbfafb40ba827fb0db02db82f3" UNIQUE ("idx"), CONSTRAINT "PK_74c8f0d2687baf12ef6a1909b0d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."EmployerPolicySetting" ADD CONSTRAINT "FK_c67b7be4fb6a1801a9a9c63d04d" FOREIGN KEY ("global_policy_id") REFERENCES "dbo"."GlobalSaPolicy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."EmployerPolicySettingTemp" ADD CONSTRAINT "FK_c505acd0836beb63f7bddce78f5" FOREIGN KEY ("sa_policy_id") REFERENCES "dbo"."EmployerPolicySetting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."EmployerPolicySettingTemp" ADD CONSTRAINT "FK_05ad7470a69b59b6ea80e0e4d2d" FOREIGN KEY ("global_policy_id") REFERENCES "dbo"."GlobalSaPolicy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."GlobalSaPolicyTemp" ADD CONSTRAINT "FK_4f5e78af2a1898ca0399e2e2655" FOREIGN KEY ("sa_policy_id") REFERENCES "dbo"."GlobalSaPolicy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaFreeTransactionHistory" ADD CONSTRAINT "FK_9dcd4c4421257716d367a7a6a60" FOREIGN KEY ("loan_id") REFERENCES "dbo"."SaApplication"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaCharge" ADD CONSTRAINT "FK_4338c71acf66dee9b379955be06" FOREIGN KEY ("default_charge_id") REFERENCES "dbo"."SaCharge"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaChargeTemp" ADD CONSTRAINT "FK_a442d65bac0a6f699aa8ff1a5ff" FOREIGN KEY ("charge_id") REFERENCES "dbo"."SaCharge"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaChargeTemp" ADD CONSTRAINT "FK_204a70f8dd3b52c46e61e1e7822" FOREIGN KEY ("default_charge_id") REFERENCES "dbo"."SaCharge"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaSubscription" ADD CONSTRAINT "FK_1d4afd910d04f72b733ef332d77" FOREIGN KEY ("default_subscription_id") REFERENCES "dbo"."SaSubscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaChargeTemplates" ADD CONSTRAINT "FK_6a789a315836d583395869bc9db" FOREIGN KEY ("charge_id") REFERENCES "dbo"."SaCharge"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaChargeTemplates" ADD CONSTRAINT "FK_110211d93c62e01c899ec8d2cea" FOREIGN KEY ("subscription_id") REFERENCES "dbo"."SaSubscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaChargeTemplatesTemp" ADD CONSTRAINT "FK_3bdbf5de04c07e74aa9ca95c7a3" FOREIGN KEY ("charge_template_id") REFERENCES "dbo"."SaChargeTemplates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaChargeTemplatesTemp" ADD CONSTRAINT "FK_19d28bd4744ab97e07bda953668" FOREIGN KEY ("charge_id") REFERENCES "dbo"."SaCharge"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaChargeTemplatesTemp" ADD CONSTRAINT "FK_7114577f749967a498388bf14fe" FOREIGN KEY ("subscription_id") REFERENCES "dbo"."SaSubscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaEmployee" ADD CONSTRAINT "FK_89b6d4185f7475f94c523cc4890" FOREIGN KEY ("employee_id") REFERENCES "dbo"."SaEligibility"("employee_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaEmployerPolicy" ADD CONSTRAINT "FK_4223a3782b01b1848b8c3d6ecb9" FOREIGN KEY ("sa_policy_id") REFERENCES "dbo"."SaPolicy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaSubscriptionTemp" ADD CONSTRAINT "FK_b44598b93225b444c2e6f2b90c9" FOREIGN KEY ("subscription_id") REFERENCES "dbo"."SaSubscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaSubscriptionTemp" ADD CONSTRAINT "FK_c96af349ec385b226c8387451d7" FOREIGN KEY ("default_subscription_id") REFERENCES "dbo"."SaSubscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(formattedInsertBase);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaSubscriptionTemp" DROP CONSTRAINT "FK_c96af349ec385b226c8387451d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaSubscriptionTemp" DROP CONSTRAINT "FK_b44598b93225b444c2e6f2b90c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaEmployerPolicy" DROP CONSTRAINT "FK_4223a3782b01b1848b8c3d6ecb9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaEmployee" DROP CONSTRAINT "FK_89b6d4185f7475f94c523cc4890"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaChargeTemplatesTemp" DROP CONSTRAINT "FK_7114577f749967a498388bf14fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaChargeTemplatesTemp" DROP CONSTRAINT "FK_19d28bd4744ab97e07bda953668"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaChargeTemplatesTemp" DROP CONSTRAINT "FK_3bdbf5de04c07e74aa9ca95c7a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaChargeTemplates" DROP CONSTRAINT "FK_110211d93c62e01c899ec8d2cea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaChargeTemplates" DROP CONSTRAINT "FK_6a789a315836d583395869bc9db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaSubscription" DROP CONSTRAINT "FK_1d4afd910d04f72b733ef332d77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaChargeTemp" DROP CONSTRAINT "FK_204a70f8dd3b52c46e61e1e7822"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaChargeTemp" DROP CONSTRAINT "FK_a442d65bac0a6f699aa8ff1a5ff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaCharge" DROP CONSTRAINT "FK_4338c71acf66dee9b379955be06"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."SaFreeTransactionHistory" DROP CONSTRAINT "FK_9dcd4c4421257716d367a7a6a60"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."GlobalSaPolicyTemp" DROP CONSTRAINT "FK_4f5e78af2a1898ca0399e2e2655"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."EmployerPolicySettingTemp" DROP CONSTRAINT "FK_05ad7470a69b59b6ea80e0e4d2d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."EmployerPolicySettingTemp" DROP CONSTRAINT "FK_c505acd0836beb63f7bddce78f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."EmployerPolicySetting" DROP CONSTRAINT "FK_c67b7be4fb6a1801a9a9c63d04d"`,
    );
    await queryRunner.query(`DROP TABLE "dbo"."SaSubscriptionTemp"`);
    await queryRunner.query(`DROP TABLE "dbo"."SaHistory"`);
    await queryRunner.query(`DROP TABLE "dbo"."SaExcelHistory"`);
    await queryRunner.query(`DROP TABLE "dbo"."SaEmployerPolicy"`);
    await queryRunner.query(`DROP TABLE "dbo"."SaPolicy"`);
    await queryRunner.query(`DROP TABLE "dbo"."SaEmployee"`);
    await queryRunner.query(`DROP TABLE "dbo"."SaEligibility"`);
    await queryRunner.query(`DROP TABLE "dbo"."SaDeductionReport"`);
    await queryRunner.query(`DROP TABLE "dbo"."SaChargeTemplatesTemp"`);
    await queryRunner.query(`DROP TABLE "dbo"."SaChargeTemplates"`);
    await queryRunner.query(`DROP TABLE "dbo"."SaSubscription"`);
    await queryRunner.query(`DROP TABLE "dbo"."SaChargeTemp"`);
    await queryRunner.query(`DROP TABLE "dbo"."SaCharge"`);
    await queryRunner.query(`DROP TABLE "dbo"."SaBasepayRate"`);
    await queryRunner.query(`DROP TABLE "dbo"."SaApplication"`);
    await queryRunner.query(`DROP TABLE "dbo"."SaFreeTransactionHistory"`);
    await queryRunner.query(`DROP TABLE "dbo"."GlobalSaPolicyTemp"`);
    await queryRunner.query(`DROP TABLE "dbo"."EmployerPolicySettingTemp"`);
    await queryRunner.query(`DROP TABLE "dbo"."EmployerPolicySetting"`);
    await queryRunner.query(`DROP TABLE "dbo"."GlobalSaPolicy"`);
  }
}
