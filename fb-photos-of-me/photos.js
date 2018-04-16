'use strict';

const puppeteer = require('puppeteer');
const prompts = require('./prompts');
var page;

async function main() {

  let answers = await prompts();

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100
  });
  page = await browser.newPage();

  await page.goto('https://facebook.com/');

  await page.$eval('input[id=email]', (el, user) => el.value = user, answers.username);
  await page.$eval('input[id=pass]', ((el, pass) => el.value = pass), answers.password);
  await page.$eval('input[value="Log In"]', button => button.click());
  await goToPhotos();

  await scrollThroughPhotos(answers.direction);
}

async function goToPhotos() {
  await page.goto('https://facebook.com/profile');
  let profile = await page.evaluate(() => {
    return window.location.pathname;
  });
  await page.goto('https://facebook.com' + profile + '/photos_of');
  await page.$eval('div.tagWrapper', tile => tile.click());
}

async function doAfter(milliseconds, func) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        func();
        resolve();
      } catch(err) {
        reject(err);
      }
    }, milliseconds);
  });
}

async function getUrl() {
  var url = await page.evaluate(() => {
    return window.location.href;
  })
  return url;
}

async function clickPrevButton() {
await page.evaluate(() => {
    document.querySelector('a.snowliftPager.prev').click();
  });
}

async function clickNextButton() {
await page.evaluate(() => {
    document.querySelector('a.snowliftPager.next').click();
  });
}

async function clickOptionsButton() {
  await page.evaluate(() => {
    document.querySelector('a[data-action-type="open_options_flyout"]').click();
  });
}

async function clickDownloadButton() {
  await page.evaluate(() => {
    var list = document.querySelectorAll('a[data-action-type="download_photo"]')
    list[list.length - 1].click();
  });
}

async function scrollThroughPhotos(direction) {
  // get initial photo url
  var initialUrl = await getUrl();
  console.log(initialUrl);
  for (let i = 0; true; i++) {
    // try catch for video links
    try {
      await page.hover('div.stageWrapper');
      if (direction === 'forward') {
        await doAfter(250, clickNextButton)
      }
      if (direction === 'backward') {
        await doAfter(250, clickPrevButton)
      }
      await doAfter(750, clickOptionsButton)
      await doAfter(250, clickDownloadButton)
    } catch(err) {
      console.log(err);
    }
    let currentUrl = await getUrl();
    if (i > 5 && currentUrl === initialUrl) {
      break
    }
    if (i % 100 == 0) {
      console.log(`downloaded ${i} photos`);
    }
  }
  await page.close()
  console.log("Done!");
  process.exit();
}

main();
