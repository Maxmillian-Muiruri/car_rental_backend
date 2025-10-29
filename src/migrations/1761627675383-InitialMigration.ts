import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1761627675383 implements MigrationInterface {
  name = 'InitialMigration1761627675383';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rental" DROP CONSTRAINT "FK_7ac6d039d8d83c9b38cd51cefbf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "maintenance" DROP CONSTRAINT "FK_6c511176ffbc21a7698e0cc72c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "insurance" DROP CONSTRAINT "FK_6dd4ee3a8aee6ce2eabe7a56c35"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" DROP CONSTRAINT "FK_2d51eea28bf301076d640182058"`,
    );
    await queryRunner.query(
      `CREATE TABLE "cars" ("carId" int NOT NULL IDENTITY(1,1), "carModel" varchar(100) NOT NULL, "manufacturer" varchar(100) NOT NULL, "year" int NOT NULL, "color" varchar(50) NOT NULL, "rentalRate" decimal(10,2) NOT NULL, "availability" bit NOT NULL CONSTRAINT "DF_d36a2d985d21b9f8de475f9e480" DEFAULT 1, "insuranceInsuranceId" int, CONSTRAINT "PK_6af24bbe951c8a6b2f6fb8adc17" PRIMARY KEY ("carId"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_fd2f002dba8ac390b4561a27b8" ON "cars" ("insuranceInsuranceId") WHERE "insuranceInsuranceId" IS NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental" ADD CONSTRAINT "FK_7ac6d039d8d83c9b38cd51cefbf" FOREIGN KEY ("carId") REFERENCES "cars"("carId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "maintenance" ADD CONSTRAINT "FK_6c511176ffbc21a7698e0cc72c4" FOREIGN KEY ("carId") REFERENCES "cars"("carId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "insurance" ADD CONSTRAINT "FK_6dd4ee3a8aee6ce2eabe7a56c35" FOREIGN KEY ("carId") REFERENCES "cars"("carId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" ADD CONSTRAINT "FK_fd2f002dba8ac390b4561a27b87" FOREIGN KEY ("insuranceInsuranceId") REFERENCES "insurance"("insuranceId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" ADD CONSTRAINT "FK_2d51eea28bf301076d640182058" FOREIGN KEY ("carId") REFERENCES "cars"("carId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reservation" DROP CONSTRAINT "FK_2d51eea28bf301076d640182058"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" DROP CONSTRAINT "FK_fd2f002dba8ac390b4561a27b87"`,
    );
    await queryRunner.query(
      `ALTER TABLE "insurance" DROP CONSTRAINT "FK_6dd4ee3a8aee6ce2eabe7a56c35"`,
    );
    await queryRunner.query(
      `ALTER TABLE "maintenance" DROP CONSTRAINT "FK_6c511176ffbc21a7698e0cc72c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental" DROP CONSTRAINT "FK_7ac6d039d8d83c9b38cd51cefbf"`,
    );
    await queryRunner.query(
      `DROP INDEX "REL_fd2f002dba8ac390b4561a27b8" ON "cars"`,
    );
    await queryRunner.query(`DROP TABLE "cars"`);
    await queryRunner.query(
      `ALTER TABLE "reservation" ADD CONSTRAINT "FK_2d51eea28bf301076d640182058" FOREIGN KEY ("carId") REFERENCES "car"("carId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "insurance" ADD CONSTRAINT "FK_6dd4ee3a8aee6ce2eabe7a56c35" FOREIGN KEY ("carId") REFERENCES "car"("carId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "maintenance" ADD CONSTRAINT "FK_6c511176ffbc21a7698e0cc72c4" FOREIGN KEY ("carId") REFERENCES "car"("carId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental" ADD CONSTRAINT "FK_7ac6d039d8d83c9b38cd51cefbf" FOREIGN KEY ("carId") REFERENCES "car"("carId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
