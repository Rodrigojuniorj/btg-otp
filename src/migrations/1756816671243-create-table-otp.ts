import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTableOtp1756816671243 implements MigrationInterface {
  name = 'CreateTableOtp1756816671243'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."otps_purpose_enum" AS ENUM('login', 'verification', 'reset', 'registration', 'general')`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."otps_status_enum" AS ENUM('pending', 'validated', 'expired', 'failed')`,
    )
    await queryRunner.query(
      `CREATE TABLE "otps" ("id" SERIAL NOT NULL, "hash" character varying(255) NOT NULL, "otpCode" character varying(10) NOT NULL, "identifier" character varying(100), "purpose" "public"."otps_purpose_enum" NOT NULL, "status" "public"."otps_status_enum" NOT NULL DEFAULT 'pending', "attempts" integer NOT NULL DEFAULT '0', "expiresAt" TIMESTAMP NOT NULL, "validatedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_58594b9cb0beac414e05b8b2618" UNIQUE ("hash"), CONSTRAINT "PK_91fef5ed60605b854a2115d2410" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_58594b9cb0beac414e05b8b261" ON "otps" ("hash") `,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_58594b9cb0beac414e05b8b261"`,
    )
    await queryRunner.query(`DROP TABLE "otps"`)
    await queryRunner.query(`DROP TYPE "public"."otps_status_enum"`)
    await queryRunner.query(`DROP TYPE "public"."otps_purpose_enum"`)
  }
}
