import { DAYS_OF_WEEK, MONTHS_GENITIVE } from "../utils/date";

export default function ActionBar({
  selectedDate,
  selectedTime,
  onBack,
  onNext,
}) {
  const { day, month, year } = selectedDate;
  const dateObj = new Date(year, month, day);
  const dayName = DAYS_OF_WEEK[dateObj.getDay()];
  const monthName = MONTHS_GENITIVE[month];
  const timePart = selectedTime ? selectedTime : "время не выбрано";

  return (
    <div className="action-bar">
      <button
        type="button"
        className="action-btn action-btn--back"
        onClick={onBack}
      >
        назад
      </button>

      <div className="action-bar__summary">
        <span className="action-bar__label">Выбранная дата и время:</span>
        <span className="action-bar__value">
          {dayName}, {day} {monthName} {year} • {timePart}
        </span>
      </div>

      <button
        type="button"
        className="action-btn action-btn--next"
        onClick={onNext}
      >
        продолжить
      </button>
    </div>
  );
}
