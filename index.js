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

  await page.goto('https://mbasic.facebook.com/');
  await page.$eval('input[id=m_login_email]', (el, user) => el.value = user, answers.username);
  await page.$eval('input[name=pass]', ((el, pass) => el.value = pass), answers.password);
  await page.$eval('input[name=login]', button => button.click());
  await page.goto('https://mbasic.facebook.com/');

  await next(answers.categories, answers.year);
}

async function next(categories, year) {
  await followLinkByContent('Profile');
  await followLinkByContent('Activity Log');
  await followLinkByContent('Filter');

  for (let i in categories) {
    console.log("Deleting category " + categories[i] + " for year " + year);
    await followLinkByContent(categories[i]);
    await followLinkByContent(year);
    await deleteYear(year);
    await followLinkByContent(categories[i]);
  }

  await page.close()
}

async function deletePosts() {
  // get all "allactivity/delete" and "allactivity/removecontent" links on page
  var deleteLinks = await page.evaluate(() => {
    var links = [];
    const deleteElements = document.querySelectorAll('a[href*="allactivity/delete"]');
    const removeElements = document.querySelectorAll('a[href*="allactivity/removecontent"]');
    for (const el of deleteElements) {
        links.push(el.href);
    }
    for (const el of removeElements) {
        links.push(el.href);
    }
    return links;
  });
  // visit them all to delete content
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
  return monthLinks
}

async function followLinkByContent(content) {
  var link = await page.evaluate((text) => {
    const aTags = document.querySelectorAll('a');
    for (let aTag of aTags) {
      if (aTag.innerText === text) {
        return aTag.href;
      }
    }
  }, content);
  await page.goto(link);
}

async function deleteYear(year) {
  var monLinks = await getMonthLinks(year);
  for (let mon in monLinks) {
    console.log("Deleting month: ", monLinks[mon]);
    await page.goto(monLinks[mon]);
    await deletePosts();
  }
}

main();
