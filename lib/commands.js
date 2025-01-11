async function findAvailableSeances(page) {
  try {
    let times = await page.$$(".movie-seances__time");

    while (times.length === 0) {
      console.log(
        "Нет доступных сеансов для бронирования. Переходим на следующий день"
      );

      const btnNextDay = await page.$(".page-nav__day_chosen + .page-nav__day");
      if (!btnNextDay) {
        throw new Error("Кнопка следующего дня не обнаружена");
      }

      await btnNextDay.click();
      await page.waitForSelector(".movie-seances__time", { visible: true });
      times = await page.$$(".movie-seances__time");
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

    throw new Error("Нет доступных сеансов для бронирования");
  } catch (error) {
    console.error("Ошибка в findAvailableSeances:", error.message);
    throw error;
  }
}

module.exports = {
  findAvailableSeances,
};
