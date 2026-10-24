CREATE TABLE `course` (
	`id` text PRIMARY KEY,
	`title` text NOT NULL,
	`slug` text NOT NULL UNIQUE,
	`description` text,
	`cover_image` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`author_id` text,
	`published_at` integer,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_course_author_id_user_id_fk` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE SET NULL
);
--> statement-breakpoint
CREATE TABLE `course_module` (
	`id` text PRIMARY KEY,
	`course_id` text NOT NULL,
	`title` text NOT NULL,
	`position` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_course_module_course_id_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `lesson` (
	`id` text PRIMARY KEY,
	`module_id` text NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`position` integer NOT NULL,
	`content` text,
	`passing_score` integer DEFAULT 70 NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_lesson_module_id_course_module_id_fk` FOREIGN KEY (`module_id`) REFERENCES `course_module`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `lesson_progress` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL,
	`lesson_id` text NOT NULL,
	`status` text DEFAULT 'in_progress' NOT NULL,
	`last_accessed_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`completed_at` integer,
	CONSTRAINT `fk_lesson_progress_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_lesson_progress_lesson_id_lesson_id_fk` FOREIGN KEY (`lesson_id`) REFERENCES `lesson`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `quiz_attempt` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL,
	`lesson_id` text NOT NULL,
	`score` integer NOT NULL,
	`passed` integer NOT NULL,
	`started_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`submitted_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_quiz_attempt_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_quiz_attempt_lesson_id_lesson_id_fk` FOREIGN KEY (`lesson_id`) REFERENCES `lesson`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `quiz_attempt_answer` (
	`id` text PRIMARY KEY,
	`attempt_id` text NOT NULL,
	`question_id` text NOT NULL,
	`selected_option_id` text,
	`is_correct` integer NOT NULL,
	CONSTRAINT `fk_quiz_attempt_answer_attempt_id_quiz_attempt_id_fk` FOREIGN KEY (`attempt_id`) REFERENCES `quiz_attempt`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_quiz_attempt_answer_question_id_quiz_question_id_fk` FOREIGN KEY (`question_id`) REFERENCES `quiz_question`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_quiz_attempt_answer_selected_option_id_quiz_option_id_fk` FOREIGN KEY (`selected_option_id`) REFERENCES `quiz_option`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `quiz_option` (
	`id` text PRIMARY KEY,
	`question_id` text NOT NULL,
	`text` text NOT NULL,
	`is_correct` integer DEFAULT false NOT NULL,
	CONSTRAINT `fk_quiz_option_question_id_quiz_question_id_fk` FOREIGN KEY (`question_id`) REFERENCES `quiz_question`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `quiz_question` (
	`id` text PRIMARY KEY,
	`lesson_id` text NOT NULL,
	`text` text NOT NULL,
	`position` integer NOT NULL,
	CONSTRAINT `fk_quiz_question_lesson_id_lesson_id_fk` FOREIGN KEY (`lesson_id`) REFERENCES `lesson`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX `course_status_idx` ON `course` (`status`);--> statement-breakpoint
CREATE INDEX `course_publishedAt_idx` ON `course` (`published_at`);--> statement-breakpoint
CREATE INDEX `course_module_courseId_idx` ON `course_module` (`course_id`);--> statement-breakpoint
CREATE INDEX `lesson_moduleId_idx` ON `lesson` (`module_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `lesson_progress_userLesson_idx` ON `lesson_progress` (`user_id`,`lesson_id`);--> statement-breakpoint
CREATE INDEX `lesson_progress_userId_idx` ON `lesson_progress` (`user_id`);--> statement-breakpoint
CREATE INDEX `quiz_attempt_userLesson_idx` ON `quiz_attempt` (`user_id`,`lesson_id`);--> statement-breakpoint
CREATE INDEX `quiz_attempt_answer_attemptId_idx` ON `quiz_attempt_answer` (`attempt_id`);--> statement-breakpoint
CREATE INDEX `quiz_option_questionId_idx` ON `quiz_option` (`question_id`);--> statement-breakpoint
CREATE INDEX `quiz_question_lessonId_idx` ON `quiz_question` (`lesson_id`);