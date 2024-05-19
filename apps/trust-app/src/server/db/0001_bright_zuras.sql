CREATE TABLE IF NOT EXISTS "trustmarkt1_profile" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"faceId" json,
	"address" text,
	"listings" json,
	"status" varchar,
	"verificationVideo" text,
	"ratings" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "trustmarkt1_account" ADD CONSTRAINT "trustmarkt1_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trustmarkt1_account" ADD CONSTRAINT "trustmarkt1_account_userId_trustmarkt1_user_id_fk" FOREIGN KEY ("userId") REFERENCES "trustmarkt1_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "trustmarkt1_account" DROP COLUMN IF EXISTS "id";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trustmarkt1_profile" ADD CONSTRAINT "trustmarkt1_profile_userId_trustmarkt1_user_id_fk" FOREIGN KEY ("userId") REFERENCES "trustmarkt1_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
