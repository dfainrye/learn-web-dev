import {
  MONTHS_NOMINATIVE,
  buildCalendarGrid,
  isDateSelectable,
} from "../utils/date";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export default function CalendarSection({
  year,
  month,
  selectedDate,
  today,
  onDayClick,
  onPrevMonth,
  onNextMonth,
}) {
  const weeks = buildCalendarGrid(year, month);

  return (
    <section className="date-card" aria-label="Выбор даты">
      <div className="date-card__head">
        <h2 className="date-card__month">
          {MONTHS_NOMINATIVE[month]} {year}
        </h2>
        <div className="date-card__arrows">
          <button
            type="button"
            className="month-arrow month-arrow--prev"
            aria-label="Предыдущий месяц"
            onClick={onPrevMonth}
          >
            &lsaquo;
          </button>
          <button
            type="button"
            className="month-arrow month-arrow--next"
            aria-label="Следующий месяц"
            onClick={onNextMonth}
          >
            &rsaquo;
          </button>
        </div>
      </div>

      <div className="weekdays-row">
        {WEEKDAYS.map((dayLabel) => (
          <span className="weekdays-row__item" key={dayLabel}>
            {dayLabel}
          </span>
        ))}
      </div>

      <div className="days-matrix">
        {weeks.map((week, weekIndex) =>
          week.map((cell, cellIndex) => {
            const cellKey = `${weekIndex}-${cellIndex}`;

            if (cell.otherMonth) {
              return (
                <span className="day-tile day-tile--muted" key={cellKey}>
                  {cell.day}
                </span>
              );
            }

            const selectable = isDateSelectable(cell.day, month, year, today);
            const isToday =
              cell.day === today.day &&
              month === today.month &&
              year === today.year;
            const isSelected =
              cell.day === selectedDate.day &&
              month === selectedDate.month &&
              year === selectedDate.year;

            let classes = "day-tile";
            if (!selectable) {
              classes += " day-tile--disabled";
            } else {
              classes += " day-tile--available";
            }
            if (isToday) classes += " day-tile--today";
            if (isSelected) classes += " day-tile--selected";

            if (!selectable) {
              return (
                <span className={classes} key={cellKey}>
                  {cell.day}
                </span>
              );
            }

            return (
              <button
                type="button"
                className={classes}
                key={cellKey}
                onClick={() => onDayClick(cell.day)}
              >
                {cell.day}
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}
