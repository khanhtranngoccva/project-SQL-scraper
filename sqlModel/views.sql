USE magic_snippets;

CREATE OR REPLACE VIEW like_count_view AS
SELECT like_target AS target, COUNT(liked_by) AS like_count
FROM `like`
GROUP BY like_target;

CREATE OR REPLACE VIEW comment_count_view AS
SELECT comment_target as target, COUNT(*) AS comment_count
FROM `comment`
GROUP BY comment_target;

CREATE OR REPLACE VIEW engagement_view AS
SELECT id, like_count_view.like_count AS like_count, comment_count_view.comment_count AS comment_count
FROM snippet
LEFT OUTER JOIN like_count_view ON like_count_view.target = snippet.id
LEFT OUTER JOIN comment_count_view ON like_count_view.target = comment_count_view.target

