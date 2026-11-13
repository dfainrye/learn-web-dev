export default function TimeSlotsSection({ slots, selectedTime, onTimeClick }) {
  return (
    <section className="slots-card" aria-label="Выбор времени">
      <h2 className="slots-card__title">Доступное время</h2>

      <div className="slots-matrix">
        {!slots || slots.length === 0 ? (
          <div className="slots-empty">В этот день нет доступного времени</div>
        ) : (
          slots.map((slot) => {
            if (!slot.available) {
              return (
                <button
                  type="button"
                  className="slot-btn slot-btn--busy"
                  key={slot.time}
                  disabled
                >
                  <span className="slot-btn__time">{slot.time}</span>
                  <span className="slot-btn__status">Занято</span>
                </button>
              );
            }

            const isSelected = slot.time === selectedTime;
            const classes = isSelected
              ? "slot-btn slot-btn--selected"
              : "slot-btn";

            return (
              <button
                type="button"
                className={classes}
                key={slot.time}
                onClick={() => onTimeClick(slot.time)}
              >
                <span className="slot-btn__time">{slot.time}</span>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}
