CREATE TABLE `post` (
	`id` text PRIMARY KEY,
	`title` text NOT NULL,
	`slug` text NOT NULL UNIQUE,
	`status` text DEFAULT 'draft' NOT NULL,
	`blocks` text NOT NULL,
	`excerpt` text,
	`cover_image` text,
	`author_id` text,
	`published_at` integer,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_post_author_id_user_id_fk` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE SET NULL
);
--> statement-breakpoint
CREATE INDEX `post_status_idx` ON `post` (`status`);--> statement-breakpoint
CREATE INDEX `post_publishedAt_idx` ON `post` (`published_at`);