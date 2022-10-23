const {Builder, Browser, By, Key, until} = require('selenium-webdriver');


const dbConnection = require("../database");

Object.getPrototypeOf(dbConnection).insertRow = async function(tableName, data) {
    return await this.query(`INSERT INTO ?? SET ` + dbConnection.escape(data), [tableName]);
}
Object.getPrototypeOf(dbConnection).updateRow = async function(tableName, criteria, data) {
    const criteriaEntries = Object.entries(criteria);
    const criterionString = Array.from({length: criteriaEntries.length}, () => "?? = ?").join(" AND ");
    const dataEntries = Object.entries(data);
    const dataString = Array.from({length: dataEntries.length}, () => "?? = ?").join(", ");
    const query = "UPDATE ?? SET " + dataString + " WHERE " + criterionString;
    return await this.query(query, [tableName, ...dataEntries.flatMap(x => x), ...criteriaEntries.flatMap(x => x)]);
}

function delay(secs) {
    return new Promise(r => setTimeout(r, secs));
}

async function processUser(userName, updateUser=false) {
    let driver;
    async function createUser() {
        const [result] = await dbConnection.query("SELECT * FROM user WHERE user_name = ?", [userName]);
        const [curUser] = result;
        if (!curUser || updateUser) {
            const socialMediaLinks = await Promise.all(
                (await driver.findElements(By.css("#profile-links a"))).map(element => element.getAttribute("href"))
            );
            const profileImageURL = await driver.findElement(By.id("profile-image")).getAttribute("src");
            const fullName = await driver.findElement(By.css("#profile-name-header .profile-name-wrapper")).getText();
            const [_, givenName, familyName] = fullName.match(/(.*?)\s(.*)/);
            const email = userName + "@magicsnippets-testing.com";
            const record = {
                user_name: userName,
                given_name: givenName,
                family_name: familyName,
                email,
                profile_picture: profileImageURL,
                social_media_info: JSON.stringify(socialMediaLinks),
            }
            if (!curUser) {
                await dbConnection.insertRow("user", record);
            } else {
                await dbConnection.updateRow("user", {
                    user_name: userName
                }, record);
            }
        }
    }
    while (true) {
        try {
            driver = await new Builder().forBrowser(Browser.CHROME).build();
            await driver.get(`https://codepen.io/${userName}`);
            await driver.wait(async () => {
                return await driver.executeScript("return document.querySelector('h2 a') !== null");
            });
            await createUser();
            const snippetLinks = await driver.findElements(By.css("h2 a"));
            const snippetLinkHrefs = await Promise.all(snippetLinks.map(link => link.getAttribute("href")));
            if (snippetLinkHrefs.length === 0) {
                console.warn("No snippets found.");
                continue;
            }
            console.log(`Processing ${snippetLinkHrefs.length} snippets.`);
            await Promise.all(snippetLinkHrefs.map(snippet => processSnippet(snippet, userName)));
            break;
        } catch (e) {
            console.log(e);
        } finally {
            await driver.quit();
        }
    }
}

async function processSnippet(snippetLink, userName) {
    let driver;
    while (true) {
        try {
            driver = await new Builder().forBrowser(Browser.CHROME).build();
            await driver.get(snippetLink);
            await driver.wait(async () => {
                return await driver.executeScript("return document.querySelectorAll('.CodeMirror').length >= 3");
            });
            const title = await driver.findElement(By.css("#item-title a")).getText();
            console.log(title);
            const [[authorInfo]] = await dbConnection.query("SELECT id FROM user WHERE user_name = ?", [userName]);
            const authorID = authorInfo.id;
            const htmlCode = await driver.executeScript("return document.querySelector('#box-html .CodeMirror').CodeMirror.getValue()");
            const cssCode = await driver.executeScript("return document.querySelector('#box-css .CodeMirror').CodeMirror.getValue()");
            const jsCode = await driver.executeScript("return document.querySelector('#box-js .CodeMirror').CodeMirror.getValue()");
            const htmlPreprocessor = await driver.findElement(By.id("html-preprocessor")).getProperty("value");
            const cssPreprocessor = await driver.findElement(By.id("css-preprocessor")).getProperty("value");
            const jsPreprocessor = await driver.findElement(By.id("js-preprocessor")).getProperty("value");
            const result = {
                title,
                created_by: authorID,
                html_content: htmlCode,
                css_content: cssCode,
                js_content: jsCode,
                html_preprocessor: htmlPreprocessor,
                css_preprocessor: cssPreprocessor,
                js_preprocessor: jsPreprocessor,
            };
            await dbConnection.insertRow("snippet", result);
            break;
        } catch (e) {
        } finally {
            await driver.quit();
        }
    }
}

async function main() {
    const userNames = [
        "ricardoolivaalonso",
        "khanhtranngoccva",
        "alvaromontoro",
        "asyrafhussin",

    ]
    for (let userName of userNames) {
        await processUser(userName, true);
    }
    await dbConnection.commit();
    await dbConnection.end();
}

main();

// processSnippet("https://codepen.io/ricardoolivaalonso/pen/PoRvRmM", "ricardoolivaalonso");