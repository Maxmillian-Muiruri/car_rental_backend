import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1761313996163 implements MigrationInterface {
  name = 'InitialMigration1761313996163';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "customer" ("customerId" int NOT NULL IDENTITY(1,1), "firstName" nvarchar(50) NOT NULL, "lastName" nvarchar(50) NOT NULL, "email" nvarchar(255) NOT NULL, "phoneNumber" nvarchar(20) NOT NULL, "address" nvarchar(200) NOT NULL, CONSTRAINT "UQ_fdb2f3ad8115da4c7718109a6eb" UNIQUE ("email"), CONSTRAINT "PK_71302d30c27acbf513b3d74f81c" PRIMARY KEY ("customerId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment" ("paymentId" int NOT NULL IDENTITY(1,1), "rentalId" int NOT NULL, "paymentDate" date NOT NULL CONSTRAINT "DF_1f0d1f09023ee4164f27248ac98" DEFAULT GETDATE(), "amount" decimal(10,2) NOT NULL, "paymentMethod" nvarchar(50) NOT NULL, CONSTRAINT "PK_67ee4523b649947b6a7954dc673" PRIMARY KEY ("paymentId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rental" ("rentalId" int NOT NULL IDENTITY(1,1), "carId" int NOT NULL, "customerId" int NOT NULL, "rentalStartDate" date NOT NULL, "rentalEndDate" date NOT NULL, "totalAmount" decimal(10,2) NOT NULL, CONSTRAINT "PK_3731f2e5917fd09bfa293f93a6b" PRIMARY KEY ("rentalId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "maintenance" ("maintenanceId" int NOT NULL IDENTITY(1,1), "carId" int NOT NULL, "maintenanceDate" date NOT NULL CONSTRAINT "DF_68853ded730ac6829315d7f1085" DEFAULT GETDATE(), "description" nvarchar(200) NOT NULL, "cost" decimal(10,2) NOT NULL, CONSTRAINT "PK_2923739e1d5d8501a05c99b18c4" PRIMARY KEY ("maintenanceId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "insurance" ("insuranceId" int NOT NULL IDENTITY(1,1), "carId" int NOT NULL, "insuranceProvider" nvarchar(100) NOT NULL, "policyNumber" nvarchar(50) NOT NULL, "startDate" date NOT NULL, "endDate" date NOT NULL, CONSTRAINT "PK_392a0dfe563f19b9a57a8163e72" PRIMARY KEY ("insuranceId"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_6dd4ee3a8aee6ce2eabe7a56c3" ON "insurance" ("carId") WHERE "carId" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "car" ("carId" int NOT NULL IDENTITY(1,1), "carModel" nvarchar(100) NOT NULL, "manufacturer" nvarchar(100) NOT NULL, "year" int NOT NULL, "color" nvarchar(50) NOT NULL, "rentalRate" decimal(10,2) NOT NULL, "availability" bit NOT NULL CONSTRAINT "DF_b1a59a856dec266ec9dbba11d07" DEFAULT 1, "insuranceInsuranceId" int, CONSTRAINT "PK_9b83bc68cae15ad2220cdb9432a" PRIMARY KEY ("carId"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_e21ba2b1a4bb09db0dee833c77" ON "car" ("insuranceInsuranceId") WHERE "insuranceInsuranceId" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "reservation" ("reservationId" int NOT NULL IDENTITY(1,1), "carId" int NOT NULL, "customerId" int NOT NULL, "reservationDate" date NOT NULL CONSTRAINT "DF_a7c01dc90449cb9ee912d6d9130" DEFAULT GETDATE(), "pickupDate" date NOT NULL, "returnDate" date NOT NULL, CONSTRAINT "PK_afb522c4e412047329fd5806dc2" PRIMARY KEY ("reservationId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "location" ("locationId" int NOT NULL IDENTITY(1,1), "locationName" nvarchar(100) NOT NULL, "address" nvarchar(200) NOT NULL, "contactNumber" nvarchar(20) NOT NULL, CONSTRAINT "PK_8b51e14a3447c3df460c1907acb" PRIMARY KEY ("locationId"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_91237e89951409b1a51e3cde810" FOREIGN KEY ("rentalId") REFERENCES "rental"("rentalId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental" ADD CONSTRAINT "FK_7ac6d039d8d83c9b38cd51cefbf" FOREIGN KEY ("carId") REFERENCES "car"("carId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental" ADD CONSTRAINT "FK_def55ab51eed32ed8267ac956bb" FOREIGN KEY ("customerId") REFERENCES "customer"("customerId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "maintenance" ADD CONSTRAINT "FK_6c511176ffbc21a7698e0cc72c4" FOREIGN KEY ("carId") REFERENCES "car"("carId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "insurance" ADD CONSTRAINT "FK_6dd4ee3a8aee6ce2eabe7a56c35" FOREIGN KEY ("carId") REFERENCES "car"("carId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD CONSTRAINT "FK_e21ba2b1a4bb09db0dee833c778" FOREIGN KEY ("insuranceInsuranceId") REFERENCES "insurance"("insuranceId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" ADD CONSTRAINT "FK_2d51eea28bf301076d640182058" FOREIGN KEY ("carId") REFERENCES "car"("carId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" ADD CONSTRAINT "FK_7dce8a5a6907476eba30fedde91" FOREIGN KEY ("customerId") REFERENCES "customer"("customerId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reservation" DROP CONSTRAINT "FK_7dce8a5a6907476eba30fedde91"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" DROP CONSTRAINT "FK_2d51eea28bf301076d640182058"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" DROP CONSTRAINT "FK_e21ba2b1a4bb09db0dee833c778"`,
    );
    await queryRunner.query(
      `ALTER TABLE "insurance" DROP CONSTRAINT "FK_6dd4ee3a8aee6ce2eabe7a56c35"`,
    );
    await queryRunner.query(
      `ALTER TABLE "maintenance" DROP CONSTRAINT "FK_6c511176ffbc21a7698e0cc72c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental" DROP CONSTRAINT "FK_def55ab51eed32ed8267ac956bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental" DROP CONSTRAINT "FK_7ac6d039d8d83c9b38cd51cefbf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_91237e89951409b1a51e3cde810"`,
    );
    await queryRunner.query(`DROP TABLE "location"`);
    await queryRunner.query(`DROP TABLE "reservation"`);
    await queryRunner.query(
      `DROP INDEX "REL_e21ba2b1a4bb09db0dee833c77" ON "car"`,
    );
    await queryRunner.query(`DROP TABLE "car"`);
    await queryRunner.query(
      `DROP INDEX "REL_6dd4ee3a8aee6ce2eabe7a56c3" ON "insurance"`,
    );
    await queryRunner.query(`DROP TABLE "insurance"`);
    await queryRunner.query(`DROP TABLE "maintenance"`);
    await queryRunner.query(`DROP TABLE "rental"`);
    await queryRunner.query(`DROP TABLE "payment"`);
    await queryRunner.query(`DROP TABLE "customer"`);
  }
}
