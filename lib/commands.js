async function findAvailableSeances(page) {
  try {
    let times = await page.$$(".movie-seances__time");

    const btnNextDay = await page.$("a.page-nav__day_chosen + .page-nav__day");
    if (!btnNextDay) {
      throw new Error("Кнопка смены дня не найдена");
    }
    await btnNextDay.click();
    await page.waitForTimeout(1000);
    times = await page.$$(".movie-seances__time");

    if (times.length === 0) {
      throw new Error("Нет доступных сеансов в другой день");
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
