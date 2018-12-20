Heavily modified fork of https://github.com/spieglt/fb-delete.  Credit goes to spieglt for the code base. The read me below is his work.  I haven't had a chance to re do it for the GUI updates. :)



# Inspiration
- http://www.jaruzel.com/blog/How-I-Erased-5000-Facebook-Comments-and-Likes
- Desire to use Facebook for keeping in touch with distant friends and family despite their numerous failures to protect/respect users' data and privacy
- Displeasure at their interface's lack of batch-deletion, and not wanting to click "Delete" thousands of times

# Description
First: backup your Facebook data: https://www.facebook.com/help/131112897028467 (recommended, just in case)

Then: You will be prompted for your username, password, the categories of content you'd like to delete, and the year you'd like to delete. A Chrome window will then open to the basic mobile version of Facebook, log you in, navigate to your Activity Log, and start deleting by category and year. You may have to run multiple times to get everything.

None of your data (username, password, or anything else) is sent to me or anywhere other than Facebook's servers. It does not install a browser plugin. This is your computer talking to facebook.com by way of a Node script/Puppeteer. Puppeteer is a Node package developed by Google's Chrome team and allows you to drive a Chrome window programmatically.

**SEE WARNINGS IN DISCLAIMER SECTION BELOW**

# Setup and Use
- Install Node.js/NPM: https://nodejs.org/en/download/
- Download or clone this repo (then unzip to a folder if downloading: https://github.com/spieglt/fb-delete/archive/master.zip)
- Open your terminal or command prompt or Powershell and navigate to the fb-delete folder
- Run `npm install` to install dependencies, wait for it to finish
- Run `node ./index.js`, follow the prompts\*, then watch the magic happen
- Close windows if it gets stuck, feel free to run again

\*At the category prompt, use the space bar to select/deselect categories, the up and down arrows to move between them, and the Enter key to proceed. 
`a` selects all categories (DANGEROUS! WILL UNFRIEND PEOPLE, DELETE PHOTOS, ETC.), and `i` inverts the current selection. Same goes for years selection.
Navigate to your Activity Log on facebook.com as you normally would, click "Filters", and select a category if you'd like to see the kind of content that will be deleted.

# Planned features
- Output log file
- Error handling

Also strongly recommended: https://blog.mozilla.org/firefox/facebook-container-extension/

# Disclaimer 
I accept no responsibility if this program deletes anything you don't want deleted! If this is a concern, do not use this program! All deletions are final!

**IF YOU SELECT THE CATEGORY "Added Friends" FOR 2017, IT WILL UNFRIEND EVERY PERSON YOU BECAME FRIENDS WITH IN 2017!**

**IF YOU SELECT THE CATEGORY "Photos and Videos" FOR 2008, IT WILL DELETE EVERY PHOTO YOU UPLOADED IN 2008! BEWARE!**

This is all still probably pretty flaky. It works on my machine, but please leave feedback in Issues on Github if it doesn't work for you and I'll try to help if I can. Thanks for your interest and please check out https://github.com/spieglt/flyingcarpet!
