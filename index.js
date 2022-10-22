const {Builder, Browser, By, Key, until} = require('selenium-webdriver');

function delay(secs) {
    return new Promise(r => setTimeout(r, secs));
}

async function process(userName) {
    let driver = await new Builder().forBrowser(Browser.CHROME).build();
    try {
        await driver.get(`https://codepen.io/${userName}`);
        const snippetLinks = await driver.findElements(By.css("h2 a"));
        const snippetLinkHrefs = await Promise.all(snippetLinks.map(link => link.getAttribute("href")));
        return {
            snippets: snippetLinkHrefs,
        };
    } catch (e) {
        console.log(e);
    } finally {
        await driver.quit();
    }
}

async function processSnippet(snippetLink) {
    let driver = await new Builder().forBrowser(Browser.CHROME).build();
    try {
        await driver.get(snippetLink);
        await driver.wait(async () => {
            return await driver.executeScript("return document.readyState === 'complete'");
        });
        await delay(0.25);
        const title = await driver.findElement(By.id("editable-title-span")).getAttribute("title");
        const author = (await driver.findElement(By.className("ItemTitle_ownerLink-L8qgY")).getAttribute("href")).replace(/^.*\//, "");
        const htmlCode = await driver.executeScript("return document.querySelector('#box-html .CodeMirror').CodeMirror.getValue()");
        const cssCode = await driver.executeScript("return document.querySelector('#box-css .CodeMirror').CodeMirror.getValue()");
        const jsCode = await driver.executeScript("return document.querySelector('#box-js .CodeMirror').CodeMirror.getValue()");
    } catch (e) {
        console.log(e);
    } finally {
    }
}

async function createUser(userName) {

}

processSnippet("https://codepen.io/ricardoolivaalonso/pen/PoRvRmM");