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

    //await next(answers.categories, answers.years, answers.months);
  await next(answers.categories, answers.years);
}

async function next(categories, years) {
  await followLinkByContent('Profile');
  await followLinkByContent('Activity Log');
  await followLinkByContent('Filter');

  for (let i in categories) {
    console.log("Deleting category " + categories[i]);
    await followLinkByContent(categories[i]);
    for (let j in years) {
      console.log("In year " + years[j]);
      try {
        await followLinkByContent(years[j]);
        await deleteYear(years[j]);
      } catch(e) {
        console.log(`Year ${years[j]} not found.`, e);
      }
    }
    await followLinkByContent(categories[i]);
  }

  await page.close();
  console.log("Done!");
  process.exit();
}

async function deletePosts(month, year) {
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
      for (let i = 0; i < deleteLinks.length; i++) {
        await page.goto(deleteLinks[i]);
      }

        //all links deleted.
        //see if we have a load more link

        //find the load more link
        var text = 'Load more from';
        var found_link = await page.evaluate((text) => {
            const strings = []
            const elements = document.querySelectorAll('a');
            for (let el of elements) {
                var innerText = el.innerText.trim();
                var regex = new RegExp( text, 'i' );
                strings.push({text: innerText, link: el.href});
                if (innerText.match(regex)) {
                    return el.href;
                }
              }
                return; //return nothing if nothing found.
      }, text);

    if (found_link) {
        await page.goto(found_link);
        await deletePosts(month, year);
    }
}


async function getMonthLinks(year) {
  var monthLinks = await page.evaluate((year) => {
    var months = ["January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"];
    var links = [];
    const elements = document.querySelectorAll('a');
    for (let el of elements) {
      for (let i = 0; i < months.length; i++) {
        if (months[i] + " " + year === el.innerText) {
            
          links.push({link: el.href, name: months[i]});
        }
      }
    }
    return links;
  }, year);
  return monthLinks;
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

async function confirmContent(content) {
  var link = await page.evaluate((text) => {
    const aTags = document.querySelectorAll('a');
    for (let aTag of aTags) {
      if (aTag.innerText === text) {
        return aTag.href;
      }
    }
    return undefined;
  }, content);
    return link;
}

async function deleteYear(year) {
  var monLinks = await getMonthLinks(year);

  for (let mon in monLinks) {
    console.log("Deleting month: ", monLinks[mon].name);
    await page.goto(monLinks[mon].link);
    await deletePosts(monLinks[mon].name, year);
  }
}

main();
