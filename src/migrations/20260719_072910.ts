import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`role\` text DEFAULT '3' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text,
  	\`image_optimizer_thumb_hash\` text,
  	\`image_optimizer_original_size\` numeric,
  	\`image_optimizer_optimized_size\` numeric,
  	\`image_optimizer_status\` text,
  	\`image_optimizer_error\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	\`sizes_thumbnail_url\` text,
  	\`sizes_thumbnail_width\` numeric,
  	\`sizes_thumbnail_height\` numeric,
  	\`sizes_thumbnail_mime_type\` text,
  	\`sizes_thumbnail_filesize\` numeric,
  	\`sizes_thumbnail_filename\` text,
  	\`sizes_card_url\` text,
  	\`sizes_card_width\` numeric,
  	\`sizes_card_height\` numeric,
  	\`sizes_card_mime_type\` text,
  	\`sizes_card_filesize\` numeric,
  	\`sizes_card_filename\` text,
  	\`sizes_large_url\` text,
  	\`sizes_large_width\` numeric,
  	\`sizes_large_height\` numeric,
  	\`sizes_large_mime_type\` text,
  	\`sizes_large_filesize\` numeric,
  	\`sizes_large_filename\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_thumbnail_sizes_thumbnail_filename_idx\` ON \`media\` (\`sizes_thumbnail_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_card_sizes_card_filename_idx\` ON \`media\` (\`sizes_card_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_large_sizes_large_filename_idx\` ON \`media\` (\`sizes_large_filename\`);`)
  await db.run(sql`CREATE TABLE \`cars_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	\`tag\` text NOT NULL,
  	\`is_slideshow\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`carsgallery\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cars\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cars_gallery_order_idx\` ON \`cars_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cars_gallery_parent_id_idx\` ON \`cars_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`cars_gallery_image_idx\` ON \`cars_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`cars_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`feature\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cars\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cars_features_order_idx\` ON \`cars_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cars_features_parent_id_idx\` ON \`cars_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`cars_analytics_repairs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`description\` text NOT NULL,
  	\`cost\` numeric DEFAULT 0 NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cars\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cars_analytics_repairs_order_idx\` ON \`cars_analytics_repairs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cars_analytics_repairs_parent_id_idx\` ON \`cars_analytics_repairs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`cars_analytics_operational_costs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`description\` text NOT NULL,
  	\`cost\` numeric DEFAULT 0 NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cars\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cars_analytics_operational_costs_order_idx\` ON \`cars_analytics_operational_costs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cars_analytics_operational_costs_parent_id_idx\` ON \`cars_analytics_operational_costs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`cars_financing_leasing_tenor_months\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` text NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`cars_financing_leasing\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cars_financing_leasing_tenor_months_order_idx\` ON \`cars_financing_leasing_tenor_months\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`cars_financing_leasing_tenor_months_parent_idx\` ON \`cars_financing_leasing_tenor_months\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`cars_financing_leasing\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`provider\` text NOT NULL,
  	\`interest_rate\` numeric NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`cars\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`cars_financing_leasing_order_idx\` ON \`cars_financing_leasing\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`cars_financing_leasing_parent_id_idx\` ON \`cars_financing_leasing\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`cars\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`car_brand_id\` integer NOT NULL,
  	\`car_type_id\` integer NOT NULL,
  	\`car_specification_engine\` numeric NOT NULL,
  	\`car_specification_passenger\` numeric DEFAULT 5 NOT NULL,
  	\`car_specification_transmission\` text DEFAULT 'manual' NOT NULL,
  	\`car_specification_fuel\` text DEFAULT 'bensin' NOT NULL,
  	\`car_specification_color\` text NOT NULL,
  	\`car_specification_odometer\` numeric NOT NULL,
  	\`car_specification_registration_year\` numeric NOT NULL,
  	\`car_specification_build_year\` numeric NOT NULL,
  	\`cardthumbnail_id\` integer NOT NULL,
  	\`slug\` text,
  	\`description\` text NOT NULL,
  	\`analytics_status\` text DEFAULT 'available' NOT NULL,
  	\`analytics_purchase_price\` numeric DEFAULT 0 NOT NULL,
  	\`analytics_purchase_date\` text NOT NULL,
  	\`analytics_sold_price\` numeric DEFAULT 0,
  	\`analytics_sold_date\` text,
  	\`analytics_ownership_ownership_type\` text DEFAULT 'dealer' NOT NULL,
  	\`analytics_ownership_personal_owner_name\` text NOT NULL,
  	\`analytics_ownership_personal_owner_phone\` text NOT NULL,
  	\`analytics_ownership_personal_owner_nik\` text NOT NULL,
  	\`analytics_ownership_personal_owner_address\` text NOT NULL,
  	\`analytics_ownership_stnk_name\` text NOT NULL,
  	\`analytics_ownership_plate_number\` text NOT NULL,
  	\`analytics_ownership_hand_ownership\` numeric DEFAULT 1 NOT NULL,
  	\`price\` numeric NOT NULL,
  	\`financing_down_payment_min\` numeric NOT NULL,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`deleted_at\` text,
  	FOREIGN KEY (\`car_brand_id\`) REFERENCES \`car_brands\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`car_type_id\`) REFERENCES \`car_types\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`cardthumbnail_id\`) REFERENCES \`carsgallery\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`carsgallery\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`cars_car_brand_idx\` ON \`cars\` (\`car_brand_id\`);`)
  await db.run(sql`CREATE INDEX \`cars_car_type_idx\` ON \`cars\` (\`car_type_id\`);`)
  await db.run(sql`CREATE INDEX \`cars_cardthumbnail_idx\` ON \`cars\` (\`cardthumbnail_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`cars_slug_idx\` ON \`cars\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`cars_meta_meta_image_idx\` ON \`cars\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`cars_updated_at_idx\` ON \`cars\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`cars_created_at_idx\` ON \`cars\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`cars_deleted_at_idx\` ON \`cars\` (\`deleted_at\`);`)
  await db.run(sql`CREATE TABLE \`car_brands\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`icon_id\` integer,
  	\`count\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`icon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`car_brands_title_idx\` ON \`car_brands\` (\`title\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`car_brands_slug_idx\` ON \`car_brands\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`car_brands_icon_idx\` ON \`car_brands\` (\`icon_id\`);`)
  await db.run(sql`CREATE INDEX \`car_brands_updated_at_idx\` ON \`car_brands\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`car_brands_created_at_idx\` ON \`car_brands\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`car_types\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`icon_id\` integer,
  	\`count\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`icon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`car_types_title_idx\` ON \`car_types\` (\`title\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`car_types_slug_idx\` ON \`car_types\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`car_types_icon_idx\` ON \`car_types\` (\`icon_id\`);`)
  await db.run(sql`CREATE INDEX \`car_types_updated_at_idx\` ON \`car_types\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`car_types_created_at_idx\` ON \`car_types\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`carsgallery\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text,
  	\`image_optimizer_thumb_hash\` text,
  	\`image_optimizer_original_size\` numeric,
  	\`image_optimizer_optimized_size\` numeric,
  	\`image_optimizer_status\` text,
  	\`image_optimizer_error\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	\`sizes_thumbnail_url\` text,
  	\`sizes_thumbnail_width\` numeric,
  	\`sizes_thumbnail_height\` numeric,
  	\`sizes_thumbnail_mime_type\` text,
  	\`sizes_thumbnail_filesize\` numeric,
  	\`sizes_thumbnail_filename\` text,
  	\`sizes_card_url\` text,
  	\`sizes_card_width\` numeric,
  	\`sizes_card_height\` numeric,
  	\`sizes_card_mime_type\` text,
  	\`sizes_card_filesize\` numeric,
  	\`sizes_card_filename\` text,
  	\`sizes_gallery_url\` text,
  	\`sizes_gallery_width\` numeric,
  	\`sizes_gallery_height\` numeric,
  	\`sizes_gallery_mime_type\` text,
  	\`sizes_gallery_filesize\` numeric,
  	\`sizes_gallery_filename\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`carsgallery_updated_at_idx\` ON \`carsgallery\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`carsgallery_created_at_idx\` ON \`carsgallery\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`carsgallery_filename_idx\` ON \`carsgallery\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`carsgallery_sizes_thumbnail_sizes_thumbnail_filename_idx\` ON \`carsgallery\` (\`sizes_thumbnail_filename\`);`)
  await db.run(sql`CREATE INDEX \`carsgallery_sizes_card_sizes_card_filename_idx\` ON \`carsgallery\` (\`sizes_card_filename\`);`)
  await db.run(sql`CREATE INDEX \`carsgallery_sizes_gallery_sizes_gallery_filename_idx\` ON \`carsgallery\` (\`sizes_gallery_filename\`);`)
  await db.run(sql`CREATE TABLE \`exports\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`format\` text DEFAULT 'csv' NOT NULL,
  	\`limit\` numeric,
  	\`page\` numeric DEFAULT 1,
  	\`sort\` text,
  	\`sort_order\` text,
  	\`drafts\` text DEFAULT 'yes',
  	\`collection_slug\` text DEFAULT 'cars' NOT NULL,
  	\`where\` text DEFAULT '{}',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`exports_updated_at_idx\` ON \`exports\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`exports_created_at_idx\` ON \`exports\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`exports_filename_idx\` ON \`exports\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`exports_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`exports\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`exports_texts_order_parent\` ON \`exports_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`imports\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`collection_slug\` text DEFAULT 'cars' NOT NULL,
  	\`import_mode\` text,
  	\`match_field\` text DEFAULT 'id',
  	\`status\` text DEFAULT 'pending',
  	\`summary_imported\` numeric,
  	\`summary_updated\` numeric,
  	\`summary_total\` numeric,
  	\`summary_issues\` numeric,
  	\`summary_issue_details\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`imports_updated_at_idx\` ON \`imports\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`imports_created_at_idx\` ON \`imports\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`imports_filename_idx\` ON \`imports\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_jobs_log\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`executed_at\` text NOT NULL,
  	\`completed_at\` text NOT NULL,
  	\`task_slug\` text NOT NULL,
  	\`task_i_d\` text NOT NULL,
  	\`input\` text,
  	\`output\` text,
  	\`state\` text NOT NULL,
  	\`error\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`payload_jobs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_jobs_log_order_idx\` ON \`payload_jobs_log\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`payload_jobs_log_parent_id_idx\` ON \`payload_jobs_log\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_jobs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`input\` text,
  	\`completed_at\` text,
  	\`total_tried\` numeric DEFAULT 0,
  	\`has_error\` integer DEFAULT false,
  	\`error\` text,
  	\`task_slug\` text,
  	\`queue\` text DEFAULT 'default',
  	\`wait_until\` text,
  	\`processing\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_jobs_completed_at_idx\` ON \`payload_jobs\` (\`completed_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_jobs_total_tried_idx\` ON \`payload_jobs\` (\`total_tried\`);`)
  await db.run(sql`CREATE INDEX \`payload_jobs_has_error_idx\` ON \`payload_jobs\` (\`has_error\`);`)
  await db.run(sql`CREATE INDEX \`payload_jobs_task_slug_idx\` ON \`payload_jobs\` (\`task_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_jobs_queue_idx\` ON \`payload_jobs\` (\`queue\`);`)
  await db.run(sql`CREATE INDEX \`payload_jobs_wait_until_idx\` ON \`payload_jobs\` (\`wait_until\`);`)
  await db.run(sql`CREATE INDEX \`payload_jobs_processing_idx\` ON \`payload_jobs\` (\`processing\`);`)
  await db.run(sql`CREATE INDEX \`payload_jobs_updated_at_idx\` ON \`payload_jobs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_jobs_created_at_idx\` ON \`payload_jobs\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`cars_id\` integer,
  	\`car_brands_id\` integer,
  	\`car_types_id\` integer,
  	\`carsgallery_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`cars_id\`) REFERENCES \`cars\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`car_brands_id\`) REFERENCES \`car_brands\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`car_types_id\`) REFERENCES \`car_types\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`carsgallery_id\`) REFERENCES \`carsgallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_cars_id_idx\` ON \`payload_locked_documents_rels\` (\`cars_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_car_brands_id_idx\` ON \`payload_locked_documents_rels\` (\`car_brands_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_car_types_id_idx\` ON \`payload_locked_documents_rels\` (\`car_types_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_carsgallery_id_idx\` ON \`payload_locked_documents_rels\` (\`carsgallery_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`site\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_name\` text NOT NULL,
  	\`domain\` text NOT NULL,
  	\`logo_id\` integer NOT NULL,
  	\`location\` text NOT NULL,
  	\`address\` text NOT NULL,
  	\`maps\` text NOT NULL,
  	\`social_whatsapp\` text NOT NULL,
  	\`social_instagram\` text NOT NULL,
  	\`social_tiktok\` text NOT NULL,
  	\`social_facebook\` text NOT NULL,
  	\`short_description\` text NOT NULL,
  	\`seo_meta_title\` text,
  	\`seo_meta_description\` text,
  	\`seo_keywords\` text,
  	\`open_graph_og_title\` text,
  	\`open_graph_og_description\` text,
  	\`open_graph_og_image_id\` integer,
  	\`business_city\` text,
  	\`business_region\` text,
  	\`business_postal_code\` text,
  	\`business_latitude\` text,
  	\`business_longitude\` text,
  	\`advanced_s_e_o_canonical_url\` text,
  	\`advanced_s_e_o_robots\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`open_graph_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`site_logo_idx\` ON \`site\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`site_open_graph_open_graph_og_image_idx\` ON \`site\` (\`open_graph_og_image_id\`);`)
  await db.run(sql`CREATE TABLE \`hero_advantages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`icon\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`hero_advantages_order_idx\` ON \`hero_advantages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`hero_advantages_parent_id_idx\` ON \`hero_advantages\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`hero\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`sub_title\` text NOT NULL,
  	\`background_image_id\` integer,
  	\`whatsapp_message\` text NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`hero_background_image_idx\` ON \`hero\` (\`background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`review_reviews\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`product\` text NOT NULL,
  	\`rating\` text NOT NULL,
  	\`testimoni\` text NOT NULL,
  	\`avatar_id\` integer,
  	FOREIGN KEY (\`avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`review\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`review_reviews_order_idx\` ON \`review_reviews\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`review_reviews_parent_id_idx\` ON \`review_reviews\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`review_reviews_avatar_idx\` ON \`review_reviews\` (\`avatar_id\`);`)
  await db.run(sql`CREATE TABLE \`review\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`sub_title\` text NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`advantage_advantages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`desc\` text NOT NULL,
  	\`icon\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`advantage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`advantage_advantages_order_idx\` ON \`advantage_advantages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`advantage_advantages_parent_id_idx\` ON \`advantage_advantages\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`advantage\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`sub_title\` text NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`image_optimizer_state\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`collections\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`cars_gallery\`;`)
  await db.run(sql`DROP TABLE \`cars_features\`;`)
  await db.run(sql`DROP TABLE \`cars_analytics_repairs\`;`)
  await db.run(sql`DROP TABLE \`cars_analytics_operational_costs\`;`)
  await db.run(sql`DROP TABLE \`cars_financing_leasing_tenor_months\`;`)
  await db.run(sql`DROP TABLE \`cars_financing_leasing\`;`)
  await db.run(sql`DROP TABLE \`cars\`;`)
  await db.run(sql`DROP TABLE \`car_brands\`;`)
  await db.run(sql`DROP TABLE \`car_types\`;`)
  await db.run(sql`DROP TABLE \`carsgallery\`;`)
  await db.run(sql`DROP TABLE \`exports\`;`)
  await db.run(sql`DROP TABLE \`exports_texts\`;`)
  await db.run(sql`DROP TABLE \`imports\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_jobs_log\`;`)
  await db.run(sql`DROP TABLE \`payload_jobs\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`site\`;`)
  await db.run(sql`DROP TABLE \`hero_advantages\`;`)
  await db.run(sql`DROP TABLE \`hero\`;`)
  await db.run(sql`DROP TABLE \`review_reviews\`;`)
  await db.run(sql`DROP TABLE \`review\`;`)
  await db.run(sql`DROP TABLE \`advantage_advantages\`;`)
  await db.run(sql`DROP TABLE \`advantage\`;`)
  await db.run(sql`DROP TABLE \`image_optimizer_state\`;`)
}
