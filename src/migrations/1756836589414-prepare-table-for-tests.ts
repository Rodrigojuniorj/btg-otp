import { MigrationInterface, QueryRunner } from 'typeorm'

export class PrepareTableForTests1756836589414 implements MigrationInterface {
  name = 'PrepareTableForTests1756836589414'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "expiresAt"`)
    await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "validatedAt"`)
    await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "createdAt"`)
    await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "updatedAt"`)
    await queryRunner.query(
      `ALTER TABLE "otps" ADD "expires_at" TIMESTAMP NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE "otps" ADD "validated_at" TIMESTAMP`)
    await queryRunner.query(
      `ALTER TABLE "otps" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "otps" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "updated_at"`)
    await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "created_at"`)
    await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "validated_at"`)
    await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "expires_at"`)
    await queryRunner.query(
      `ALTER TABLE "otps" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "otps" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(`ALTER TABLE "otps" ADD "validatedAt" TIMESTAMP`)
    await queryRunner.query(
      `ALTER TABLE "otps" ADD "expiresAt" TIMESTAMP NOT NULL`,
    )
  }
}
