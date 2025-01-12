async function findAvailableSeances(page) {
  try {
    let times = await page.$$(".movie-seances__time");

    

    while (times.length === 0) {

      // await page.$$eval("a.page-nav__day :not(. page-nav__day_chosen)", (buttons) => {
      //   if (buttons.length > 0) {         
      //     buttons[0].click();
      //   } else {
      //     throw new Error("Кнопка следующего дня не найдена");
      //   }
      // });
          
      const btnNextDay = await page.$(
        'a.page-nav__day :not(. page-nav__day_chosen)'
      );
      if (!btnNextDay) {
        throw new Error("Кнопка следующего дня не найдена.");
      }

      await btnNextDay.click();
      await page.waitForTimeout(3000);

      times = await page.$$(".movie-seances__time");
    }
    if (times.length === 0) {
      throw new Error("Нет доступных сеансов для бронирования");
    }

    for (let i = 0; i < times.length; i++) {
      const timeElement = times[i];
      const unavailable = await timeElement.evaluate((el) =>
        el.classList.contains(".movie-seances__time acceptin-button-disabled")
      );
      if (!unavailable) {
        await timeElement.click();
        break; // Проходим циклом и находим первый доступный сеанс
      }
    }
  } catch (error) {
    console.error("Ошибка в findAvailableSeances:", error.message);
    throw error;
  }
}

module.exports = {
  findAvailableSeances,
};
