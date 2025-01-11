const { findAvailableSeances } = require("./lib/commands.js");
let page;

beforeEach(async () => {
  page = await browser.newPage();
});

afterEach(async () => {
  await page.close();
});

describe("Ticket Booking Tests", () => {
  beforeEach(async () => {
    await page.goto("https://qamid.tmweb.ru/client/index.php");
  });

  test("Purchasing the first available seances", async () => {
    await findAvailableSeances(page);

    await page.waitForSelector(
      ".buying-scheme__chair.buying-scheme__chair_standart"
    );
    await page.click(
      "span.buying-scheme__chair.buying-scheme__chair_standart:not(.buying-scheme__chair_taken):not(.buying-scheme__chair_selected)"
    );
    await page.waitForSelector(".acceptin-button", { visible: true });
    await page.click(".acceptin-button");

    await page.waitForSelector(".ticket__check-title", { visible: true });
    const titleText = await page.$eval(
      ".ticket__check-title",
      (el) => el.textContent
    );
    expect(titleText).toEqual("Вы выбрали билеты:");
    await page.waitForSelector(".acceptin-button", { visible: true });
    await page.click(".acceptin-button");
    await page.waitForSelector("img.ticket__info-qr[src='i/QR_code.png']");
  }, 20000);

  test("Multiple ticket purchases", async () => {
    await findAvailableSeances(page);
    await page.waitForSelector(
      ".buying-scheme__chair.buying-scheme__chair_standart"
    );
    const freeChair =
      "span.buying-scheme__chair.buying-scheme__chair_standart:not(.buying-scheme__chair_taken):not(.buying-scheme__chair_selected)";
    if (freeChair.length < 3) {
      throw new Error("Недостаточно свободных мест");
    }

    for (let i = 0; i < 3; i++) {
      await page.click(freeChair);
      await page.waitForTimeout(1000); //цикл для бронирования 3 билетов
    }
    await page.waitForSelector(".acceptin-button", { visible: true });
    await page.click(".acceptin-button");

    await page.waitForSelector(".ticket__check-title", { visible: true });
    const titleText = await page.$eval(
      ".ticket__check-title",
      (el) => el.textContent
    );
    expect(titleText).toEqual("Вы выбрали билеты:");
    await page.waitForSelector(".acceptin-button", { visible: true });
    await page.click(".acceptin-button");
    await page.waitForSelector("img.ticket__info-qr[src='i/QR_code.png']");
  }, 20000);

  test("Sad path - No available seances", async () => {
    let times = await page.$$(".movie-seances__time");

    if (times.length === 0) {
      console.log("Переход на следующий день");
    }
    const btnNextDay = await page.$(".page-nav__day_chosen + .page-nav__day");
    if (!btnNextDay) {
      throw new Error("Кнопка смены дня не найдена");
    }
    await btnNextDay.click();
    await page.waitForTimeout(1000);
    times = await page.$$(".movie-seances__time");

    if (times.length === 0) {
      throw new Error("Нет доступных сеансов в другой день");
    }

    for (const timeElement of times) {
      const unavailable = await timeElement.evaluate((el) =>
        el.classList.contains("acceptin-button-disabled")
      );
      if (!unavailable) {
        await timeElement.click();
        return;
      }
    }

    throw new Error("Похоже в кино не идем")
  }, 20000);
});
