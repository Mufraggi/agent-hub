CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skill_dependencies" (
	"skill_id" uuid NOT NULL,
	"depends_on_skill_id" uuid NOT NULL,
	"is_required" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "skill_dependencies_skill_id_depends_on_skill_id_pk" PRIMARY KEY("skill_id","depends_on_skill_id"),
	CONSTRAINT "skill_self_ref_check" CHECK ("skill_dependencies"."skill_id" != "skill_dependencies"."depends_on_skill_id")
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"content" text NOT NULL,
	"created_by" text NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"version" varchar(20) DEFAULT '1.0.0' NOT NULL,
	"downloads_count" integer DEFAULT 0 NOT NULL,
	"stars_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "skills_slug_unique" UNIQUE("slug"),
	CONSTRAINT "skills_downloads_check" CHECK ("skills"."downloads_count" >= 0),
	CONSTRAINT "skills_stars_check" CHECK ("skills"."stars_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "sub_agent_skills" (
	"sub_agent_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	"load_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sub_agent_skills_sub_agent_id_skill_id_pk" PRIMARY KEY("sub_agent_id","skill_id"),
	CONSTRAINT "subagent_skills_load_order_check" CHECK ("sub_agent_skills"."load_order" > 0)
);
--> statement-breakpoint
CREATE TABLE "sub_agents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"model" varchar(50) DEFAULT 'claude-sonnet-4' NOT NULL,
	"permission_mode" varchar(20) DEFAULT 'read_write' NOT NULL,
	"system_instructions" text NOT NULL,
	"created_by" text NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"version" varchar(20) DEFAULT '1.0.0' NOT NULL,
	"downloads_count" integer DEFAULT 0 NOT NULL,
	"forks_count" integer DEFAULT 0 NOT NULL,
	"stars_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sub_agents_slug_unique" UNIQUE("slug"),
	CONSTRAINT "permission_mode_check" CHECK ("sub_agents"."permission_mode" IN ('read_only', 'read_write')),
	CONSTRAINT "subagents_downloads_check" CHECK ("sub_agents"."downloads_count" >= 0),
	CONSTRAINT "subagents_forks_check" CHECK ("sub_agents"."forks_count" >= 0),
	CONSTRAINT "subagents_stars_check" CHECK ("sub_agents"."stars_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "skill_tags" (
	"skill_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "skill_tags_skill_id_tag_id_pk" PRIMARY KEY("skill_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "sub_agent_tags" (
	"sub_agent_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sub_agent_tags_sub_agent_id_tag_id_pk" PRIMARY KEY("sub_agent_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name"),
	CONSTRAINT "usage_count_check" CHECK ("tags"."usage_count" >= 0)
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_dependencies" ADD CONSTRAINT "skill_dependencies_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_dependencies" ADD CONSTRAINT "skill_dependencies_depends_on_skill_id_skills_id_fk" FOREIGN KEY ("depends_on_skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_agent_skills" ADD CONSTRAINT "sub_agent_skills_sub_agent_id_sub_agents_id_fk" FOREIGN KEY ("sub_agent_id") REFERENCES "public"."sub_agents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_agents" ADD CONSTRAINT "sub_agents_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_tags" ADD CONSTRAINT "skill_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_agent_tags" ADD CONSTRAINT "sub_agent_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_skill_deps_skill" ON "skill_dependencies" USING btree ("skill_id");--> statement-breakpoint
CREATE INDEX "idx_skill_deps_depends" ON "skill_dependencies" USING btree ("depends_on_skill_id");--> statement-breakpoint
CREATE INDEX "idx_skills_created_by" ON "skills" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "idx_skills_is_public" ON "skills" USING btree ("is_public");--> statement-breakpoint
CREATE INDEX "idx_subagent_skills_subagent" ON "sub_agent_skills" USING btree ("sub_agent_id");--> statement-breakpoint
CREATE INDEX "idx_subagent_skills_skill" ON "sub_agent_skills" USING btree ("skill_id");--> statement-breakpoint
CREATE INDEX "idx_subagents_created_by" ON "sub_agents" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "idx_subagents_is_public" ON "sub_agents" USING btree ("is_public");--> statement-breakpoint
CREATE INDEX "idx_skill_tags_skill" ON "skill_tags" USING btree ("skill_id");--> statement-breakpoint
CREATE INDEX "idx_skill_tags_tag" ON "skill_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "idx_tags_name" ON "tags" USING btree ("name");