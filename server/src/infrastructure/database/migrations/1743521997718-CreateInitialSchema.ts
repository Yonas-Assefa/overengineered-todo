import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialSchema1743521997718 implements MigrationInterface {
  name = "CreateInitialSchema1743521997718";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`tasks\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` text NULL, \`date\` datetime NOT NULL, \`completed\` tinyint NOT NULL DEFAULT 0, \`isRecurring\` tinyint NOT NULL DEFAULT 0, \`recurrencePattern\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`collection_id\` int NULL, \`parent_task_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`collections\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`isFavorite\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_44a1f7af32d396c871bb73fb1a8\` FOREIGN KEY (\`collection_id\`) REFERENCES \`collections\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_54fc42a253a8338488ec1f960ad\` FOREIGN KEY (\`parent_task_id\`) REFERENCES \`tasks\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_54fc42a253a8338488ec1f960ad\``);
    await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_44a1f7af32d396c871bb73fb1a8\``);
    await queryRunner.query(`DROP TABLE \`collections\``);
    await queryRunner.query(`DROP TABLE \`tasks\``);
  }
}
