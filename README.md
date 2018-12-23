Heavily modified fork of https://github.com/spieglt/fb-delete.  Credit goes to spieglt for the code base. Please visit his repo and give him some love! 

# Description

GUI wrapper around a modified version of spieglt's code.  Punch in your username and password, select categories of data you want to delete, along with the years and months, and let the scripts clean up your awkward posts from your college years! :)

**Don't forget to back up your FB first! https://www.facebook.com/help/131112897028467 **

As with spieglt's original code, none of your data (username, password, or anything else) is sent to me or anywhere other than Facebook's servers. It does not install a browser plugin. This is your computer talking to facebook.com by way of a Node script/Puppeteer. Puppeteer is a Node package developed by Google's Chrome team and allows you to drive a Chrome window programmatically.

If you like what you see, consider some support! I enjoy making these in my free time, and a few bucks here and there always helps! buymeacoff.ee/1YHBCu3Fq

# Setting up

MacOS/Linux

If you don't want to bother with the source code, download one of the binaries in the release section here: https://github.com/alexjyong/FaceSpace-Cleaner/releases.

Download https://github.com/alexjyong/FaceSpace-Cleaner/releases/download/0.1.0/FaceSpace-Cleaner-darwin-x64.zip if you are using a Mac, or https://github.com/alexjyong/FaceSpace-Cleaner/releases/download/0.1.0/FaceSpace-Cleaner-linux-x64.zip If you are on Linux.

If you rather build from source, or you are on Windows, do this instead:

* Install Node.js/NPM: https://nodejs.org/en/download/
* Download the Source code from the https://github.com/alexjyong/FaceSpace-Cleaner/releases link.
* Open up a command prompt, Run `npm install` to install dependencies, and wait for it to finish.
* Then run `npm start`.



# Inspiration
- http://www.jaruzel.com/blog/How-I-Erased-5000-Facebook-Comments-and-Likes
- Desire to use Facebook for keeping in touch with distant friends and family despite their numerous failures to protect/respect users' data and privacy
- Displeasure at their interface's lack of batch-deletion, and not wanting to click "Delete" thousands of times

# Description
First: backup your Facebook data: https://www.facebook.com/help/131112897028467 (recommended, just in case)

Then: You will be prompted for your username, password, the categories of content you'd like to delete, and the year you'd like to delete. A Chrome window will then open to the basic mobile version of Facebook, log you in, navigate to your Activity Log, and start deleting by category and year. You may have to run multiple times to get everything.

None of your data (username, password, or anything else) is sent to me or anywhere other than Facebook's servers. It does not install a browser plugin. This is your computer talking to facebook.com by way of a Node script/Puppeteer. Puppeteer is a Node package developed by Google's Chrome team and allows you to drive a Chrome window programmatically.


# Disclaimer 
I accept no responsiblity if this program mucks up your FB or deletes anything you rather keep.  If you are worried about that, I recommend not using this program. :)

Also remember, nothing is truly gone from the internet. That being said, it does help to clean up your FB once in awhile. :)

**IF YOU SELECT THE CATEGORY "Added Friends" FOR 2017, IT WILL UNFRIEND EVERY PERSON YOU BECAME FRIENDS WITH IN 2017!**

**IF YOU SELECT THE CATEGORY "Photos and Videos" FOR 2008, IT WILL DELETE EVERY PHOTO YOU UPLOADED IN 2008! BEWARE!**
