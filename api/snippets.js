const dbConnection = require("../database");

/**
 * Cherry picks raw input data.
 * @param html_content
 * @param css_content
 * @param js_content
 * @param title
 * @param markdown_blog_content
 * @param html_preprocessor
 * @param css_preprocessor
 * @param js_preprocessor
 * @param additional_css
 * @param additional_js
 * @returns {string}
 */
function filterAndEscape(
    {
        html_content, css_content, js_content, title,
        markdown_blog_content, html_preprocessor, css_preprocessor,
        js_preprocessor, additional_css, additional_js
    }) {
    return dbConnection.escape({
        html_content, css_content, js_content, title,
        markdown_blog_content, html_preprocessor, css_preprocessor,
        js_preprocessor, additional_css, additional_js
    });
}

module.exports = {
    async getNewest(maxSnippets = 6, page = 1) {
        const [[result]] = await dbConnection.query("CALL get_newest(?, ?)", [maxSnippets, (page - 1) * maxSnippets]);
        return result;
    },
    async getMostPopular(maxSnippets = 6, page = 1) {
        const [[result]] = await dbConnection.query("CALL get_most_popular(?, ?)", [maxSnippets, (page - 1) * maxSnippets]);
        return result;
    },
    async addSnippet({userID}, snippetData) {
        const data = filterAndEscape(snippetData);
        await dbConnection.query(`INSERT INTO snippet
                                  SET ${data}`);
    },
    async editSnippet({userID, snippetID}, snippetData) {
        if (!snippetID || !userID) {
            throw new Error("Must specify an user ID and a snippet ID.");
        }
        const data = filterAndEscape(snippetData);
        await dbConnection.query(`UPDATE snippet
                                  SET ${data}
                                  WHERE id = ?
                                    AND created_by = ?`, [snippetID, userID]);
    },
    async addComment({userID, snippetID}, comment) {
        await dbConnection.query(`INSERT INTO comment (commented_by, comment_target, comment_text)
                                  VALUES (?, ?, ?)`, [userID, snippetID, comment]);
    },
    async editComment({userID, commentID}, comment) {
        await dbConnection.query(`UPDATE comment SET comment_text = ? WHERE commented_by = ? AND id = ?`, [comment, userID, commentID]);
    },
    async deleteComment({userID, commentID}) {
        await dbConnection.query(`DELETE FROM comment WHERE commented_by = ? AND id = ?`, [userID, commentID]);
    },
    async deleteSnippet({userID, snippetID}) {
        if (!snippetID || !userID) {
            throw new Error("Must specify an user ID and a snippet ID.");
        }
        await dbConnection.query(`DELETE
                                  FROM snippet
                                  WHERE id = ?
                                    AND created_by = ?`, [snippetID, userID]);
    },
    async checkLike(userID, snippetID) {
        await dbConnection.query("CALL check_like(?, ?)", [userID, snippetID]);
    },
    async addLike(userID, snippetID) {
        await dbConnection.query("CALL add_like(?, ?)", [userID, snippetID]);
    },
    async removeLike(userID, snippetID) {
        await dbConnection.query("CALL remove_like(?, ?)", [userID, snippetID]);
    },
}