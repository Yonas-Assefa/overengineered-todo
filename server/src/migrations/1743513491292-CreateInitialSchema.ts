import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialSchema1743513491292 implements MigrationInterface {
  name = "CreateInitialSchema1743513491292";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`task\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` text NULL, \`date\` datetime NOT NULL, \`completed\` tinyint NOT NULL DEFAULT 0, \`isRecurring\` tinyint NOT NULL DEFAULT 0, \`recurrencePattern\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`collection_id\` int NULL, \`parentTaskId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`collection\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`isFavorite\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`task\` ADD CONSTRAINT \`FK_a9aaff03dc19e223afd11ea22ef\` FOREIGN KEY (\`collection_id\`) REFERENCES \`collection\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`task\` ADD CONSTRAINT \`FK_8bf6d736c49d48d91691ea0dfe5\` FOREIGN KEY (\`parentTaskId\`) REFERENCES \`task\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_8bf6d736c49d48d91691ea0dfe5\``
    );
    await queryRunner.query(
      `ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_a9aaff03dc19e223afd11ea22ef\``
    );
    await queryRunner.query(`DROP TABLE \`collection\``);
    await queryRunner.query(`DROP TABLE \`task\``);
  }
}
