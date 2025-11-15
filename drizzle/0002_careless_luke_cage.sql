PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_verses` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`lines` text NOT NULL,
	`user_id` text NOT NULL,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	`updatedAt` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_verses`("id", "type", "lines", "user_id", "createdAt", "updatedAt") SELECT "id", "type", "lines", "user_id", "createdAt", "updatedAt" FROM `verses`;--> statement-breakpoint
DROP TABLE `verses`;--> statement-breakpoint
ALTER TABLE `__new_verses` RENAME TO `verses`;--> statement-breakpoint
PRAGMA foreign_keys=ON;