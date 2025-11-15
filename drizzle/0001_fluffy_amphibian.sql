CREATE TABLE `verses` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`lines` text NOT NULL,
	`user_id` text NOT NULL,
	`createdAt` text NOT NULL DEFAULT (datetime('now')),
	`updatedAt` text NOT NULL DEFAULT (datetime('now')),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
