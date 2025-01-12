const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After } = require("@cucumber/cucumber");
const { findAvailableSeances } = require("../../lib/commands.js");

let browser;
let page;

Given("user open the cinema website", async () => {
  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
  await page.goto("https://qamid.tmweb.ru/client/index.php");
});

When("user select the first available seances", async () => {
  await findAvailableSeances(page);
});

When("user book a single ticket", async () => {
  await page.waitForSelector(
    "span.buying-scheme__chair.buying-scheme__chair_standart:not(.buying-scheme__chair_taken):not(.buying-scheme__chair_selected)"
  );
  await page.click(
    "span.buying-scheme__chair.buying-scheme__chair_standart:not(.buying-scheme__chair_taken):not(.buying-scheme__chair_selected)"
  );
  await page.waitForSelector(".acceptin-button", { visible: true });
  await page.click(".acceptin-button");
});

Then(
  "user should see a confirmation with the text {string}",
  async (expectedText) => {
    await page.waitForSelector(".ticket__check-title", { visible: true });
    const titleText = await page.$eval(
      ".ticket__check-title",
      (el) => el.textContent
    );
    if (titleText !== expectedText) {
      throw new Error(
        `Ожидается "${expectedText}", но отображается "${titleText}"`
      );
    }
  }
);

When("no seances are available for today", async () => {
  try {
    const times = await page.$$(".movie-seances__time");
    if (times.length > 0) {
      throw new Error("Нет доступных сеансов сегодня");
    }
  } catch (error) {
    console.log("Ошибка: ", error.message);
  }
});

When("user navigate to the next day", async () => {
  const btnNextDay = await page.$("a.page-nav__day_chosen + .page-nav__day");
  if (!btnNextDay) {
    throw new Error("Кнопка смены дня не найдена");
  }
  await btnNextDay.click();
  await page.waitForTimeout(1000);
});

Then("user should see available sessions", async () => {
  const times = await page.$$(".movie-seances__time");
  if (times.length === 0) {
    throw new Error("Нет доступных сеансов");
  }
});

When("user book three tickets", async () => {
  await page.waitForSelector(
    ".buying-scheme__chair.buying-scheme__chair_standart"
  );
  const chairSelector =
    "span.buying-scheme__chair.buying-scheme__chair_standart:not(.buying-scheme__chair_taken):not(.buying-scheme__chair_selected)";
  for (let i = 0; i < 3; i++) {
    await page.click(chairSelector);
    await page.waitForTimeout(1000);
  }
  await page.waitForSelector(".acceptin-button", { visible: true });
  await page.click(".acceptin-button");
});
