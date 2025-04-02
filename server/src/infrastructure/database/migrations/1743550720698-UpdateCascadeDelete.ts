import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCascadeDelete1743550720698 implements MigrationInterface {
    name = 'UpdateCascadeDelete1743550720698'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_44a1f7af32d396c871bb73fb1a8\``);
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_44a1f7af32d396c871bb73fb1a8\` FOREIGN KEY (\`collection_id\`) REFERENCES \`collections\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_44a1f7af32d396c871bb73fb1a8\``);
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_44a1f7af32d396c871bb73fb1a8\` FOREIGN KEY (\`collection_id\`) REFERENCES \`collections\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
