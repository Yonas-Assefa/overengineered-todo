import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeDeleteToSubtasks1743699121482 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // First drop the existing foreign key constraint
        await queryRunner.query(`
            ALTER TABLE tasks
            DROP FOREIGN KEY FK_54fc42a253a8338488ec1f960ad
        `);

        // Add the foreign key constraint back with CASCADE DELETE
        await queryRunner.query(`
            ALTER TABLE tasks
            ADD CONSTRAINT FK_54fc42a253a8338488ec1f960ad
            FOREIGN KEY (parent_task_id)
            REFERENCES tasks(id)
            ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the CASCADE DELETE foreign key constraint
        await queryRunner.query(`
            ALTER TABLE tasks
            DROP FOREIGN KEY FK_54fc42a253a8338488ec1f960ad
        `);

        // Add back the original foreign key constraint without CASCADE
        await queryRunner.query(`
            ALTER TABLE tasks
            ADD CONSTRAINT FK_54fc42a253a8338488ec1f960ad
            FOREIGN KEY (parent_task_id)
            REFERENCES tasks(id)
        `);
    }

}
