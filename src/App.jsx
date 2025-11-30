import {
  FiMail,
  FiMapPin,
  FiCheckCircle,
  FiArrowRight,
  FiUser,
  FiStar,
  FiVolume2,
  FiWind,
  FiMessageCircle,
  FiSmile,
  FiRotateCcw,
  FiHelpCircle,
  FiAward,
  FiBookOpen,
  FiFileText,
} from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import doctorPhoto from "./assets/doctor.jpg";
import earIcon from "./assets/uho.png";
import noseIcon from "./assets/nos.png";
import throatIcon from "./assets/gorlo.png";
import kidsIcon from "./assets/deti.png";
import chronicIcon from "./assets/hron.png";
import rareIcon from "./assets/sluchai.png";
import { reviews } from "./data/reviews";

/* ==================== КАСТОМНЫЙ КУРСОР ==================== */

function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const handleMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const handleLeave = () => setVisible(false);
    const handleDown = () => setPressed(true);
    const handleUp = () => setPressed(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
    };
  }, []);

  const style = {
    transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${
      pressed ? 0.85 : 1
    })`,
  };

  return (
    <div
      className={`cursor ${visible ? "cursor--visible" : ""}`}
      style={style}
    />
  );
}

/* ==================== REVEAL (плавное появление) ==================== */

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal--visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ==================== APP ==================== */

function App() {
  return (
    <div className="page">
      <div className="page-shell">
        <Header />
        <main>
          <Hero />
          <Problems />
          <AboutDoctor />
          <Surgery />
          <Process />
          <Reviews />
          <FAQ />
          <Contacts />
        </main>
        <Footer />
      </div>

      <CustomCursor />
    </div>
  );
}

/* ==================== HEADER ==================== */

function Header() {
  /* EFFECT 7+8: scroll state + active section */
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      setScrolled(y > 10);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        threshold: 0.4,
      }
    );

    sections.forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, []);

  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <div className="container header__inner">
        <div className="header__brand">
          <span className="header__name">Миличенков Максим Дмитриевич</span>
          <span className="header__role">
            ЛОР-врач, ЛОР-хирург, высшая категория
          </span>
        </div>
        <button
          type="button"
          className={`header__burger ${isMenuOpen ? "header__burger--open" : ""}`}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Открыть меню"
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`header__nav ${isMenuOpen ? "header__nav--open" : ""}`}>
          <a
            href="#problems"
            className={`header__nav-link ${
              activeId === "problems" ? "header__nav-link--active" : ""
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            С чем помогаю
          </a>
          <a
            href="#about"
            className={`header__nav-link ${
              activeId === "about" ? "header__nav-link--active" : ""
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            О докторе
          </a>
          <a
            href="#surgery"
            className={`header__nav-link ${
              activeId === "surgery" ? "header__nav-link--active" : ""
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Операции
          </a>
          <a
            href="#reviews"
            className={`header__nav-link ${
              activeId === "reviews" ? "header__nav-link--active" : ""
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Отзывы
          </a>
          <a
            href="#contacts"
            className={`header__nav-link ${
              activeId === "contacts" ? "header__nav-link--active" : ""
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Контакты
          </a>
        </nav>
        <a href="#contacts" className="button button--stroke">
          Записаться по email
        </a>
      </div>
    </header>
  );
}

/* ==================== HERO ==================== */

function Hero() {
  const surfaceRef = useRef(null);
  const photoParallaxRef = useRef(null);

  const handleMouseMove = (e) => {
    const surface = surfaceRef.current;
    if (!surface) return;
    const rect = surface.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    surface.style.setProperty("--cursor-x", `${x}%`);
    surface.style.setProperty("--cursor-y", `${y}%`);
  };

  const handleMouseLeave = () => {
    const surface = surfaceRef.current;
    if (!surface) return;
    surface.style.setProperty("--cursor-x", "20%");
    surface.style.setProperty("--cursor-y", "10%");
  };

  useEffect(() => {
    const updateParallax = () => {
      const node = photoParallaxRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight || document.documentElement.clientHeight;
      const midpoint = rect.top + rect.height / 2;
      const distanceFromCenter = midpoint - viewport / 2;
      const offset = Math.max(Math.min(distanceFromCenter * 0.08, 30), -30);
      node.style.transform = `translateY(${offset}px)`;
    };

    updateParallax();
    window.addEventListener("scroll", updateParallax, { passive: true });
    window.addEventListener("resize", updateParallax);
    return () => {
      window.removeEventListener("scroll", updateParallax);
      window.removeEventListener("resize", updateParallax);
    };
  }, []);

  return (
    <section className="section hero" id="top">
      <div className="container">
        <div
          className="hero-card"
          ref={surfaceRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="hero-card__inner">
            <Reveal delay={40} className="hero-card__col hero-card__col--text">
              <div className="hero-card__label">
                Кемерово • ЛОР-врач и ЛОР-хирург
              </div>
              <h1 className="hero-card__title">
                Миличенков Максим Дмитриевич
              </h1>
              <p className="hero-card__subtitle">
                Врач-оториноларинголог высшей категории, стаж 9 лет.
                <br />
                Приём взрослых и детей.
              </p>
              <ul className="hero-card__list">
                <li>
                  Диагностика и лечение острых и хронических ЛОР-заболеваний.
                </li>
                <li>
                  Эндоскопические и микрохирургические операции при
                  показаниях.
                </li>
                <li>
                  Понятное объяснение диагноза и плана лечения без лишних
                  терминов.
                </li>
              </ul>
              <div className="hero-card__actions">
                <a href="#contacts" className="button">
                  Записаться на приём
                </a>
                <a href="#problems" className="button button--ghost">
                  Когда стоит обратиться
                </a>
              </div>
              <div className="hero-card__chips">
                <span className="chip">Стаж 9 лет</span>
                <span className="chip">Высшая категория</span>
                <span className="chip">Приём взрослых и детей</span>
              </div>
            </Reveal>

            <Reveal delay={120} className="hero-card__col hero-card__col--photo">
              <div className="hero-photo" ref={photoParallaxRef}>
                <img
                  src={doctorPhoto}
                  alt="Миличенков Максим Дмитриевич"
                  className="hero-photo__img"
                />
                <div className="hero-photo__badge">
                  <span className="hero-photo__name">
                    Максим
                    <br />
                    Миличенков
                  </span>
                  <span className="hero-photo__role">
                    ЛОР-врач, ЛОР-хирург
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================== PROBLEMS ==================== */

function Problems() {
  return (
    <section className="section" id="problems">
      <div className="container">
        <Reveal>
          <div className="section__header">
            <span className="section__eyebrow">
              <FiUser /> С какими жалобами приходят
            </span>
            <h2>Симптомы, при которых стоит обратиться</h2>
          </div>
          <p className="section__subtitle">
            Любой дискомфорт в области уха, горла или носа — повод показаться
            специалисту. Ниже — самые частые ситуации.
          </p>
          <div className="grid grid--3">
            <ProblemCard
              title="Ухо"
              icon={
                <img
                  src={earIcon}
                  alt="Ухо"
                  style={{ width: 30, height: 30, objectFit: "contain" }}
                />
              }
            >
              Боль, шум, заложенность, выделения, снижение слуха, частые отиты,
              ощущение «воды в ухе», инородные тела.
            </ProblemCard>
            <ProblemCard
              title="Нос"
              icon={
                <img
                  src={noseIcon}
                  alt="Нос"
                  style={{ width: 30, height: 30, objectFit: "contain" }}
                />
              }
            >
              Постоянная заложенность, насморк, частые гаймориты, полипы и
              кисты, искривление перегородки, снижение обоняния.
            </ProblemCard>
            <ProblemCard
              title="Горло"
              icon={
                <img
                  src={throatIcon}
                  alt="Горло"
                  style={{ width: 30, height: 30, objectFit: "contain" }}
                />
              }
            >
              Частые ангины, пробки в миндалинах, боль и ком в горле,
              охриплость голоса, затруднённое глотание.
            </ProblemCard>
            <ProblemCard
              title="Симптомы у детей"
              icon={
                <img
                  src={kidsIcon}
                  alt="Симптомы у детей"
                  style={{ width: 30, height: 30, objectFit: "contain" }}
                />
              }
            >
              Частые ОРВИ, аденоиды, храп, дыхание ртом, снижение слуха,
              жалобы на боль в ухе или горле.
            </ProblemCard>
            <ProblemCard
              title="Хронические состояния"
              icon={
                <img
                  src={chronicIcon}
                  alt="Хронические состояния"
                  style={{ width: 30, height: 30, objectFit: "contain" }}
                />
              }
            >
              Хронический ринит, рецидивирующие синуситы и отиты, длительные
              жалобы, несмотря на лечение.
            </ProblemCard>
            <ProblemCard
              title="Неочевидные случаи"
              icon={
                <img
                  src={rareIcon}
                  alt="Неочевидные случаи"
                  style={{ width: 30, height: 30, objectFit: "contain" }}
                />
              }
            >
              Головные боли и давление в области пазух, неприятный запах из
              носа или рта, любые непонятные симптомы ЛОР-органов.
            </ProblemCard>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ProblemCard({ title, children, icon }) {
  return (
    <div className="card card--hover card--soft card--problem">
      <div className="card__header">
        <div className="card__icon-wrap">
          {icon || <FiCheckCircle className="card__icon" />}
        </div>
        <h3 className="card__title">{title}</h3>
      </div>
      <p className="card__text">{children}</p>
    </div>
  );
}

/* ==================== ABOUT DOCTOR ==================== */

function AboutDoctor() {
  return (
    <section className="section" id="about">
      <div className="container">
        <Reveal>
          <div className="section__header">
            <span className="section__eyebrow">
              <FiStar /> О докторе
            </span>
            <h2>Кто будет вас лечить</h2>
          </div>
          <div className="grid grid--2">
            <div>
              <p className="section__subtitle">
                Я — <strong>Миличенков Максим Дмитриевич</strong>,
                врач-оториноларинголог высшей категории, ЛОР-хирург. Работаю с
                2016 года.
              </p>
              <ul className="list">
                <li>Стаж работы в оториноларингологии — 9 лет.</li>
                <li>Высшая квалификационная категория.</li>
                <li>
                  Приём в ГАУЗ «Кузбасский клинический госпиталь для ветеранов
                  войн».
                </li>
                <li>Принимаю взрослых и детей.</li>
              </ul>
              <blockquote className="about__quote">
                На приёме важно без спешки разобраться в вашей ситуации,
                объяснить диагноз понятным языком и предложить реалистичный план
                лечения. Моя задача — не напугать, а дать опору и понятный план
                действий.
              </blockquote>
            </div>
            <div className="about__box">
              <h3 className="about__title">Образование и квалификация</h3>
              <div className="about__section">
                <h4 className="about__subtitle">Образование</h4>
                <ul className="list list--small">
                  <li>
                    <strong>Кемеровский государственный медицинский университет</strong>
                    <br />
                    2016 • Лечебное дело — базовое образование
                  </li>
                  <li>
                    2018 • Оториноларингология — ординатура
                  </li>
                  <li>
                    <strong>Новокузнецкий государственный институт усовершенствования врачей</strong>
                    <br />
                    2022 • Организация здравоохранения и общественное здоровье — циклы переподготовки
                  </li>
                </ul>
              </div>

              <div className="about__section">
                <h4 className="about__subtitle">Повышение квалификации</h4>
                <ul className="list list--small">
                  <li>
                    2019 • «Неотложная оториноларингология», Кемеровский государственный медицинский университет
                  </li>
                  <li>
                    2019 • «Опухоли верхних дыхательных путей и уха», НГИУВ
                  </li>
                  <li>
                    2020 • «Неотложная помощь в оториноларингологии», НГИУВ
                  </li>
                  <li>
                    2020 • «Актуальные вопросы клиники, диагностики и терапии новой коронавирусной инфекции COVID-19», Кемеровский государственный медицинский университет
                  </li>
                  <li>
                    2021 • «Оперативное лечение ЛОР органов», ООО «Учебно-информационный центр ВКС»
                  </li>
                  <li>
                    2021 • «Актуальные вопросы рационального назначения и применения противомикробных препаратов в стратегии предупреждения распространения антибиотикорезистентности», КОКБ имени С.В. Беляева
                  </li>
                  <li>
                    2021 • «Клиническая трансфузиология», Кузбасская областная клиническая больница имени С.В. Беляева
                  </li>
                  <li>
                    2022 • «Актуальные вопросы отохирургии с курсом диссекции височной кости»
                  </li>
                </ul>
              </div>

              <div className="about__section">
                <h4 className="about__subtitle">Статьи в журнале</h4>
                <ul className="list list--small">
                  <li>
                    2020 • «Хронический рецидивирующий одонтогенный гнойный гайморит, осложненный остеомиелитом верхней челюсти (клинический случай)», научный журнал «Клинический случай»
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ==================== SURGERY ==================== */

function Surgery() {
  return (
    <section className="section" id="surgery">
      <div className="container">
        <Reveal>
          <div className="section__header">
            <span className="section__eyebrow">
              <FiCheckCircle /> Хирургическое лечение
            </span>
            <h2>Когда нужна операция</h2>
          </div>
          <p className="section__subtitle">
            Операция — не первый шаг, а продуманное решение. При показаниях я
            провожу эндоскопические и микрохирургические вмешательства с
            аккуратным отношением к анатомии и функциям.
          </p>
          <div className="grid grid--3">
            <Card title="Нос и пазухи">
              Эндоскопические операции при полипах, кистах, хроническом
              гайморите, искривлении перегородки. Цель — восстановить дыхание и
              дренаж пазух.
            </Card>
            <Card title="Ухо">
              Тимпанопластика, санирующие и реконструктивно-восстановительные
              операции при хроническом отите и снижении слуха.
            </Card>
            <Card title="Глотка и гортань">
              Щадящие вмешательства при доброкачественных образованиях и других
              показаниях, с сохранением голоса, дыхания и глотания.
            </Card>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Card({ title, children }) {
  return (
    <div className="card card--hover">
      <h3 className="card__title">
        <FiCheckCircle className="card__icon" /> {title}
      </h3>
      <p className="card__text">{children}</p>
    </div>
  );
}

/* ==================== PROCESS ==================== */

function Process() {
  return (
    <section className="section section--soft" id="process">
      <div className="container">
        <Reveal>
          <div className="section__header">
            <span className="section__eyebrow">
              <FiArrowRight /> Как проходит приём
            </span>
            <h2>Путь от первого обращения до контроля</h2>
          </div>
          <div className="steps">
            <Step number="01" title="Запись">
              Вы пишете на email. Подбираем удобное время визита, при
              необходимости обсуждаем остроту ситуации.
            </Step>
            <Step number="02" title="Осмотр и беседа">
              Обсуждаем жалобы и историю заболевания, провожу осмотр ЛОР-органов,
              при необходимости — эндоскопию.
            </Step>
            <Step number="03" title="Дополнительная диагностика">
              При необходимости назначаю анализы, КТ/МРТ, исследования слуха и
              другие обследования.
            </Step>
            <Step number="04" title="План лечения">
              Обсуждаем варианты: медикаментозное лечение, процедуры, показания
              к операции. Решение принимаем вместе.
            </Step>
            <Step number="05" title="Наблюдение">
              Контрольные визиты, корректировка терапии, рекомендации по
              профилактике и образу жизни.
            </Step>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Step({ number, title, children }) {
  return (
    <div className="step">
      <div className="step__number">{number}</div>
      <div className="step__body">
        <h3 className="step__title">{title}</h3>
        <p className="step__text">{children}</p>
      </div>
    </div>
  );
}

/* ==================== REVIEWS ==================== */

// ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ: аккуратно режем текст отзыва на блоки,
// но НИЧЕГО в нём не переписываем.
function parseReviewText(raw) {
  if (!raw) {
    return {
      history: "",
      liked: "",
      disliked: "",
      visitDate: "",
      visitPlace: "",
    };
  }

  const text = raw.replace(/\r\n/g, "\n").trim();

  // --- отделяем часть "Приём был..." и ниже ---
  let main = text;
  let visitDate = "";
  let visitPlace = "";

  const visitIndex = text.indexOf("Приём был");
  if (visitIndex !== -1) {
    main = text.slice(0, visitIndex).trim();
    const visitBlock = text.slice(visitIndex).trim();
    const vLines = visitBlock
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (vLines.length > 0) {
      // оставляем строку как есть, вместе с "Приём был..."
      visitDate = vLines[0];
    }
    if (vLines.length > 1) {
      // всё остальное считаем местом приёма
      visitPlace = vLines.slice(1).join(" ");
    }
  }

  // --- режем основную часть на Историю / Понравилось / Не понравилось ---

  const HIST = "История пациента";
  const LIKE = "Понравилось";
  const DISLIKE = "Не понравилось";

  let rest = main;
  const histIndex = main.indexOf(HIST);

  // если есть "История пациента" — убираем всё до него (ФИО, рейтинг и т.п.)
  if (histIndex !== -1) {
    rest = main.slice(histIndex + HIST.length).trim();
  }

  const likeIndex = rest.indexOf(LIKE);
  const dislikeIndex = rest.indexOf(DISLIKE);

  const indices = [likeIndex, dislikeIndex].filter((i) => i !== -1);
  const endHistory = indices.length ? Math.min(...indices) : rest.length;

  const history = rest.slice(0, endHistory).trim();

  let liked = "";
  let disliked = "";

  if (likeIndex !== -1) {
    const likeStart = likeIndex + LIKE.length;
    const likeEnd = dislikeIndex !== -1 ? dislikeIndex : rest.length;
    liked = rest.slice(likeStart, likeEnd).trim();
  }

  if (dislikeIndex !== -1) {
    const disStart = dislikeIndex + DISLIKE.length;
    disliked = rest.slice(disStart).trim();
  }

  return {
    history,
    liked,
    disliked,
    visitDate,
    visitPlace,
  };
}

function Reviews() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState("next");

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const total = reviews.length;
  const current = reviews[index];

  const handlePrev = () => {
    setDirection("prev");
    setIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection("next");
    setIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  return (
    <section id="reviews" className="section section--soft">
      <div className="container">
        <Reveal>
          <div className="section__header">
            <span className="section__eyebrow">Отзывы пациентов</span>
            <h2>Что говорят пациенты о лечении</h2>
            <p className="section__subtitle">
              Все отзывы взяты с независимого сервиса Prodoctorov.ru и опубликованы
              без изменений.
            </p>
          </div>

          <div className="reviews__slider">
            <div className="reviews__track">
              <div
                key={current.id}
                className={`reviews__slide reviews__slide--${direction}`}
              >
                <ReviewCard
                  name={current.author}
                  date={current.date}
                  clinic={current.clinic}
                  text={current.fullText}
                  rating={current.rating}
                  sourceUrl={current.sourceUrl}
                />
              </div>
            </div>

            <div className="reviews__controls">
              <button type="button" className="reviews__arrow" onClick={handlePrev}>
                ←
              </button>

              <span className="reviews__counter">
                {index + 1} / {total}
              </span>

              <button type="button" className="reviews__arrow" onClick={handleNext}>
                →
              </button>

              <a
                className="button button--stroke"
                href="https://prodoctorov.ru/kemerovo/vrach/1021075-milichenkov/otzivi/"
                target="_blank"
                rel="noreferrer"
              >
                Все отзывы на Prodoctorov
              </a>

              <a
                className="reviews__link"
                href="https://prodoctorov.ru/kemerovo/vrach/1021075-milichenkov/otzivi/#otzivi-form"
                target="_blank"
                rel="noreferrer"
              >
                Оставить отзыв на Prodoctorov
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ReviewCard({ name, date, clinic, text, rating, sourceUrl }) {
  const { history, liked, disliked, visitDate, visitPlace } =
    parseReviewText(text || "");

  return (
    <article className="card card--review card--hover">
      {/* Верхняя плашка с рейтингом */}
      <div className="card__badge">★ {rating}.0 · Отзыв пациента</div>

      {/* Инфо о пациенте и клинике сразу под плашкой с небольшим отступом */}
      <div className="reviews__header">
        <div className="reviews__meta-top">
          <span className="reviews__meta-name">{name}</span>
          <span className="reviews__meta-date"> · {date}</span>
        </div>
        <div className="reviews__meta-clinic">{clinic}</div>
      </div>

      {/* Секции с текстом отзыва */}
      <div className="reviews__sections">
        {history && (
          <div className="reviews__section">
            <div className="reviews__section-title">История пациента</div>
            <p className="card__text">{history}</p>
          </div>
        )}

        {liked && (
          <div className="reviews__section">
            <div className="reviews__section-title">Понравилось</div>
            <p className="card__text">{liked}</p>
          </div>
        )}

        {disliked && (
          <div className="reviews__section">
            <div className="reviews__section-title">Не понравилось</div>
            <p className="card__text">{disliked}</p>
          </div>
        )}

        {(visitDate || visitPlace) && (
          <div className="reviews__section reviews__section--meta">
            {visitDate && (
              <p className="reviews__visit">
                <strong>Когда был приём</strong>
                <br />
                {visitDate}
              </p>
            )}
            {visitPlace && (
              <p className="reviews__visit">
                <strong>Где был приём</strong>
                <br />
                {visitPlace}
              </p>
            )}
          </div>
        )}
      </div>

      <a
        className="reviews__source"
        href={sourceUrl}
        target="_blank"
        rel="noreferrer"
      >
        Читать отзыв на Prodoctorov
      </a>
    </article>
  );
}

/* ==================== FAQ ==================== */

function FAQ() {
  return (
    <section className="section section--soft" id="faq">
      <div className="container">
        <Reveal>
          <div className="section__header">
            <span className="section__eyebrow">
              <FiCheckCircle /> Вопросы перед приёмом
            </span>
            <h2>Частые вопросы</h2>
          </div>
          <div className="faq">
            <FaqItem question="Работаете ли вы с детьми?">
              Да, веду приём взрослых и детей. При записи можно указать возраст
              и особенности ребёнка, чтобы подготовиться к визиту.
            </FaqItem>
            <FaqItem question="Нужна ли запись заранее?">
              Запись заранее помогает выбрать удобное время. При острой боли или
              сильном дискомфорте постараемся подобрать ближайший приём.
            </FaqItem>
            <FaqItem question="Нужно ли брать с собой анализы и снимки?">
              Если у вас уже есть результаты обследований, заключения или
              снимки — лучше взять их с собой. Это помогает не повторять
              исследования без необходимости.
            </FaqItem>
            <FaqItem question="Всегда ли операция — единственный вариант?">
              Нет. Во многих случаях достаточно медикаментозного лечения и
              наблюдения. Операцию обсуждаем только тогда, когда она действительно
              обоснована.
            </FaqItem>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FaqItem({ question, children }) {
  return (
    <div className="faq__item">
      <h3 className="faq__question">{question}</h3>
      <p className="faq__answer">{children}</p>
    </div>
  );
}

/* ==================== CONTACTS ==================== */

function Contacts() {
  const email = "example@email.com"; // сюда поставишь реальный email

  return (
    <section className="section" id="contacts">
      <div className="container">
        <Reveal>
          <div className="grid grid--2">
            <div>
              <div className="section__header">
                <span className="section__eyebrow">
                  <FiMail /> Запись на приём
                </span>
                <h2>Контакты</h2>
              </div>
              <p className="section__subtitle">
                Напишите короткое письмо: расскажите, что беспокоит, и предложите
                удобное время для связи. Я отвечу и подберём время приёма.
              </p>
              <div className="contacts__item">
                <span className="contacts__label">Email для записи</span>
                <a href={`mailto:${email}`} className="contacts__value">
                  {email}
                </a>
              </div>
              <p className="contacts__note">
                В письме можно приложить фото заключений и список препаратов,
                которые вы принимаете. Полноценный диагноз ставится только на очном
                приёме.
              </p>
            </div>
            <div className="contacts__box">
              <h3 className="contacts__title">
                <FiMapPin className="contacts__icon" />
                Где проходит приём
              </h3>
              <p className="contacts__clinic">
                ГАУЗ «Кузбасский клинический госпиталь для ветеранов войн», г.
                Кемерово.
              </p>
              <p className="contacts__text">
                Точный кабинет и время приёма уточняются при записи. Перед визитом
                возьмите паспорт, полис, имеющиеся медицинские документы и список
                принимаемых препаратов.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ==================== FOOTER ==================== */

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span>© {new Date().getFullYear()} Миличенков Максим Дмитриевич</span>
        <span className="footer__note">
          Информация на сайте не заменяет очную консультацию врача.
        </span>
      </div>
    </footer>
  );
}

export default App;
