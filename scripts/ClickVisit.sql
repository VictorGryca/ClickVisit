CREATE TABLE "agencies"(
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) WITH
        TIME zone NOT NULL DEFAULT 'now()'
);
ALTER TABLE
    "agencies" ADD PRIMARY KEY("id");
CREATE TABLE "brokers"(
    "id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "agency_id" INTEGER NOT NULL,
    "creci" TEXT NOT NULL,
    "phone" TEXT NOT NULL
);
ALTER TABLE
    "brokers" ADD PRIMARY KEY("id");
CREATE TABLE "properties"(
    "id" INTEGER NOT NULL,
    "agency_id" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "status" TEXT NOT NULL
);
ALTER TABLE
    "properties" ADD PRIMARY KEY("id");
CREATE TABLE "events"(
    "id" INTEGER NOT NULL,
    "event_type" TEXT NOT NULL,
    "broker_id" INTEGER NOT NULL,
    "property_id" INTEGER NOT NULL,
    "starts_at" TIMESTAMP(0) WITH
        TIME zone NOT NULL,
        "ends_at" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL,
        "created_by" INTEGER NOT NULL
);
ALTER TABLE
    "events" ADD PRIMARY KEY("id");
COMMENT
ON COLUMN
    "events"."event_type" IS '"block","maintenance"';
CREATE TABLE "clients"(
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL
);
ALTER TABLE
    "clients" ADD PRIMARY KEY("id");
CREATE TABLE "visits"(
    "id" INTEGER NOT NULL,
    "client_id" INTEGER NOT NULL,
    "broker_id" INTEGER NOT NULL,
    "property_id" INTEGER NOT NULL,
    "starts_at" TIMESTAMP(0) WITH
        TIME zone NOT NULL,
        "ends_at" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL,
        "status" TEXT NOT NULL
);
ALTER TABLE
    "visits" ADD PRIMARY KEY("id");
COMMENT
ON COLUMN
    "visits"."status" IS '"confirmed", "canceled"';
ALTER TABLE
    "events" ADD CONSTRAINT "events_broker_id_foreign" FOREIGN KEY("broker_id") REFERENCES "brokers"("id");
ALTER TABLE
    "brokers" ADD CONSTRAINT "brokers_agency_id_foreign" FOREIGN KEY("agency_id") REFERENCES "agencies"("id");
ALTER TABLE
    "events" ADD CONSTRAINT "events_property_id_foreign" FOREIGN KEY("property_id") REFERENCES "properties"("id");
ALTER TABLE
    "visits" ADD CONSTRAINT "visits_property_id_foreign" FOREIGN KEY("property_id") REFERENCES "properties"("id");
ALTER TABLE
    "visits" ADD CONSTRAINT "visits_broker_id_foreign" FOREIGN KEY("broker_id") REFERENCES "brokers"("id");
ALTER TABLE
    "properties" ADD CONSTRAINT "properties_agency_id_foreign" FOREIGN KEY("agency_id") REFERENCES "agencies"("id");
ALTER TABLE
    "visits" ADD CONSTRAINT "visits_client_id_foreign" FOREIGN KEY("client_id") REFERENCES "clients"("id");