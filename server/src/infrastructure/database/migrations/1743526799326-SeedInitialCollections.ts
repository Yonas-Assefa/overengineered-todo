import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedInitialCollections1743526799326 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          INSERT INTO collections (id, name) VALUES
          (1, 'school'),
          (2, 'personal'),
          (3, 'design'),
          (4, 'groceries')
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DELETE FROM collections WHERE id IN (1, 2, 3, 4)
        `);
  }
}
