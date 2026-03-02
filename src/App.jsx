import {
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
import surgeryEarEndoscopePhoto from "./assets/surgery-ear-endoscope.jpg";
import earAnatomyDiagram from "./assets/ear-anatomy-original.png";
import noseAnatomyDiagram from "./assets/nose-anatomy-original.png";
import throatAnatomyDiagram from "./assets/throat-anatomy-original.png";
import earIcon from "./assets/uho.png";
import noseIcon from "./assets/nos.png";
import throatIcon from "./assets/gorlo.png";
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

function getCurrentSymptomPage() {
  const symptom = new URLSearchParams(window.location.search).get("symptom");
  if (symptom === "ear" || symptom === "nose" || symptom === "throat") {
    return symptom;
  }
  return null;
}

function useSymptomPage() {
  const [symptomPage, setSymptomPage] = useState(getCurrentSymptomPage);

  useEffect(() => {
    const onPopState = () => setSymptomPage(getCurrentSymptomPage());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (!symptomPage) {
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const raf = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });

    return () => cancelAnimationFrame(raf);
  }, [symptomPage]);

  const navigateToSymptom = (nextPage) => {
    const url = new URL(window.location.href);
    if (nextPage) {
      url.searchParams.set("symptom", nextPage);
      url.hash = "";
    } else {
      url.searchParams.delete("symptom");
      url.hash = "problems";
    }
    window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
    setSymptomPage(nextPage || null);

    if (nextPage) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const problemsSection = document.getElementById("problems");
        if (problemsSection) {
          problemsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  };

  return { symptomPage, navigateToSymptom };
}

const earRegions = [
  {
    id: "outer",
    title: "Наружное ухо",
    description:
      "Ушная раковина и наружный слуховой проход проводят звук к барабанной перепонке.",
    x: 22,
    y: 58,
  },
  {
    id: "drum",
    title: "Барабанная перепонка",
    description:
      "Тонкая мембрана, которая преобразует звуковые колебания в механические.",
    x: 58,
    y: 58,
  },
  {
    id: "ossicles",
    title: 'Слуховые косточки ("молоточек–наковальня–стремечко")',
    description:
      "Система косточек среднего уха, усиливающая звук и передающая его во внутреннее ухо.",
    x: 64,
    y: 50,
  },
  {
    id: "vestibular",
    title: "Полукружные каналы",
    description:
      "Часть вестибулярного аппарата, отвечающая за равновесие и координацию.",
    x: 72,
    y: 39,
  },
  {
    id: "cochlea",
    title: "Улитка",
    description:
      "Главный отдел внутреннего уха, где звук превращается в нервный импульс.",
    x: 74,
    y: 62,
  },
  {
    id: "nerve",
    title: "Слуховой нерв",
    description:
      "Передаёт сигналы от улитки в головной мозг для распознавания звуков.",
    x: 82,
    y: 45,
  },
];

const noseRegions = [
  {
    id: "vestibule",
    title: "Преддверие носа",
    description:
      "Начальный отдел носовой полости, где воздух очищается от крупных частиц.",
    x: 34,
    y: 66,
  },
  {
    id: "septum",
    title: "Носовая перегородка",
    description:
      "Разделяет полость носа на правую и левую половины и влияет на качество носового дыхания.",
    x: 49,
    y: 57,
  },
  {
    id: "inferior",
    title: "Нижняя носовая раковина",
    description:
      "Регулирует поток воздуха, участвует в увлажнении и согревании вдыхаемого воздуха.",
    x: 57,
    y: 58,
  },
  {
    id: "middle",
    title: "Средняя носовая раковина",
    description:
      "Важная зона дренажа околоносовых пазух, часто участвует в воспалительных процессах.",
    x: 57,
    y: 49,
  },
  {
    id: "frontal",
    title: "Лобная пазуха",
    description:
      "Одна из околоносовых пазух, расположена в лобной кости и участвует в резонансе голоса.",
    x: 51,
    y: 15,
  },
  {
    id: "ethmoid",
    title: "Решетчатый лабиринт",
    description:
      "Группа ячеек между полостью носа и орбитой, относится к околоносовым пазухам.",
    x: 54,
    y: 41,
  },
  {
    id: "sphenoid",
    title: "Клиновидная пазуха",
    description:
      "Глубокая околоносовая пазуха в задних отделах полости носа.",
    x: 72,
    y: 46,
  },
  {
    id: "nasopharynx",
    title: "Носоглотка",
    description:
      "Переходная зона между полостью носа и глоткой, важна для дыхания и вентиляции.",
    x: 72,
    y: 72,
  },
];

const throatRegions = [
  {
    id: "nasopharynx",
    title: "Носоглотка",
    description:
      "Верхний отдел глотки, соединяющий полость носа с нижележащими отделами дыхательных путей.",
    x: 52,
    y: 36,
  },
  {
    id: "oropharynx",
    title: "Ротоглотка",
    description:
      "Средний отдел глотки за полостью рта, участвует в акте глотания и проведении воздуха.",
    x: 50,
    y: 54,
  },
  {
    id: "laryngopharynx",
    title: "Гортаноглотка",
    description:
      "Нижний отдел глотки, переходящий в пищевод; важен для координации дыхания и глотания.",
    x: 55,
    y: 70,
  },
  {
    id: "epiglottis",
    title: "Надгортанник",
    description:
      "Эластичный хрящ, закрывающий вход в гортань при глотании и защищающий дыхательные пути.",
    x: 49,
    y: 66,
  },
  {
    id: "larynx",
    title: "Гортань",
    description:
      "Отдел дыхательных путей, где расположены голосовые структуры и формируется голос.",
    x: 61,
    y: 79,
  },
  {
    id: "vocal-folds",
    title: "Голосовые складки",
    description:
      "Парные структуры в гортани, обеспечивающие голосообразование и защиту нижних дыхательных путей.",
    x: 59,
    y: 75,
  },
  {
    id: "trachea",
    title: "Трахея",
    description:
      "Воздухоносная трубка, продолжающая гортань и проводящая воздух к бронхам.",
    x: 64,
    y: 92,
  },
];

const noseFacts = [
  {
    title: "Нос фильтрует до 95% частиц из воздуха",
    text: "Слизистая и реснички задерживают пыль, бактерии и аллергены ещё до того, как воздух попадёт в лёгкие.",
  },
  {
    title: "За сутки через нос проходит до 12–15 тысяч литров воздуха",
    text: "Поэтому даже небольшое нарушение носового дыхания быстро ощущается всем организмом.",
  },
  {
    title: "Пазухи носа облегчают вес черепа",
    text: "Если бы они были заполнены костью, голова человека была бы заметно тяжелее.",
  },
  {
    title: "Нос согревает воздух почти до температуры тела",
    text: "Даже если на улице мороз, к лёгким воздух поступает уже тёплым и увлажнённым.",
  },
  {
    title: "Обоняние напрямую связано с эмоциями и памятью",
    text: "Запахи обрабатываются в тех же структурах мозга, что и воспоминания, поэтому запахи так ярко вызывают ассоциации.",
  },
];

const earFacts = [
  {
    title: "Ухо различает колебания меньше диаметра атома",
    text: "Барабанная перепонка реагирует на микродвижения воздуха, которые практически невозможно измерить бытовыми приборами.",
  },
  {
    title: "Внутреннее ухо отвечает не только за слух, но и за равновесие",
    text: "Полукружные каналы постоянно сообщают мозгу положение головы в пространстве.",
  },
  {
    title: "Самая маленькая кость тела находится в ухе",
    text: "Стремечко имеет размер всего около 3–4 мм.",
  },
  {
    title: "Ухо работает даже во сне",
    text: "Мозг продолжает обрабатывать звуки, поэтому мы можем проснуться от важного сигнала.",
  },
  {
    title: "Серная пробка — это не «грязь», а защитный механизм",
    text: "Ушная сера защищает слуховой проход от бактерий и пересыхания.",
  },
];

const throatFacts = [
  {
    title: "Горло — это перекрёст дыхательной и пищеварительной систем",
    text: "Через глотку проходит и воздух, и пища, поэтому механизм глотания такой сложный и точный.",
  },
  {
    title: "Надгортанник работает как автоматический клапан",
    text: "Во время глотания он закрывает вход в дыхательные пути за доли секунды.",
  },
  {
    title: "Голосовые складки совершают сотни колебаний в секунду",
    text: "При разговоре они могут вибрировать примерно от 100 до 1000 раз в секунду.",
  },
  {
    title: "Слизистая горла — часть иммунной защиты",
    text: "Миндалины первыми встречают инфекцию, попадающую через рот и нос.",
  },
  {
    title: "Обезвоживание быстро влияет на голос",
    text: "Даже лёгкий дефицит жидкости делает голосовые складки менее эластичными.",
  },
];

function SymptomPageShell({ title, eyebrow, onBack, children }) {
  return (
    <div className="page">
      <div className="page-shell">
        <section className="section symptom-page">
          <div className="container">
            <button
              type="button"
              className="symptom-page__back"
              onClick={onBack}
            >
              ← Вернуться к симптомам
            </button>
            <div className="section__header">
              <span className="section__eyebrow">{eyebrow}</span>
              <h2>{title}</h2>
            </div>
            {children}
          </div>
        </section>
      </div>
      <CustomCursor />
    </div>
  );
}

function SymptomFacts({ title, facts }) {
  return (
    <section className="symptom-facts">
      <h3 className="symptom-facts__title">{title}</h3>
      <div className="symptom-facts__items">
        {facts.map((fact, index) => (
          <article className="symptom-facts__item" key={fact.title}>
            <h4 className="symptom-facts__item-title">
              {index + 1}. {fact.title}
            </h4>
            <p className="symptom-facts__item-text">{fact.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SymptomInteractiveMap({ imageSrc, imageAlt, regions }) {
  const [activeRegionId, setActiveRegionId] = useState(regions[0]?.id || "");
  const imageRef = useRef(null);
  const [lockedDetailsHeight, setLockedDetailsHeight] = useState(null);
  const detailsDensityClass =
    regions.length >= 8
      ? "ear-map__details--dense"
      : regions.length >= 7
      ? "ear-map__details--compact"
      : "";

  useEffect(() => {
    const updateHeights = () => {
      const node = imageRef.current;
      if (!node) {
        return;
      }

      if (window.innerWidth <= 1024) {
        setLockedDetailsHeight(null);
        return;
      }

      setLockedDetailsHeight(node.getBoundingClientRect().height);
    };

    const imageNode = imageRef.current;
    if (!imageNode) {
      return;
    }

    updateHeights();

    const observer = new ResizeObserver(updateHeights);
    observer.observe(imageNode);

    if (!imageNode.complete) {
      imageNode.addEventListener("load", updateHeights);
    }

    window.addEventListener("resize", updateHeights);

    return () => {
      observer.disconnect();
      imageNode.removeEventListener("load", updateHeights);
      window.removeEventListener("resize", updateHeights);
    };
  }, [imageSrc]);

  const detailsStyle = lockedDetailsHeight
    ? {
        height: `${lockedDetailsHeight}px`,
        maxHeight: `${lockedDetailsHeight}px`,
      }
    : undefined;

  return (
    <div className="ear-map">
      <div className="ear-map__left">
        <div className="ear-map__figure">
          <img
            ref={imageRef}
            src={imageSrc}
            alt={imageAlt}
            className="ear-map__image"
          />
          {regions.map((region) => (
            <button
              key={region.id}
              type="button"
              className={`ear-map__hotspot ${
                activeRegionId === region.id ? "ear-map__hotspot--active" : ""
              }`}
              style={{ left: `${region.x}%`, top: `${region.y}%` }}
              onMouseEnter={() => setActiveRegionId(region.id)}
              onFocus={() => setActiveRegionId(region.id)}
              onClick={() => setActiveRegionId(region.id)}
              aria-label={region.title}
            >
              <span className="ear-map__hotspot-dot" />
              <span className="ear-map__hotspot-label">{region.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        className={`ear-map__details ${detailsDensityClass}`}
        style={detailsStyle}
      >
        {regions.map((region) => (
          <button
            key={region.id}
            type="button"
            className={`ear-map__detail ${
              activeRegionId === region.id ? "ear-map__detail--active" : ""
            }`}
            onMouseEnter={() => setActiveRegionId(region.id)}
            onFocus={() => setActiveRegionId(region.id)}
            onClick={() => setActiveRegionId(region.id)}
          >
            <span className="ear-map__detail-title">{region.title}</span>
            <span className="ear-map__detail-text">{region.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function EarSymptomsPage({ onBack }) {
  return (
    <SymptomPageShell
      title="Ухо: строение и ключевые зоны"
      eyebrow={
        <>
          <FiVolume2 /> Ухо
        </>
      }
      onBack={onBack}
    >
      <p className="section__subtitle">
        Наведите курсор на выделенную область изображения — соответствующая зона
        и пояснение ниже будут подсвечены.
      </p>
      <SymptomInteractiveMap
        imageSrc={earAnatomyDiagram}
        imageAlt="Схема строения уха"
        regions={earRegions}
      />
      <SymptomFacts title="👂 Интересные факты об ухе" facts={earFacts} />
    </SymptomPageShell>
  );
}

function NoseSymptomsPage({ onBack }) {
  return (
    <SymptomPageShell
      title="Нос: строение и ключевые зоны"
      eyebrow={
        <>
          <FiWind /> Нос
        </>
      }
      onBack={onBack}
    >
      <p className="section__subtitle">
        Наведите курсор на выделенную область изображения — соответствующая зона
        и пояснение справа будут подсвечены.
      </p>
      <SymptomInteractiveMap
        imageSrc={noseAnatomyDiagram}
        imageAlt="Схема строения носа"
        regions={noseRegions}
      />
      <SymptomFacts title="👃 Интересные факты о носе" facts={noseFacts} />
    </SymptomPageShell>
  );
}

function ThroatSymptomsPage({ onBack }) {
  return (
    <SymptomPageShell
      title="Горло: строение и ключевые зоны"
      eyebrow={
        <>
          <FiMessageCircle /> Горло
        </>
      }
      onBack={onBack}
    >
      <p className="section__subtitle">
        Наведите курсор на выделенную область изображения — соответствующая зона
        и пояснение справа будут подсвечены.
      </p>
      <SymptomInteractiveMap
        imageSrc={throatAnatomyDiagram}
        imageAlt="Схема строения горла"
        regions={throatRegions}
      />
      <SymptomFacts title="👄 Интересные факты о горле" facts={throatFacts} />
    </SymptomPageShell>
  );
}

function SymptomPlaceholderPage({ onBack, symptomTitle }) {
  return (
    <SymptomPageShell
      title={`${symptomTitle}: подробный разбор`}
      eyebrow={
        <>
          <FiCheckCircle /> {symptomTitle}
        </>
      }
      onBack={onBack}
    >
      <p className="section__subtitle">
        Раздел уже подключён как отдельная страница. Пришлите контент для этого
        направления, и я сразу наполню его структурированными блоками.
      </p>
    </SymptomPageShell>
  );
}

/* ==================== APP ==================== */

function App() {
  const { symptomPage, navigateToSymptom } = useSymptomPage();

  if (symptomPage === "ear") {
    return <EarSymptomsPage onBack={() => navigateToSymptom(null)} />;
  }

  if (symptomPage === "nose") {
    return <NoseSymptomsPage onBack={() => navigateToSymptom(null)} />;
  }

  if (symptomPage === "throat") {
    return <ThroatSymptomsPage onBack={() => navigateToSymptom(null)} />;
  }

  return (
    <div className="page">
      <div className="page-shell">
        <Header />
        <main>
          <Hero />
          <Problems onOpenSymptom={navigateToSymptom} />
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
              <div className="hero-card__label">Кемерово</div>
              <h1 className="hero-card__title">
                Миличенков Максим Дмитриевич
              </h1>
              <p className="hero-card__subtitle">
                Врач оториноларинголог-хирург высшей категории, стаж работы 10
                лет.
              </p>
              <ul className="hero-card__list">
                <li>Диагностика и лечение ЛОР-заболеваний.</li>
                <li>
                  Эндоскопические и микрохирургические операции на ЛОР-органах
                  строго по показаниям.
                </li>
                <li>
                  Понятное объяснение диагноза и плана лечения без лишней
                  терминологии.
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
                <span className="chip">Стаж 10 лет</span>
                <span className="chip">Высшая категория</span>
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

function Problems({ onOpenSymptom }) {
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
            Любые жалобы связанные с ухом, горлом, гортанью/голосом или носом —
            повод показаться к специалисту. Ниже — самые частые ситуации.
          </p>
          <div className="grid grid--3">
            <ProblemCard
              title="Ухо"
              onClick={() => onOpenSymptom("ear")}
              icon={
                <img
                  src={earIcon}
                  alt="Ухо"
                  style={{ width: 30, height: 30, objectFit: "contain" }}
                />
              }
            >
              Боль, шум/звон, заложенность, отделяемое, снижение слуха, частые
              отиты, ощущение «воды в ухе», инородные тела.
            </ProblemCard>
            <ProblemCard
              title="Нос"
              onClick={() => onOpenSymptom("nose")}
              icon={
                <img
                  src={noseIcon}
                  alt="Нос"
                  style={{ width: 30, height: 30, objectFit: "contain" }}
                />
              }
            >
              Постоянная заложенность, чувство затрудненного дыхания, сухость в
              полости носа, частый (продолжительный) насморк, искривление
              перегородки носа, головная (лицевая) боль, рецидивирующие
              гаймориты, полипы и кисты околоносовых пазух, снижение обоняния,
              носовые кровотечения.
            </ProblemCard>
            <ProblemCard
              title="Горло"
              onClick={() => onOpenSymptom("throat")}
              icon={
                <img
                  src={throatIcon}
                  alt="Горло"
                  style={{ width: 30, height: 30, objectFit: "contain" }}
                />
              }
            >
              частые ангины, боль и чувство «кома» в горле, наличие
              новообразований в горле/гортани, охриплость/осиплость голоса,
              дискомфорт при глотание.
            </ProblemCard>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ProblemCard({ title, children, icon, onClick }) {
  const Element = onClick ? "button" : "div";

  return (
    <Element
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`card card--hover card--soft card--problem ${
        onClick ? "card--action" : ""
      }`}
    >
      <div className="card__header">
        <div className="card__icon-wrap">
          {icon || <FiCheckCircle className="card__icon" />}
        </div>
        <h3 className="card__title">{title}</h3>
      </div>
      <p className="card__text">{children}</p>
    </Element>
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
                врач-оториноларинголог высшей квалификационной категории,
                ЛОР-хирург.
              </p>
              <ul className="list">
                <li>Стаж работы в оториноларингологии — 10 лет.</li>
                <li>Высшая квалификационная категория.</li>
                <li>
                  Приём в ГАУЗ «Кузбасский клинический госпиталь для ветеранов
                  войн».
                </li>
              </ul>
              <blockquote className="about__quote">
                На приёме важно без спешки разобраться в вашей ситуации,
                объяснить диагноз понятным языком и предложить наиболее верный
                план лечения. Моя задача — не напугать, а дать понятный план
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
          <div className="surgery__intro">
            <p className="section__subtitle surgery__subtitle">
              Операция — не первый шаг, а продуманное решение.
              <br />
              У меня есть одно важное правило:
              <br />
              Хирургическое лечение показано только при соблюдении одного из
              следующих условий:
              <br />
              1. Исчерпаны возможности адекватно проведённого консервативного
              лечения, которое не привело к достижению клинически значимого
              эффекта.
              <br />
              2. Имеются объективные данные (на основании актуальных клинических
              рекомендаций и накопленного клинического опыта), свидетельствующие
              о том, что консервативная тактика заведомо неэффективна или
              сопряжена с риском прогрессирования заболевания и развития
              осложнений.
              <br />
              <br />
              При показаниях я провожу эндоскопические и микрохирургические
              вмешательства с аккуратным отношением к анатомии и функциям
              ЛОР-органов.
            </p>
            <div className="surgery__image-wrap">
              <img
                src={surgeryEarEndoscopePhoto}
                alt="Эндоскопическое обследование уха"
                className="surgery__image"
                loading="lazy"
              />
            </div>
          </div>
          <div className="grid grid--3">
            <Card title="Нос и пазухи">
              Нос (все операции проводятся только под эндоскопическим
              контролем): септопластика, синусотомия (удаление доброкачественных
              новообразований, кист, полипов и остеом), пластика носовых
              раковин, пластика перфорации перегородки носа, аденоидэктомия.
            </Card>
            <Card title="Ухо">
              Реконструктивно-восстановительная микрохирургия среднего уха
              (тимпанопластика, стапедопластика, санирующие вмешательства),
              удаление доброкачественных новообразований наружного и среднего
              уха, шунтирование барабанной полости, пластика наружного слухового
              прохода при атрезии.
            </Card>
            <Card title="Глотка и гортань">
              Глотка/гортань: микрохирургия гортани, удаление доброкачественных
              новообразований данной локализации, тонзиллэктомия,
              увулопалатопластика.
              <br />
              Лечение ронхопатии (храпа) и СОАС.
              <br />
              Это больше, чем хирургия.
              <br />
              При данной патологии зачастую требуется комплексное лечение с
              участием оториноларинголога, сомнолога, терапевта, стоматолога и
              невролога.
              <br />
              Я владею разнообразными техниками хирургии храпа, но важно выбрать
              нужную тактику и комбинировать её с современными
              реабилитационными мероприятиями.
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
  return (
    <section className="section" id="contacts">
      <div className="container">
        <Reveal>
          <div>
            <div className="section__header">
              <h2 className="contacts__main-heading">
                <FiMapPin className="contacts__icon" />
                Где проходит приём
              </h2>
            </div>
            <p className="contacts__clinic">
              1. Медицинская клиника «Медпарк», г. Кемерово, пр-т Шахтеров, 14А.
              Тел. для записи: +7 (3842) 903-911, +7 (3842) 903-912.
            </p>
            <p className="contacts__text">
              2. По полису ОМС (требуется направление из поликлиники): ГАУЗ
              «Кузбасский клинический госпиталь для ветеранов войн им. Н.Н.
              Бурдина», г. Кемерово, ул. 50 лет Октября, 10. Каждый четверг с
              14:00 до 15:00 по предварительной записи, тел. +7 (3842) 582-670.
            </p>
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
