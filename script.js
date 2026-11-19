let works = [];
let visibleCount = 4; // Сколько кейсов показывать сразу

const list = document.getElementById("works-list");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popup-content");
const projectCountEl = document.getElementById("project-count");
const showMoreBtn = document.getElementById("show-more-btn");

const caseTemplate = [
  { caption: "Обложка кейса", text: "Заглушка: экран-обложка кейса." },
  { caption: "О проекте", text: "Заглушка: контекст, задача, аудитория." },
  { caption: "Процесс работы", text: "Заглушка: исследование, прототипы, итерации." },
  { caption: "Визуал и мокапы", text: "Заглушка: ключевые экраны и мокапы." },
  { caption: "Результаты", text: "Заглушка: итоги и выводы." }
];

/* --- Иконки контактов --- */
const CONTACT_LINKS = [
  { href: "mailto:topol063@yandex.ru", label: "Написать на почту", title: "Почта", external: false, icon: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7.5l8.5 6 8.5-6"/>' },
  { href: "https://t.me/graph_design63", label: "Telegram", title: "Telegram", external: true, icon: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>' },
  { href: "https://max.ru/u/f9LHodD0cOK-HTAsB_203HeexzP4PxBQkBFhvsTClnofYxLRDEMAX9zfkRQ", label: "Max", title: "Max", external: true, icon: '<path d="M21 11.5c0 4.1-4 7.5-9 7.5-1 0-2-.1-2.9-.4L4 20l1.2-3.4C3.8 15.3 3 13.5 3 11.5 3 7.4 7 4 12 4s9 3.4 9 7.5z"/>' }
];

function renderContactIcons() {
  let containers = document.querySelectorAll(".contact-icons");
  if (containers.length === 0) {
    const created = document.createElement("div");
    created.className = "contact-icons";
    const anchor = document.querySelector(".hero-subtitle") || document.querySelector("h1");
    if (anchor && anchor.parentElement) {
      anchor.parentElement.append(created);
    } else {
      document.body.prepend(created);
    }
    containers = [created];
  }

  containers.forEach(function (container) {
    container.innerHTML = "";
    CONTACT_LINKS.forEach(function (contact) {
      const link = document.createElement("a");
      link.href = contact.href;
      link.className = "icon-link";
      link.setAttribute("aria-label", contact.label);
      link.title = contact.title;
      if (contact.external) { link.target = "_blank"; link.rel = "noopener"; }
      link.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + contact.icon + "</svg>";
      container.append(link);
    });
  });
}

renderContactIcons();

/* --- Рендер кейсов --- */
function renderWorks(append = false) {
  if (!append) list.innerHTML = "";

  const limit = append ? works.length : Math.min(visibleCount, works.length);
  const startIndex = append ? visibleCount : 0;

  for (let i = startIndex; i < limit; i++) {
    const work = works[i];
    const block = document.createElement("article");
    block.className = "case-block fade-in-up";
    block.dataset.index = i;

    const cover = document.createElement("div");
    cover.className = "case-cover";
    if (work.cover) cover.style.backgroundImage = 'url("' + work.cover + '")';

    const meta = document.createElement("div");
    meta.className = "case-meta";

    const title = document.createElement("h3");
    title.textContent = work.title;

    const tag = document.createElement("span");
    tag.className = "work-tag";
    tag.textContent = work.tag || "UI/UX Дизайн";

    meta.append(title, tag);
    block.append(cover, meta);
    list.append(block);
  }

  // Управление кнопкой "Показать ещё"
  if (works.length > visibleCount && !append) {
    showMoreBtn.hidden = false;
  } else {
    showMoreBtn.hidden = true;
  }

  // Запуск анимации появления для новых элементов
  observeElements();
}

showMoreBtn.addEventListener("click", function () {
  renderWorks(true);
});

/* --- Анимация при скролле (Intersection Observer) --- */
function observeElements() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Небольшая задержка для каскадного эффекта
        setTimeout(() => {
          entry.target.classList.add("is-visible");
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll(".fade-in-up:not(.is-visible)").forEach(el => observer.observe(el));
}

/* --- Попап --- */
function createCloseButton() {
  popup.querySelectorAll("button, a").forEach(function (el) {
    const text = (el.textContent || "").trim().toLowerCase();
    if (el.hasAttribute("data-close") || text.indexOf("закрыть") !== -1) el.remove();
  });

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "popup-close-circle";
  btn.setAttribute("data-close", "");
  btn.setAttribute("aria-label", "Закрыть кейс");
  btn.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
  return btn;
}

const closeButton = createCloseButton();
popup.setAttribute("role", "dialog");
popup.setAttribute("aria-modal", "true");
popup.setAttribute("tabindex", "-1");

function renderPopup(work) {
  popupContent.innerHTML = "";
  const header = document.createElement("div");
  header.className = "popup-header";
  const heading = document.createElement("h2");
  heading.className = "popup-title";
  heading.textContent = work.title;
  header.append(heading, closeButton);
  popupContent.append(header);

  const screens = work.screens && work.screens.length > 0 ? work.screens : caseTemplate;
  screens.forEach(function (screen) {
    const item = document.createElement("section");
    item.className = "popup-screen";
    if (screen.src) {
      item.classList.add("popup-screen-image");
      const img = document.createElement("img");
      img.src = screen.src;
      img.alt = screen.alt || "";
      img.loading = "lazy";
      img.decoding = "async";
      item.append(img);
    } else {
      const caption = document.createElement("h3");
      caption.textContent = screen.caption;
      const text = document.createElement("p");
      text.textContent = screen.text;
      item.append(caption, text);
    }
    popupContent.append(item);
  });
}

function openPopup(index) {
  renderPopup(works[index]);
  popup.setAttribute("aria-label", works[index].title);
  popup.classList.add("is-open");
  document.body.style.overflow = "hidden";
  popupContent.scrollTop = 0;
  if (popupContent.parentElement) popupContent.parentElement.scrollTop = 0;
  popup.focus({ preventScroll: true });
}

function closePopup() {
  popup.classList.remove("is-open");
  document.body.style.overflow = "";
}

list.addEventListener("click", function (event) {
  const block = event.target.closest(".case-block");
  if (block) openPopup(Number(block.dataset.index));
});

popup.addEventListener("click", function (event) {
  if (event.target.closest("[data-close]") || event.target === popup || event.target.classList.contains("popup-inner")) {
    closePopup();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") closePopup();
});

/* --- Загрузка данных --- */
fetch("cases.json")
  .then(response => response.json())
  .then(data => {
    works = data.works;
    projectCountEl.textContent = works.length; // Обновляем счётчик
    renderWorks();
    observeElements(); // Запускаем анимацию для hero-элементов
  })
  .catch(error => console.error("Не удалось загрузить cases.json:", error));