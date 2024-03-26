CREATE TABLE IF NOT EXISTS "trustmarkt1_account" (
	"userId" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "trustmarkt1_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trustmarkt1_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"createdById" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trustmarkt1_session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trustmarkt1_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trustmarkt1_verificationToken" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "trustmarkt1_verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "trustmarkt1_account" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "createdById_idx" ON "trustmarkt1_post" ("createdById");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "trustmarkt1_post" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "trustmarkt1_session" ("userId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trustmarkt1_account" ADD CONSTRAINT "trustmarkt1_account_userId_trustmarkt1_user_id_fk" FOREIGN KEY ("userId") REFERENCES "trustmarkt1_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trustmarkt1_post" ADD CONSTRAINT "trustmarkt1_post_createdById_trustmarkt1_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "trustmarkt1_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trustmarkt1_session" ADD CONSTRAINT "trustmarkt1_session_userId_trustmarkt1_user_id_fk" FOREIGN KEY ("userId") REFERENCES "trustmarkt1_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
