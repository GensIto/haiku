ALTER TABLE `verses` ADD `user_name` text DEFAULT 'anonymous' NOT NULL;--> statement-breakpoint
ALTER TABLE `verses` ADD `is_publish` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `verses` ADD `is_deleted` integer DEFAULT false NOT NULL;