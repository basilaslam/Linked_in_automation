// import puppeteer from 'puppeteer'
// import * as cheerio from 'cheerio';
// import env from 'dotenv'
// env.config()
// import path from 'path';

// import https from 'https'

// import fs from'fs';


// (async () => {
// 	const __dirname = path.dirname('index.js');
// 	const userDataDir = path.join(__dirname, 'user_data_dir');

// 	const Email = process.env.EMAIL_ID
// 	const Password = process.env.PASSWORD
// 		// Do something here after each navigation
	  
	

// 	const url = 'https://www.linkedin.com/uas/login'

//   const browser = await puppeteer.launch({
//     userDataDir,
//   headless: false,
//   defaultViewport: { width: 1920, height: 1080 }
//   }
//   );



//   const page = await browser.newPage();
//   await page.goto(url);
//   let html = await page.content();

//   let curr_url = page.url()

//   let $ = cheerio.load(html)


//   if(curr_url !== 'https://www.linkedin.com/feed/'){
// 	await  page.type('#username', Email)
// 	await page.type('#password', Password)
// 	const navigationPromise = page.waitForNavigation();
// 	await page.click('#organic-div > form > div.login__form_action_container > button')
// 	await navigationPromise;
//   }

// 	html = await page.content();
// 	$ = cheerio.load(html);


// 	 await page.waitForSelector('#global-nav-typeahead > input',{ timeout: 30000 })

// 	 await page.type('#global-nav-typeahead > input', 'Nodejs Mern Developer')

// 	 const navigationPromise = page.waitForNavigation();
// 	 await page.keyboard.press('Enter')
// 	 await navigationPromise;

// 	 await page.waitForSelector('#search-reusables__filters-bar > ul > li:nth-child(4) > button')
//   		console.log('got it')
// 	await page.click('#search-reusables__filters-bar > ul > li:nth-child(4) > button')

// 	 setTimeout(()=>{

// 	},10000)
// 	await page.waitForSelector('#search-reusables__filters-bar > ul > li:nth-child(6) > div > button')
// 	await page.click('#search-reusables__filters-bar > ul > li:nth-child(6) > div > button')

// 	await page.waitForSelector('#main > div > section.scaffold-layout__detail.overflow-x-hidden.jobs-search__job-details > div > div.job-view-layout.jobs-details > div:nth-child(1) > div > div:nth-child(1) > div > div.relative > div.jobs-unified-top-card__content--two-pane > div:nth-child(4) > div > div > div > button')
// 	await page.click('#main > div > section.scaffold-layout__detail.overflow-x-hidden.jobs-search__job-details > div > div.job-view-layout.jobs-details > div:nth-child(1) > div > div:nth-child(1) > div > div.relative > div.jobs-unified-top-card__content--two-pane > div:nth-child(4) > div > div > div > button')

// 	await page.type('#single-line-text-form-component-formElement-urn-li-jobs-applyformcommon-easyApplyFormElement-3488421295-82648499-phoneNumber-nationalNumber', process.env.MOBILE)

	


	 
	
// })();


const puppeteer = require("puppeteer");
 require('dotenv').config()
 const path = require('path');
 const cheerio =  require('cheerio');

const BaseURL = process.env.baseURL;
const email = process.env.email;
const password = process.env.password;
const keyword = process.env.keyword;
const location = process.env.location;
var avgOfExp = process.env.AvgExperience;
const periodOfTime = process.env.Period; // you can choose : Last 24 hours or Last week
const browserPath = process.env.ChromePath;
const resolution = process.env.resolution; // you can choose : --start-maximized or --window-size=1400,720
const numberOfPagination = process.env.numberOfPagination; // numberOfPagination it means number of execution
const nbrOfOffersPerPage = process.env.numberOfOffersPerPage; // don't touch it leave it like this !!
const userDataDir = path.join(__dirname, 'user_data_dir');

let page = "";
let browser = "";
let html;
let $;
async function logs() {
  console.log("mydata is :" + JSON.stringify('.env'));
}
async function Login() {
  await findTargetAndType('[name="session_key"]', email);
  await findTargetAndType('[name="session_password"]', password);
  page.keyboard.press("Enter");
}
async function initiliazer() {
  browser = await puppeteer.launch({
    headless: false,
    executablePath: browserPath,
    args: [resolution],
    defaultViewport: null,
	userDataDir
    //userDataDir: "./userData",
    //uncomment userDataDir line  if you want to store your session and remove login() from main()
    // and change the baseURL to https://www.linkedin.com/feed

  });
  page = await browser.newPage();
  const pages = await browser.pages();
  if (pages.length > 1) {
    await pages[0].close();
  }
  await page.goto(BaseURL);
  html = await page.content();
  $ = cheerio.load(html)
}
async function findTargetAndType(target, value) {
  const f = await page.$(target);
  await f.type(value);
}
async function waitForSelectorAndType(target, value) {
  const typer = await page.waitForSelector(target, { visible: true });
  await typer.type(value);
}
async function buttonClick(selector) {
  await page.waitForSelector(selector);
  const buttonClick = await page.$(selector);
  await buttonClick.click();
}
async function jobCriteriaByTime() {
	await page.waitForSelector("#search-reusables__filters-bar > ul > li:nth-child(6) > div > button")
  await buttonClick("#search-reusables__filters-bar > ul > li:nth-child(6) > div > button"); // select EASY APPLY
  await page.waitForTimeout(2000);
  // dropmenu to chose the period
  await buttonClick(
    "ul.search-reusables__filter-list>li:nth-child(4)>div>span>button"
  );
  if (periodOfTime == "Past 24 hours") {
    await page.waitForTimeout(2000);
    await buttonClick(
      "form > fieldset > div.pl4.pr6 > ul > li:nth-child(4) > label"
    );
    await page.waitForTimeout(2000);
    await buttonClick(".render-mode-BIGPIPE");
  } else {
    // Past week
    await page.waitForTimeout(2000);
    await buttonClick(
      "form > fieldset > div.pl4.pr6 > ul > li:nth-child(3) > label"
    );
    await page.waitForTimeout(2000);
    await buttonClick(".render-mode-BIGPIPE");
  }
}
async function jobCriteriaByType() {
  // dropmenu to chose the Hyprid/onSite/Remote type of Work
  await buttonClick(
    'div[id="hoverable-outlet-on-site/remote-filter-value"]+span>button'
  );
  await page.waitForTimeout(2000);
  await buttonClick("label[for^='workplaceType']");
  await page.waitForTimeout(2000);
  await buttonClick(".render-mode-BIGPIPE");
  await page.waitForTimeout(2000);
}
async function Scrolling() {
  await page.evaluate(() => {
    document
      .querySelector(
        'div[class="scaffold-layout__list-detail-inner"]>section>div>ul'
      )
      .scrollIntoView();
  });
}
function changeValue(input, value) {
  var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  ).set;
  nativeInputValueSetter.call(input, value);
  var inputEvent = new Event("input", { bubbles: true });
  input.dispatchEvent(inputEvent);
}
async function FillAndApply() {
  let i = 1;
  let lastIndexForPagination = 1;
  while (i <= numberOfPagination) {
    console.log("Scrolling the page N°" + i);
    //Loop trough list elements
    for (let index = 1; index <= nbrOfOffersPerPage; index++) {
      let state = true;
      await page.waitForTimeout(3000);
      await Scrolling();
      console.log(`Apply N°[${index}]`);
      await buttonClick(
        `li[class*="jobs-search-results__list-item"]:nth-child(${index})>div>div>div>div+div>div`
      );
      if (index === nbrOfOffersPerPage) lastIndexForPagination++;
      /* -------------------------- FIX THIS PART OF CODE ----------------------- */
      await page.waitForTimeout(2000);
      if ((await page.$("div:nth-child(4) > div > div > div>button")) != null) {
        // to find the EASY APPLY button
        await buttonClick("div:nth-child(4) > div > div > div>button");
        while (state == true) {
          await page.waitForTimeout(2000);
          if (
            // the next button
            await page.evaluate(() => {
              setTimeout(() => {}, 3000);
              document
                .querySelector(
                  'div[class="display-flex justify-flex-end ph5 pv4"]>button'
                )
                .click();
            })
          ) {
            state = true;
          } else {
            state = false;
            break;
          }
          await page.waitForTimeout(3000);
        }
        if (state == false) {
          // review button and submit button
          await page.waitForTimeout(3000);
          await buttonClick(
            'div[class="display-flex justify-flex-end ph5 pv4"]>button + button'
          );
          await page.waitForTimeout(3000);
          /* -------------------------------------------------------------------------- */
          /*                              find empty inputs                             */
          if (
            (await page.$(
              'input[class="ember-text-field ember-view fb-single-line-text__input"]'
            )) != null
          ) {
            await page.evaluate(() => {
              const divElem = document.querySelector("div.pb4");
              const inputElements = divElem.querySelectorAll("input");
              console.log(inputElements);
              let value = 3;
              var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                "value"
              ).set;
              for (let index = 0; index < inputElements.length; index++) {
                setTimeout(() => {}, 2000);
                nativeInputValueSetter.call(inputElements[index], value);
                var inputEvent = new Event("input", { bubbles: true });
                inputElements[index].dispatchEvent(inputEvent);
              }
            });
          }
          /* -------------------------------------------------------------------------- */
          let i = 0;
          do {
            await page.waitForTimeout(4000);
            if (
              !(await page.$(
                'div[class*="artdeco-modal-overlay"]>div>div+div+div>button>span'
              ))
            ) {
              i++;
              console.log(i);
              await page.evaluate(() => {
                setTimeout(() => {}, 3000);
                document
                  .querySelector(
                    'div[class="display-flex justify-flex-end ph5 pv4"]>button + button'
                  )
                  .click();
              });
            } else i=-2;
          } while (i>=0);
          console.log("finally close button");
          await page.waitForTimeout(4000);
          await page.evaluate(() => {
            setTimeout(() => {}, 3000);
            document
              .querySelector(
                'div[class*="artdeco-modal-overlay"]>div>div+div+div>button>span'
              )
              .click();
          });
        }
      }
      /* ------------------------------------------------------------ */
    }
    // To click on the next page
    await buttonClick(
      `ul[class="artdeco-pagination__pages artdeco-pagination__pages--number"]>li:nth-child(${lastIndexForPagination})`
    );
    i++;
    console.log("finished Scrolling page N°" + (i - 1));
  }
}




async function set_ground(){
	
	 await page.waitForSelector('#global-nav-typeahead > input',{ timeout: 30000 })

	 await page.type('#global-nav-typeahead > input', 'Nodejs Mern Developer')

	 const navigationPromise = page.waitForNavigation();
	 await page.keyboard.press('Enter')
	 await navigationPromise;

	 await page.waitForSelector('#search-reusables__filters-bar > ul > li:nth-child(4) > button')
  		console.log('got it')
	await page.click('#search-reusables__filters-bar > ul > li:nth-child(4) > button')

	 setTimeout(()=>{

	},10000)
	await page.waitForSelector('#search-reusables__filters-bar > ul > li:nth-child(6) > div > button')
	await page.click('#search-reusables__filters-bar > ul > li:nth-child(6) > div > button')

	await page.waitForSelector('#main > div > section.scaffold-layout__detail.overflow-x-hidden.jobs-search__job-details > div > div.job-view-layout.jobs-details > div:nth-child(1) > div > div:nth-child(1) > div > div.relative > div.jobs-unified-top-card__content--two-pane > div:nth-child(4) > div > div > div > button')
	await page.click('#main > div > section.scaffold-layout__detail.overflow-x-hidden.jobs-search__job-details > div > div.job-view-layout.jobs-details > div:nth-child(1) > div > div:nth-child(1) > div > div.relative > div.jobs-unified-top-card__content--two-pane > div:nth-child(4) > div > div > div > button')

	// await page.type('#single-line-text-form-component-formElement-urn-li-jobs-applyformcommon-easyApplyFormElement-3488421295-82648499-phoneNumber-nationalNumber', process.env.MOBILE)

}


async function findAndApply(){
	html = await page.content();
	$ = cheerio.load(html)

	await page.waitForSelector('.scaffold-layout__list-container')
	console.log('got jobs')
	const totalJobsLength = $('.scaffold-layout__list-container > li').length;
	const totalJobs = $('.scaffold-layout__list-container > li');
	const liElements = await page.$$('.scaffold-layout__list-container  li');


console.log(liElements);

	for(i = 0; i < liElements.length; i++){
		const li = liElements[i];
    
    // Click on the <li> element
    await li.click();
	
	}
}
async function jobsApply() {
//   await buttonClick("#global-nav > div > nav > ul > li:nth-child(3)");
//   await waitForSelectorAndType('[id^="jobs-search-box-keyword-id"]', keyword);
//   await waitForSelectorAndType('[id^="jobs-search-box-location-id"]', location);
//   await page.waitForTimeout(1000);
//   await page.keyboard.press("Enter");
//   await jobCriteriaByTime();
//   await page.waitForTimeout(3000);
//   await jobCriteriaByType();
//   await page.waitForTimeout(2000);
await set_ground()
  // to hide messages dialog
  await page.waitForTimeout(5000);
//   await FillAndApply();
await findAndApply()
}
async function main() {
  logs();
  await initiliazer();
//    await Login();
  await jobsApply();
//   await browser.close();
}
main();