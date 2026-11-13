import { useState, useEffect } from "react";
import Header from "./components/Header";
import WizardSteps from "./components/WizardSteps";
import CalendarSection from "./components/CalendarSection";
import TimeSlotsSection from "./components/TimeSlotsSection";
import ActionBar from "./components/ActionBar";
import Footer from "./components/Footer";
import { MONTHS_GENITIVE } from "./utils/date";
import { fetchToday, fetchSlots } from "./api";

function App() {
  // 1. Состояние загрузки «сегодня» с сервера
  const [today, setToday] = useState(null);
  const [loadingToday, setLoadingToday] = useState(true);
  const [errorToday, setErrorToday] = useState(null);

  // 2. Состояние календаря и выбора пользователя
  const [currentMonth, setCurrentMonth] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // 3. Состояние загрузки слотов с сервера
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [errorSlots, setErrorSlots] = useState(null);

  // Загружаем «сегодня» при открытии страницы
  useEffect(() => {
    let ignore = false;

    async function loadToday() {
      try {
        setLoadingToday(true);
        setErrorToday(null);
        const data = await fetchToday();
        if (ignore) return;

        setToday(data);
        setCurrentMonth(data.month);
        setCurrentYear(data.year);
        setSelectedDate({
          day: data.day,
          month: data.month,
          year: data.year,
        });
      } catch (err) {
        if (!ignore) {
          setErrorToday(err.message);
        }
      } finally {
        if (!ignore) {
          setLoadingToday(false);
        }
      }
    }

    loadToday();

    return () => {
      ignore = true;
    };
  }, []);

  // Загружаем слоты при первом получении today и при каждом клике по дню
  useEffect(() => {
    if (!selectedDate) return;

    let ignore = false;

    async function loadSlots() {
      try {
        setLoadingSlots(true);
        setErrorSlots(null);
        const response = await fetchSlots(selectedDate);

        // Защита от гонок: проверяем, что ответ относится к актуальному дню
        if (
          ignore ||
          !response.date ||
          response.date.day !== selectedDate.day ||
          response.date.month !== selectedDate.month ||
          response.date.year !== selectedDate.year
        ) {
          return;
        }

        setSlots(response.slots);
      } catch (err) {
        if (!ignore) {
          setErrorSlots(err.message);
        }
      } finally {
        if (!ignore) {
          setLoadingSlots(false);
        }
      }
    }

    loadSlots();

    return () => {
      ignore = true;
    };
  }, [selectedDate]);

  function handleDayClick(day) {
    setSelectedDate({
      day,
      month: currentMonth,
      year: currentYear,
    });
    setSelectedTime(null);
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

  // Сценарий 1: пока грузится «сегодня» — показываем заглушку
  if (loadingToday) {
    return (
      <div className="barber-app">
        <Header />
        <WizardSteps currentStep={3} />
        <main className="schedule-workspace">
          <div className="schedule-workspace__container">
            <div className="page-status">Загрузка…</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Сценарий 3: если сервер вернул ошибку при загрузке «сегодня»
  if (errorToday) {
    return (
      <div className="barber-app">
        <Header />
        <WizardSteps currentStep={3} />
        <main className="schedule-workspace">
          <div className="schedule-workspace__container">
            <div className="page-status page-status--error">
              Не удалось загрузить данные: {errorToday}
            </div>
          </div>
        </main>
        <Footer />
      </div>
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
              today={today}
              onDayClick={handleDayClick}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />

            <TimeSlotsSection
              slots={slots}
              selectedTime={selectedTime}
              loading={loadingSlots}
              error={errorSlots}
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
