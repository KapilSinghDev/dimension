import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1794243225265 implements MigrationInterface {
    name = 'InitialSchema1794243225265'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organisation" ("organisationId" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "joining_date" TIMESTAMP NOT NULL, CONSTRAINT "PK_31ca6400ace0fbec29c01a5418e" PRIMARY KEY ("organisationId"))`);
        await queryRunner.query(`CREATE TABLE "resources" ("resource_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resource_name" character varying NOT NULL, "resource_content" character varying NOT NULL, "resource_created_on" TIMESTAMP NOT NULL DEFAULT now(), "resource_image" character varying, "resourceForId" integer, "resourceMadeByUserId" integer, CONSTRAINT "PK_b9fa5542581d6107e9bf2f49ac0" PRIMARY KEY ("resource_id"))`);
        await queryRunner.query(`CREATE TABLE "projects" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying, "create_date" TIMESTAMP NOT NULL DEFAULT now(), "taget_date" TIMESTAMP NOT NULL DEFAULT now(), "health" character varying NOT NULL, "status" character varying NOT NULL, "priority" character varying NOT NULL, "createdByUserId" integer, "managerUserId" integer, "organisationOrganisationId" integer, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "updates" ("update_id" SERIAL NOT NULL, "update_time" TIMESTAMP NOT NULL DEFAULT now(), "update_comment" character varying NOT NULL, "update_asset" character varying, "updatedByUserId" integer, "issuesIssueId" integer, CONSTRAINT "PK_c54bceec15c8af2a89f02e6b105" PRIMARY KEY ("update_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."issues_lable_enum" AS ENUM('bug', 'feature', 'improvement', 'no_lable')`);
        await queryRunner.query(`CREATE TYPE "public"."issues_priority_enum" AS ENUM('high', 'medium', 'low')`);
        await queryRunner.query(`CREATE TYPE "public"."issues_status_enum" AS ENUM('active', 'closed', 'backlog')`);
        await queryRunner.query(`CREATE TABLE "issues" ("issue_id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying, "lable" "public"."issues_lable_enum" NOT NULL DEFAULT 'no_lable', "created_at" TIMESTAMP NOT NULL, "created_by" integer NOT NULL, "deadline" TIMESTAMP NOT NULL, "priority" "public"."issues_priority_enum" NOT NULL DEFAULT 'medium', "status" "public"."issues_status_enum" NOT NULL DEFAULT 'active', "assigneeUserId" integer, "teamTeamId" integer, "projectId" integer, "organisationOrganisationId" integer, CONSTRAINT "PK_7110f1fe86859dfef01b7d46673" PRIMARY KEY ("issue_id"))`);
        await queryRunner.query(`CREATE TABLE "teams" ("team_id" SERIAL NOT NULL, "name" character varying NOT NULL, "adminUserId" integer, "organisationOrganisationId" integer, CONSTRAINT "PK_10ccce4d7d878c221ee7c5c8057" PRIMARY KEY ("team_id"))`);
        await queryRunner.query(`CREATE TABLE "credentials" ("user_id" SERIAL NOT NULL, "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "email" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "password" character varying NOT NULL, CONSTRAINT "PK_c68a6c53e95a7dc357f4ebce8f0" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("user_id" SERIAL NOT NULL, "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "email" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "picture" character varying, "role" character varying, "organisationOrganisationId" integer, "teamTeamId" integer, CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`ALTER TABLE "resources" ADD CONSTRAINT "FK_289be9800eb275b0a4beb09996e" FOREIGN KEY ("resourceForId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "resources" ADD CONSTRAINT "FK_acf1e9f432dd5955a5a69c91427" FOREIGN KEY ("resourceMadeByUserId") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_35d26436e725a499a5af5b41312" FOREIGN KEY ("createdByUserId") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_bdf36c35f0539238cb38d579166" FOREIGN KEY ("managerUserId") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_c119097988f088a2ff04630c291" FOREIGN KEY ("organisationOrganisationId") REFERENCES "organisation"("organisationId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "updates" ADD CONSTRAINT "FK_b2cddbe9420f6133e78fe528799" FOREIGN KEY ("updatedByUserId") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "updates" ADD CONSTRAINT "FK_bd93b3663662eab5c549bfcaa90" FOREIGN KEY ("issuesIssueId") REFERENCES "issues"("issue_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issues" ADD CONSTRAINT "FK_504593af8f494286a03e7a58619" FOREIGN KEY ("assigneeUserId") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issues" ADD CONSTRAINT "FK_673b714ac00532ddfa395b5ec40" FOREIGN KEY ("teamTeamId") REFERENCES "teams"("team_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issues" ADD CONSTRAINT "FK_9f82fdfad8087663f95e203da67" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issues" ADD CONSTRAINT "FK_cac0d42d5bc35b7154122a8d43e" FOREIGN KEY ("organisationOrganisationId") REFERENCES "organisation"("organisationId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "teams" ADD CONSTRAINT "FK_19cc69701aeb626de62a7a1d1f7" FOREIGN KEY ("adminUserId") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "teams" ADD CONSTRAINT "FK_5428a1d81280571c6672fa3454e" FOREIGN KEY ("organisationOrganisationId") REFERENCES "organisation"("organisationId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_8922fffb8262b76e0ea398d49d6" FOREIGN KEY ("organisationOrganisationId") REFERENCES "organisation"("organisationId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_ed0c88dc5cd97e12d028c49aff8" FOREIGN KEY ("teamTeamId") REFERENCES "teams"("team_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_ed0c88dc5cd97e12d028c49aff8"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_8922fffb8262b76e0ea398d49d6"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP CONSTRAINT "FK_5428a1d81280571c6672fa3454e"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP CONSTRAINT "FK_19cc69701aeb626de62a7a1d1f7"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP CONSTRAINT "FK_cac0d42d5bc35b7154122a8d43e"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP CONSTRAINT "FK_9f82fdfad8087663f95e203da67"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP CONSTRAINT "FK_673b714ac00532ddfa395b5ec40"`);
        await queryRunner.query(`ALTER TABLE "issues" DROP CONSTRAINT "FK_504593af8f494286a03e7a58619"`);
        await queryRunner.query(`ALTER TABLE "updates" DROP CONSTRAINT "FK_bd93b3663662eab5c549bfcaa90"`);
        await queryRunner.query(`ALTER TABLE "updates" DROP CONSTRAINT "FK_b2cddbe9420f6133e78fe528799"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_c119097988f088a2ff04630c291"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_bdf36c35f0539238cb38d579166"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_35d26436e725a499a5af5b41312"`);
        await queryRunner.query(`ALTER TABLE "resources" DROP CONSTRAINT "FK_acf1e9f432dd5955a5a69c91427"`);
        await queryRunner.query(`ALTER TABLE "resources" DROP CONSTRAINT "FK_289be9800eb275b0a4beb09996e"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "credentials"`);
        await queryRunner.query(`DROP TABLE "teams"`);
        await queryRunner.query(`DROP TABLE "issues"`);
        await queryRunner.query(`DROP TYPE "public"."issues_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."issues_priority_enum"`);
        await queryRunner.query(`DROP TYPE "public"."issues_lable_enum"`);
        await queryRunner.query(`DROP TABLE "updates"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TABLE "resources"`);
        await queryRunner.query(`DROP TABLE "organisation"`);
    }

}
