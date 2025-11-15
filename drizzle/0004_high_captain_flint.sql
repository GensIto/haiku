CREATE TABLE `dangos` (
	`verse_id` text NOT NULL,
	`user_id` text NOT NULL,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	PRIMARY KEY(`verse_id`, `user_id`),
	FOREIGN KEY (`verse_id`) REFERENCES `verses`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
