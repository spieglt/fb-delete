"use strict";

const puppeteer = require("puppeteer");
const {TimeoutError} = require('puppeteer/Errors');
const p = require("./prompts");
var page;

const { EMAIL, PASSWORD } = process.env;
const DELAY = 500; // half a second

async function main() {
  let answers = await p.prompt();
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
  });
  page = await browser.newPage();

  await page.goto("https://mbasic.facebook.com/");
  try {
    const allResultsSelector = 'button[name="accept_only_essential"]';
    await page.waitForSelector(allResultsSelector,  {timeout: 5000});
    await page.click(allResultsSelector);
  } catch (e) {
    if (e instanceof TimeoutError) {
      // do nothing
    } else {
        throw e;
    }
  }
  await page.$eval(
    "input[id=m_login_email]",
    (el, user) => (el.value = user),
    EMAIL || answers.username
  );
  await page.$eval(
    "input[name=pass]",
    (el, pass) => (el.value = pass),
    PASSWORD || answers.password
  );
  await page.$eval("input[name=login]", (button) => button.click());
  await page.goto("https://mbasic.facebook.com/", {
    waitUntil: "load",
    timeout: 0,
  });

  await next(answers.categories, answers.years);
}

async function next(categories, years) {
  await page.goto("https://mbasic.facebook.com/allactivity", {
    waitUntil: "load",
    timeout: 0,
  });
  await followLinkByContent("Filter");

  for (let i in categories) {
    console.log("Deleting category " + categories[i]);
    await followLinkByContent(categories[i]);
    for (let j in years) {
      console.log("In year " + years[j]);
      try {
        if (years[j] != p.currentYear) {
          await followLinkByContent(years[j]);
        }
        await deleteYear(years[j]);
      } catch (e) {
        console.log(`Year ${years[j]} not found.`, e);
      }
    }
    await followLinkByContent(categories[i]);
  }

  await page.close();
  console.log("Done!");
  process.exit();
}

async function deletePosts() {
  // get all "allactivity/delete" and "allactivity/removecontent" links on page
  var deleteLinks = await page.evaluate(() => {
    var links = [];
    const deleteElements = document.querySelectorAll(
      'a[href*="allactivity/delete"]'
    );
    const removeElements = document.querySelectorAll(
      'a[href*="allactivity/removecontent"]'
    );
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
    // wait between clicks
    await new Promise(r => setTimeout(r, DELAY));
    await page.goto(deleteLinks[i], { waitUntil: "load", timeout: 0 });
  }
}

async function deletePostsWithConfirm() {
  // get all "allactivity/delete" and "allactivity/removecontent" links on page
  var deleteLinks = await page.evaluate(() => {
    var links = [];
    const unfriendElements = document.querySelectorAll(
      'a[href*="activity_log/confirm_dialog"]'
    );
    for (const el of unfriendElements) {
      links.push(el.href);
    }
    return links;
  });
  // visit them all to delete content
  for (let i = 0; i < deleteLinks.length; i++) {
    // wait between clicks
    await new Promise(r => setTimeout(r, DELAY));
    await page.goto(deleteLinks[i], { waitUntil: "load", timeout: 0 });
    await deletePosts();
  }
}

async function getMonthLinks(year) {
  var monthLinks = await page.evaluate((year) => {
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    var links = [];
    const elements = document.querySelectorAll("a");
    for (let el of elements) {
      if ("This Month" === el.innerText) {
        links.push(el.href);
      }
      for (let i = 0; i < months.length; i++) {
        if (months[i] + " " + year === el.innerText) {
          links.push(el.href);
        }
      }
    }
    return links;
  }, year);
  return monthLinks;
}

async function followLinkByContent(content) {
  var link = await page.evaluate((text) => {
    const aTags = document.querySelectorAll("a");
    for (let aTag of aTags) {
      if (aTag.innerText === text) {
        return aTag.href;
      }
    }
  }, content);

  if (link != undefined) {
    await page.goto(link, { waitUntil: "load", timeout: 0 });
  }
}

async function deleteYear(year) {
  var monLinks = await getMonthLinks(year);
  for (let mon in monLinks) {
    // console.log("Deleting month: ", monLinks[mon]);
    await page.goto(monLinks[mon], { waitUntil: "load", timeout: 0 });
    await deletePosts();
    await deletePostsWithConfirm();
  }
}

main();
