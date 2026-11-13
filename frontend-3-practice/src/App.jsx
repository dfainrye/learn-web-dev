import { useState } from "react";
import Header from "./components/Header";
import WizardSteps from "./components/WizardSteps";
import CalendarSection from "./components/CalendarSection";
import TimeSlotsSection from "./components/TimeSlotsSection";
import ActionBar from "./components/ActionBar";
import Footer from "./components/Footer";
import { MONTHS_GENITIVE, getSlotsForDay } from "./utils/date";

const now = new Date();
const TODAY = {
  day: now.getDate(),
  month: now.getMonth(),
  year: now.getFullYear(),
};

function App() {
  const [currentMonth, setCurrentMonth] = useState(TODAY.month);
  const [currentYear, setCurrentYear] = useState(TODAY.year);
  const [selectedDate, setSelectedDate] = useState({
    day: TODAY.day,
    month: TODAY.month,
    year: TODAY.year,
  });
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState(() => getSlotsForDay(TODAY.day));

  function handleDayClick(day) {
    setSelectedDate({
      day,
      month: currentMonth,
      year: currentYear,
    });
    setSelectedTime(null);
    setSlots(getSlotsForDay(day));
  }

  function handleTimeClick(time) {
    setSelectedTime(time);
  }

  function handlePrevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  function handleBack() {
    alert("Возврат к выбору услуги/мастера");
  }

  function handleNext() {
    if (!selectedTime) {
      alert("Пожалуйста, выберите удобное время");
      return;
    }

    alert(
      `Запись выбрана: ${selectedDate.day} ${MONTHS_GENITIVE[selectedDate.month]} ${selectedDate.year} в ${selectedTime}`
    );
  }

  return (
    <div className="barber-app">
      <Header />
      <WizardSteps currentStep={3} />

      <main className="schedule-workspace">
        <div className="schedule-workspace__container">
          <div className="prompt-banner">
            <h1 className="prompt-banner__title">
              Выберите удобное для вас дату и время:
            </h1>
          </div>

          <div className="booking-columns">
            <CalendarSection
              year={currentYear}
              month={currentMonth}
              selectedDate={selectedDate}
              today={TODAY}
              onDayClick={handleDayClick}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />

            <TimeSlotsSection
              slots={slots}
              selectedTime={selectedTime}
              onTimeClick={handleTimeClick}
            />
          </div>

          <ActionBar
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onBack={handleBack}
            onNext={handleNext}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
