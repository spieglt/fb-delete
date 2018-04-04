
'use strict';

const puppeteer = require('puppeteer');

var page;
var ubox;
var deleteUrls;
var removeUrl;

(async() => {
  const browser = await puppeteer.launch({
    headless: false, 
    slowMo: 250
  });
  page = await browser.newPage();

  await page.goto('https://mbasic.facebook.com/');
  await page.type('#m_login_email', '');
  await page.$eval('input[name=pass]', el => el.value = '');
  await page.$eval('input[name=login', button => button.click());
  await page.$eval('input[value=OK]', button => button.click());
  await page.goto(year_2008);

  var deleteLinks = await page.evaluate(() => {
    var links = [];
    const elements = document.querySelectorAll('a[href*="allactivity/delete"]');

    for (const el of elements) {
        links.push(el.href);
    }
    return links;
  });
  var removeLinks = await page.evaluate(() => {
    var links = [];
    const elements = document.querySelectorAll('a[href*="allactivity/removecontent"]');

    for (const el of elements) {
        links.push(el.href);
    }
    return links;
  });

  console.log(deleteLinks, removeLinks)


})();

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
      // innerTexts.push(el.innerText);
      for (let i = 0; i < months.length; i++) {
        if (months[i] + " " + year == el.innerText) {
          links.push(el.href);
        }
      }
    }
    return links;
  }, year);
  console.log(monthLinks);
  return monthLinks
}

async function deleteYear(year) {
  var monLinks = await getMonthLinks(year);
  for (mon in monLinks) {
    await page.goto(monLinks[mon]);
    await deletePosts();
  }
}
