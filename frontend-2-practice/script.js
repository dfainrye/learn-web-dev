// ============================================================
// 1. ДАННЫЕ, КОТОРЫЕ ПРИХОДЯТ С СЕРВЕРА
// ============================================================

const now = new Date();

const SERVER_DATA = {
  today: {
    day: now.getDate(),
    month: now.getMonth(),
    year: now.getFullYear(),
  },
  slots: [
    { time: "10:00", available: true },
    { time: "11:00", available: false },
    { time: "12:00", available: true },
    { time: "13:00", available: false },
    { time: "14:00", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: true },
    { time: "17:00", available: true },
  ],
};

const SLOTS_EVEN_DAY = [
  { time: "10:00", available: true },
  { time: "11:00", available: true },
  { time: "12:00", available: false },
  { time: "13:00", available: true },
  { time: "14:00", available: false },
  { time: "15:00", available: true },
  { time: "16:00", available: true },
  { time: "17:00", available: true },
];

const SLOTS_ODD_DAY = [
  { time: "10:00", available: true },
  { time: "11:00", available: false },
  { time: "12:00", available: true },
  { time: "13:00", available: false },
  { time: "14:00", available: true },
  { time: "15:00", available: true },
  { time: "16:00", available: true },
  { time: "17:00", available: true },
];

// ============================================================
// 2. СОСТОЯНИЕ СТРАНИЦЫ
// ============================================================

const BOOKING_STATE = {
  currentMonth: SERVER_DATA.today.month,
  currentYear: SERVER_DATA.today.year,
  selectedDay: SERVER_DATA.today.day,
  selectedMonth: SERVER_DATA.today.month,
  selectedYear: SERVER_DATA.today.year,
  selectedTime: null,
};

// ============================================================
// 3. ЛОГИКА ДЛЯ ИМИТАЦИИ РАБОТЫ С СЕРВЕРОМ
// ============================================================

function getSlotsForDay(day, month, year) {
  const isEven = day % 2 === 0;
  const slots = isEven ? SLOTS_EVEN_DAY : SLOTS_ODD_DAY;
  return { day: day, month: month, year: year, slots: slots };
}

function saveSelectedDate(date, time) {
  const raw = localStorage.getItem("barber-booking");
  let booking = {};
  if (raw) {
    try {
      booking = JSON.parse(raw);
    } catch (e) {
      booking = {};
    }
  }
  booking.date = date;
  booking.time = time;
  localStorage.setItem("barber-booking", JSON.stringify(booking));
}

// ============================================================
// 4. ЧИСТЫЕ ФУНКЦИИ И КОНСТАНТЫ
// ============================================================

const MONTHS_NOMINATIVE = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const MONTHS_GENITIVE = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

const DAYS_OF_WEEK = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

function compareDates(date1, date2) {
  const d1 = new Date(date1.year, date1.month, date1.day);
  const d2 = new Date(date2.year, date2.month, date2.day);
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

function isDateSelectable(day, month, year) {
  const today = SERVER_DATA.today;
  return compareDates({ day: day, month: month, year: year }, today) >= 0;
}

function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const cells = [];

  for (let i = offset - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLastDay - i, otherMonth: true });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, otherMonth: false });
  }

  const totalCells = Math.ceil(cells.length / 7) * 7;
  let nextDay = 1;
  while (cells.length < totalCells) {
    cells.push({ day: nextDay, otherMonth: true });
    nextDay++;
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

// ============================================================
// 5. ОТРИСОВКА И ОБРАБОТЧИКИ
// ============================================================

function renderCalendar() {
  const monthTitleEl = document.querySelector(".date-card__month");
  const matrixEl = document.querySelector(".days-matrix");

  const year = BOOKING_STATE.currentYear;
  const month = BOOKING_STATE.currentMonth;

  monthTitleEl.textContent = MONTHS_NOMINATIVE[month] + " " + year;

  const weeks = buildCalendarGrid(year, month);
  const today = SERVER_DATA.today;

  let html = "";
  weeks.forEach(function (week) {
    week.forEach(function (cell) {
      if (cell.otherMonth) {
        html += '<span class="day-tile day-tile--muted">' + cell.day + "</span>";
        return;
      }

      const selectable = isDateSelectable(cell.day, month, year);
      const isToday =
        cell.day === today.day &&
        month === today.month &&
        year === today.year;
      const isSelected =
        cell.day === BOOKING_STATE.selectedDay &&
        month === BOOKING_STATE.selectedMonth &&
        year === BOOKING_STATE.selectedYear;

      let classes = "day-tile";
      if (!selectable) {
        classes += " day-tile--disabled";
      } else {
        classes += " day-tile--available";
      }
      if (isToday) classes += " day-tile--today";
      if (isSelected) classes += " day-tile--selected";

      if (!selectable) {
        html += '<span class="' + classes + '">' + cell.day + "</span>";
      } else {
        html +=
          '<button type="button" class="' +
          classes +
          '" data-day="' +
          cell.day +
          '">' +
          cell.day +
          "</button>";
      }
    });
  });

  matrixEl.innerHTML = html;

  const activeDayButtons = matrixEl.querySelectorAll(".day-tile--available");
  activeDayButtons.forEach(function (btn) {
    btn.addEventListener("click", onDayClick);
  });
}

function onDayClick(event) {
  const btn = event.currentTarget;
  const day = parseInt(btn.dataset.day, 10);

  BOOKING_STATE.selectedDay = day;
  BOOKING_STATE.selectedMonth = BOOKING_STATE.currentMonth;
  BOOKING_STATE.selectedYear = BOOKING_STATE.currentYear;
  BOOKING_STATE.selectedTime = null;

  const response = getSlotsForDay(
    day,
    BOOKING_STATE.currentMonth,
    BOOKING_STATE.currentYear
  );
  SERVER_DATA.slots = response.slots;

  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

function renderTimeSlots() {
  const slotsContainer = document.querySelector(".slots-matrix");
  const slots = SERVER_DATA.slots;

  if (!slots || slots.length === 0) {
    slotsContainer.innerHTML =
      '<div class="slots-empty">В этот день нет доступного времени</div>';
    return;
  }

  let html = "";
  slots.forEach(function (slot) {
    if (!slot.available) {
      html +=
        '<button type="button" class="slot-btn slot-btn--busy" disabled>' +
        '<span class="slot-btn__time">' +
        slot.time +
        "</span>" +
        '<span class="slot-btn__status">Занято</span>' +
        "</button>";
      return;
    }

    const isSelected = slot.time === BOOKING_STATE.selectedTime;
    const classes = isSelected ? "slot-btn slot-btn--selected" : "slot-btn";

    html +=
      '<button type="button" class="' +
      classes +
      '" data-time="' +
      slot.time +
      '">' +
      '<span class="slot-btn__time">' +
      slot.time +
      "</span>" +
      "</button>";
  });

  slotsContainer.innerHTML = html;

  const availableSlotButtons = slotsContainer.querySelectorAll(
    ".slot-btn:not(.slot-btn--busy)"
  );
  availableSlotButtons.forEach(function (btn) {
    btn.addEventListener("click", onTimeSlotClick);
  });
}

function onTimeSlotClick(event) {
  const btn = event.currentTarget;
  BOOKING_STATE.selectedTime = btn.dataset.time;

  renderTimeSlots();
  updateBottomBar();
}

function updateBottomBar() {
  const valueEl = document.querySelector(".action-bar__value");
  if (!valueEl) return;

  const day = BOOKING_STATE.selectedDay;
  const month = BOOKING_STATE.selectedMonth;
  const year = BOOKING_STATE.selectedYear;

  const dateObj = new Date(year, month, day);
  const dayName = DAYS_OF_WEEK[dateObj.getDay()];
  const monthName = MONTHS_GENITIVE[month];

  const timePart = BOOKING_STATE.selectedTime
    ? BOOKING_STATE.selectedTime
    : "время не выбрано";

  valueEl.textContent =
    dayName + ", " + day + " " + monthName + " " + year + " • " + timePart;
}

function setupMonthNavigation() {
  const prevBtn = document.querySelector(".month-arrow--prev");
  const nextBtn = document.querySelector(".month-arrow--next");

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      BOOKING_STATE.currentMonth -= 1;
      if (BOOKING_STATE.currentMonth < 0) {
        BOOKING_STATE.currentMonth = 11;
        BOOKING_STATE.currentYear -= 1;
      }
      renderCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      BOOKING_STATE.currentMonth += 1;
      if (BOOKING_STATE.currentMonth > 11) {
        BOOKING_STATE.currentMonth = 0;
        BOOKING_STATE.currentYear += 1;
      }
      renderCalendar();
    });
  }
}

function setupActionButtons() {
  const backBtn = document.querySelector(".action-btn--back");
  const nextBtn = document.querySelector(".action-btn--next");

  if (backBtn) {
    backBtn.addEventListener("click", function () {
      alert("Возврат к выбору услуги/мастера");
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      if (!BOOKING_STATE.selectedTime) {
        alert("Пожалуйста, выберите удобное время");
return;
}
const selectedDate = {
day: BOOKING_STATE.selectedDay,
month: BOOKING_STATE.selectedMonth,
year: BOOKING_STATE.selectedYear,
};
saveSelectedDate(selectedDate, BOOKING_STATE.selectedTime);
alert("Запись выбрана: " + selectedDate.day + " " + MONTHS_GENITIVE[selectedDate.month] + " " + selectedDate.year + " в " + BOOKING_STATE.selectedTime);
});
}
}
// ============================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================
function init() {
const initialSlots = getSlotsForDay(
SERVER_DATA.today.day,
SERVER_DATA.today.month,
SERVER_DATA.today.year
);
SERVER_DATA.slots = initialSlots.slots;
renderCalendar();
renderTimeSlots();
updateBottomBar();
setupMonthNavigation();
setupActionButtons();
}
document.addEventListener("DOMContentLoaded", function () {
init();
});