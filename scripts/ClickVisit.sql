CREATE TABLE "agencies" (
  "id" INTEGER PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL
);

CREATE TABLE "brokers" (
  "id" INTEGER PRIMARY KEY NOT NULL,
  "agency_id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "creci" TEXT NOT NULL
);

CREATE TABLE "properties" (
  "id" INTEGER PRIMARY KEY NOT NULL,
  "agency_id" INTEGER NOT NULL,
  "address" TEXT NOT NULL,
  "price" INTEGER NOT NULL,
  "status" TEXT NOT NULL
);

CREATE TABLE "events" (
  "id" INTEGER PRIMARY KEY NOT NULL,
  "event_type" TEXT NOT NULL,
  "property_id" INTEGER NOT NULL,
  "starts_at" TIMESTAMP(0) NOT NULL,
  "ends_at" TIMESTAMP(0) NOT NULL,
  "description" TEXT
);

CREATE TABLE "clients" (
  "id" INTEGER PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL
);

CREATE TABLE "visits" (
  "id" INTEGER PRIMARY KEY NOT NULL,
  "client_id" INTEGER NOT NULL,
  "broker_id" INTEGER NOT NULL,
  "property_id" INTEGER NOT NULL,
  "starts_at" TIMESTAMP(0) NOT NULL,
  "ends_at" TIMESTAMP(0) NOT NULL,
  "status" TEXT NOT NULL
);

COMMENT ON COLUMN "events"."event_type" IS '"Available","maintenance"';

COMMENT ON COLUMN "visits"."status" IS '"confirmed", "canceled"';

ALTER TABLE "brokers" ADD CONSTRAINT "brokers_agency_id_foreign" FOREIGN KEY ("agency_id") REFERENCES "agencies" ("id");

ALTER TABLE "events" ADD CONSTRAINT "events_property_id_foreign" FOREIGN KEY ("property_id") REFERENCES "properties" ("id");

ALTER TABLE "visits" ADD CONSTRAINT "visits_property_id_foreign" FOREIGN KEY ("property_id") REFERENCES "properties" ("id");

ALTER TABLE "visits" ADD CONSTRAINT "visits_broker_id_foreign" FOREIGN KEY ("broker_id") REFERENCES "brokers" ("id");

ALTER TABLE "properties" ADD CONSTRAINT "properties_agency_id_foreign" FOREIGN KEY ("agency_id") REFERENCES "agencies" ("id");

ALTER TABLE "visits" ADD CONSTRAINT "visits_client_id_foreign" FOREIGN KEY ("client_id") REFERENCES "clients" ("id");
