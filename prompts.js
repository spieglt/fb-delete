'use strict';
const inquirer = require('inquirer');

const { EMAIL, PASSWORD } = process.env

const currentYear = (new Date()).getFullYear();
const years = [];
for (let i = 2004; i <= currentYear; i++) {
  years.push(i.toString());
}
years.reverse();

const categories = ["Posts",
  "Posts You're Tagged In",
  "Photos and Videos",
  "Photos You're Tagged In",
  "Others' Posts To Your Timeline",
  "Hidden From Timeline",
  "Likes and Reactions",
  "Comments",
  "Profile",
  "Added Friends",
  "Life Events",
  "Songs You've Listened To",
  "Articles You've Read",
  "Movies and TV",
  "Games",
  "Books",
  "Products You Wanted",
  "Notes",
  "Videos You've Watched",
  "Following",
  "Groups",
  "Events",
  "Polls",
  "Search History",
  "Saved",
  "Apps"];

const questions = [
    {
      type: 'input',
      name: 'username',
      message: 'Please enter your Facebook username (email address):'
    },
    {
      type: 'password',
      message: 'Please enter your Facebook password:',
      name: 'password',
      mask: '*'
    },
    {
      type: 'checkbox',
      name: 'categories',
      message: 'Select the categories you\'d like to delete:',
      paginated: false,
      choices: categories
    },
    {
      type: 'checkbox',
      name: 'years',
      message: "Select the years you\'d like to delete:",
      paginated: false,
      choices: years
    }
];

if (EMAIL) questions.shift()
if (PASSWORD) questions.shift()

async function prompt() {
  const answers = await inquirer.prompt(questions)
  return answers
}

module.exports = prompt;
