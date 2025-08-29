import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTableUserAndUserOptHistory1756493711182
  implements MigrationInterface
{
  name = 'CreateTableUserAndUserOptHistory1756493711182'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "user_otp_history" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "hash" character varying(255) NOT NULL, "otp_code" character varying(100) NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "sent_at" TIMESTAMP NOT NULL DEFAULT now(), "validated_at" TIMESTAMP, "attempts" integer NOT NULL DEFAULT '0', "expires_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_eec81d5556ea9d4ce3867985b0a" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_otp_history" ADD CONSTRAINT "FK_9de2fb7a4d3e863f56c2b6bba57" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_otp_history" DROP CONSTRAINT "FK_9de2fb7a4d3e863f56c2b6bba57"`,
    )
    await queryRunner.query(`DROP TABLE "user_otp_history"`)
    await queryRunner.query(`DROP TABLE "users"`)
  }
}
