import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTaskFKCascading1743539354079 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_54fc42a253a8338488ec1f960ad\``
    );
    await queryRunner.query(
      `ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_54fc42a253a8338488ec1f960ad\` FOREIGN KEY (\`parent_task_id\`) REFERENCES \`tasks\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_54fc42a253a8338488ec1f960ad\``
    );
    await queryRunner.query(
      `ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_54fc42a253a8338488ec1f960ad\` FOREIGN KEY (\`parent_task_id\`) REFERENCES \`tasks\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
