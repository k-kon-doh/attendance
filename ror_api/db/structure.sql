CREATE TABLE IF NOT EXISTS "schema_migrations" ("version" varchar NOT NULL PRIMARY KEY);
CREATE TABLE IF NOT EXISTS "ar_internal_metadata" ("key" varchar NOT NULL PRIMARY KEY, "value" varchar, "created_at" datetime(6) NOT NULL, "updated_at" datetime(6) NOT NULL);
CREATE TABLE IF NOT EXISTS "settings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "keyword" varchar NOT NULL, "setting_value" text NOT NULL, "note" text DEFAULT '' NOT NULL);
CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE IF NOT EXISTS "holidays" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "organization_id" integer DEFAULT -1 NOT NULL, "holiday" date NOT NULL);
CREATE UNIQUE INDEX "index_holidays_on_organization_id_and_holiday" ON "holidays" ("organization_id", "holiday");
CREATE UNIQUE INDEX "index_holidays_on_holiday_and_organization_id" ON "holidays" ("holiday", "organization_id");
CREATE TABLE IF NOT EXISTS "categories" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "keyword" varchar(50) NOT NULL, "code" varchar(50) NOT NULL, "name" text DEFAULT '' NOT NULL, "short_name" text DEFAULT '' NOT NULL, "show_order" integer DEFAULT 1 NOT NULL);
CREATE UNIQUE INDEX "index_categories_on_keyword_and_code" ON "categories" ("keyword", "code");
CREATE TABLE IF NOT EXISTS "labels" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "keyword" varchar(50) NOT NULL, "label" text DEFAULT '' NOT NULL, "short_label" text DEFAULT '' NOT NULL);
CREATE UNIQUE INDEX "index_labels_on_keyword" ON "labels" ("keyword");
CREATE TABLE IF NOT EXISTS "messages" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "keyword" varchar(50) NOT NULL, "message" text DEFAULT '' NOT NULL);
CREATE UNIQUE INDEX "index_messages_on_keyword" ON "messages" ("keyword");
CREATE TABLE IF NOT EXISTS "roles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text DEFAULT '' NOT NULL, "show_order" integer DEFAULT 1 NOT NULL);
CREATE TABLE IF NOT EXISTS "role_features" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "role_id" integer NOT NULL, "feature" text DEFAULT '' NOT NULL);
CREATE TABLE IF NOT EXISTS "organizations" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "code" varchar(10) NOT NULL, "name" text DEFAULT '' NOT NULL, "upper_organization_id" integer, "hierarchy" integer NOT NULL, "show_order" integer DEFAULT 1 NOT NULL, "validity" varchar(50) DEFAULT '1' NOT NULL);
CREATE TABLE IF NOT EXISTS "employees" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "no" varchar(10) NOT NULL, "name" text DEFAULT '' NOT NULL, "login_id" text(10) NOT NULL, "password_digest" text(1024) NOT NULL, "choice_id" text(1024) NOT NULL, "role_id" integer NOT NULL, "organization_id" integer NOT NULL, "last_login_at" datetime(6), "n_of_login_failes" integer DEFAULT 0 NOT NULL, "validity" varchar(50) DEFAULT '1' NOT NULL);
CREATE INDEX "index_employees_on_no" ON "employees" ("no");
CREATE INDEX "index_employees_on_login_id" ON "employees" ("login_id");
CREATE UNIQUE INDEX "index_employees_on_choice_id" ON "employees" ("choice_id");
CREATE INDEX "index_employees_on_organization_id" ON "employees" ("organization_id");
CREATE TABLE IF NOT EXISTS "employee_sets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text DEFAULT '' NOT NULL, "owner_organization_id" integer NOT NULL, "owner_employee_id" integer);
CREATE INDEX "index_employee_sets_on_owner_organization_id" ON "employee_sets" ("owner_organization_id");
CREATE INDEX "index_employee_sets_on_owner_employee_id" ON "employee_sets" ("owner_employee_id");
CREATE TABLE IF NOT EXISTS "employee_set_members" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "employee_set_id" integer NOT NULL, "employee_id" integer NOT NULL);
CREATE UNIQUE INDEX "index_employee_set_members_on_employee_set_id_and_employee_id" ON "employee_set_members" ("employee_set_id", "employee_id");
CREATE TABLE IF NOT EXISTS "attendance_kinds" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text DEFAULT '' NOT NULL, "short_name" text DEFAULT '' NOT NULL, "family" varchar(50) NOT NULL, "begin_date" varchar(50) NOT NULL, "begin_time" varchar(50) NOT NULL, "end_date" varchar(50) NOT NULL, "end_time" varchar(50) NOT NULL, "shift" varchar(50) DEFAULT '1' NOT NULL, "reason" varchar(50) DEFAULT '1' NOT NULL, "show_order" integer DEFAULT 1 NOT NULL, "validity" varchar(50) DEFAULT '1' NOT NULL);
CREATE TABLE IF NOT EXISTS "attendances" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "attendance_kind_id" integer NOT NULL, "status" varchar(50) NOT NULL, "subfamily" varchar(50) NOT NULL, "execution" varchar(50) NOT NULL, "begin_date" date, "begin_time" varchar(5) DEFAULT '' NOT NULL, "end_date" date, "end_time" varchar(5) DEFAULT '' NOT NULL, "shift" varchar(50) DEFAULT '' NOT NULL, "reason" text DEFAULT '' NOT NULL, "application_date" date, "agent_id" integer, "approver_id" integer, "approval_date" date, "approval_comment" text DEFAULT '' NOT NULL, "related_id" integer, "validity" varchar(50) DEFAULT '1' NOT NULL, "lock_version" integer DEFAULT 0, "created_at" datetime(6) NOT NULL, "updated_at" datetime(6) NOT NULL);
CREATE TABLE IF NOT EXISTS "attendance_members" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "attendance_id" integer NOT NULL, "employee_id" integer NOT NULL);
CREATE UNIQUE INDEX "index_attendance_members_on_attendance_id_and_employee_id" ON "attendance_members" ("attendance_id", "employee_id");
CREATE UNIQUE INDEX "index_attendance_members_on_employee_id_and_attendance_id" ON "attendance_members" ("employee_id", "attendance_id");
INSERT INTO "schema_migrations" (version) VALUES
('20230410000010'),
('20230410000020'),
('20230410000030'),
('20230410000040'),
('20230410000050'),
('20230410000060'),
('20230410000061'),
('20230410000070'),
('20230410000080'),
('20230410000090'),
('20230410000091'),
('20230410000100'),
('20230410000110'),
('20230410000111');


