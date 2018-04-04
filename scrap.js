(async() => {
	console.log(await page.$$eval('a[href*="allactivity/delete"]', a => a.href));
})();



var res = page.evaluate(() => {
  var links = [];
  const elements = document.querySelectorAll('a[href*="allactivity/delete"]');

  for (const el of elements) {
      links.push(el.href);
  }
  return links;
});
