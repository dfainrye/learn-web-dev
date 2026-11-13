import logoImg from "../assets/1.jpg";

export default function Header() {
  return (
    <header className="top-bar">
      <div className="top-bar__container">
        <a href="#" className="brand-mark" aria-label="На главную">
          <img
            src={logoImg}
            alt="Логотип барбершопа"
            className="brand-mark__icon"
          />
        </a>

        <nav className="main-menu" aria-label="Основная навигация">
          <a href="#" className="main-menu__link">
            Услуги
          </a>
          <a href="#" className="main-menu__link">
            Галерея
          </a>
          <a href="#" className="main-menu__link">
            Команда
          </a>
          <a href="#" className="main-menu__link">
            Отзывы
          </a>
          <a href="#" className="main-menu__link">
            Контакты
          </a>
        </nav>
      </div>
    </header>
  );
}
