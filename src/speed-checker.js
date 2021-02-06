const puppeteer = require('puppeteer');
const fs = require('fs');
const minimist = require('minimist');
const mkdirp = require('mkdirp');

const argumentsOutput = `
  Usage: node speed-checker.js --speedSite <url>
  
  Arguments:
  
  speedSite <url>  (url of the sitespeed you want to take a screenshot of (fast.com, speedtest.net, etc))
`;

const visitWebsite = async (speedSite) => {

    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0); // temporary for now.
        console.log('going to the page: ', speedSite);
        await page.goto(speedSite, { waitUntil: 'domcontentloaded' });
        console.log('loading completed....');

        const resultsSelector = '#speed-progress-indicator.succeeded';
        await page.waitForSelector(resultsSelector);
        console.log('Has succeeded');

        const fileTStamp = new Date().toISOString().replace(/:/g, '-');

        await page.screenshot({ path: `../screenshots/${fileTStamp}.png`, fullPage: true });
        console.log('Screenshot taken');
        await browser.close();






        console.log('check completed');

    } catch (err) {
        console.log('error: ', err);
    }
}

const createFolderAndLaunch = (speedSite) => {

    mkdirp('../screenshots')
        .then(async () => {
            visitWebsite(speedSite);
        })
        .catch((err) => {
            throw err;
        });
}

const areArgsValid = (speedSite) => {
    return speedSite !== undefined;
}

(() => {
    const argv = minimist(process.argv.slice(2));

    const speedSite = argv.speedSite;

    if (areArgsValid(speedSite)) {
        createFolderAndLaunch(speedSite);

    } else {
        console.log(argumentsOutput);
    }
})();
