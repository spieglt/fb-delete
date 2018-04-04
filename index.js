'use strict';

require('dotenv').config();
const puppeteer = require('puppeteer');

var page;
var ubox;
var deleteUrls;
var removeUrl;

var year = '2008';

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100
  });
  page = await browser.newPage();

  await page.goto('https://mbasic.facebook.com/');
  await page.type('#m_login_email', process.env.FB_USERNAME);
  await page.$eval('input[name=pass]', ((el, pass) => el.value = pass), process.env.FB_PASSWORD);
  await page.$eval('input[name=login]', button => button.click());
  await page.$eval('input[value=OK]', button => button.click());

  await next();
}

async function next() {
  await followLinkByContent('Profile');
  await followLinkByContent('Activity Log');
  await followLinkByContent('Filter');
  await followLinkByContent('Posts');
  await followLinkByContent(year);
  await deleteYear(year);
}

async function deletePosts() {

  var deleteLinks = await page.evaluate(() => {
    var links = [];
    const elements = document.querySelectorAll('a[href*="allactivity/delete"]');

    for (const el of elements) {
        links.push(el.href);
    }
    return links;
  });

  for (let i = 0; i < deleteLinks.length; i++) {
      await page.goto(deleteLinks[i]);
  }

}


async function getMonthLinks(year) {
  var monthLinks = await page.evaluate((year) => {
    var months = ["January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"]
    var links = [];
    const elements = document.querySelectorAll('a');
    for (let el of elements) {
      for (let i = 0; i < months.length; i++) {
        if (months[i] + " " + year === el.innerText) {
          links.push(el.href);
        }
      }
    }
    return links;
  }, year);
  console.log(monthLinks);
  return monthLinks
}

async function followLinkByContent(content) {
  var link = await page.evaluate((text) => {
    const aTags = document.querySelectorAll('a');
    for (let aTag of aTags) {
      if (aTag.innerText === text) {
        console.log(aTag.href);
        return aTag.href;
      }
    }
  }, content);
  await page.goto(link);
}

async function deleteYear(year) {
  var monLinks = await getMonthLinks(year);
  for (mon in monLinks) {
    await page.goto(monLinks[mon]);
    await deletePosts();
  }
}

main();
