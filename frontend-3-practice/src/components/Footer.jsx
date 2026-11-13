import logoImg from "../assets/1.jpg";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <div className="site-footer__main">
          <div className="footer-brand">
            <div className="footer-brand__box">
              <img
                src={logoImg}
                alt="Логотип барбершопа"
                className="footer-brand__icon"
              />
            </div>
            <p className="footer-brand__tagline">Дружелюбное описание услуг</p>
          </div>

          <div className="footer-column">
            <h3 className="footer-column__heading">КОНТАКТЫ</h3>
            <p className="footer-column__text footer-column__text--muted">
              <span className="footer-column__pin" aria-hidden="true">
                &#9673;
              </span>
              ул. Садовая, 15, Москва
            </p>
            <a href="tel:+74951234567" className="footer-column__phone">
              <span className="footer-column__pin" aria-hidden="true">
                &#9742;
              </span>
              +7 (495) 123-45-67
            </a>
          </div>

          <div className="footer-column">
            <h3 className="footer-column__heading">РЕЖИМ РАБОТЫ</h3>
            <p className="footer-column__text footer-column__text--muted">
              Пн–Пт: 9:00 – 21:00
            </p>
            <p className="footer-column__text footer-column__text--muted">
              Сб–Вс: 10:00 – 19:00
            </p>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span className="site-footer__copyright">
            &copy; 2026. Все права защищены.
          </span>
          <a href="#" className="site-footer__policy">
            Политика конфиденциальности
          </a>
        </div>
      </div>
    </footer>
  );
}
