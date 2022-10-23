USE magic_snippets;

CREATE OR REPLACE VIEW like_count_view AS
SELECT like_target AS target, COUNT(liked_by) AS like_count
FROM `like`
GROUP BY like_target;

CREATE OR REPLACE VIEW comment_count_view AS
SELECT comment_target as target, COUNT(*) AS comment_count
FROM `comment`
GROUP BY comment_target;

CREATE OR REPLACE VIEW snippet_main_view AS
SELECT snippet.id                                      AS id,
       user_name                                       AS creator_user_name,
       CONCAT(user.given_name, ' ', user.family_name)  AS creator_display_name,
       profile_picture AS creator_profile_picture,
       created_at,
       title,
       remix_count,
       COALESCE((like_count_view.like_count), 0)       AS like_count,
       COALESCE((comment_count_view.comment_count), 0) AS comment_count
FROM snippet
         LEFT OUTER JOIN like_count_view ON like_count_view.target = snippet.id
         LEFT OUTER JOIN comment_count_view ON snippet.id = comment_count_view.target
         INNER JOIN user ON user.id = snippet.created_by;

