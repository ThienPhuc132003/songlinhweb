-- Case Study System: Add challenges, outcomes, testimonials, video fields
ALTER TABLE projects ADD COLUMN challenges TEXT DEFAULT NULL;
ALTER TABLE projects ADD COLUMN outcomes TEXT DEFAULT NULL;
ALTER TABLE projects ADD COLUMN testimonial_name TEXT DEFAULT NULL;
ALTER TABLE projects ADD COLUMN testimonial_content TEXT DEFAULT NULL;
ALTER TABLE projects ADD COLUMN video_url TEXT DEFAULT NULL;
