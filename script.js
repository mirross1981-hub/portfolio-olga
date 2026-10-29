let works = [];

const list = document.getElementById("works-list");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popup-content");

const caseTemplate = [
  { caption: "Обложка кейса", text: "Заглушка: экран-обложка кейса." },
  { caption: "О проекте", text: "Заглушка: контекст, задача, аудитория." },
  { caption: "Процесс работы", text: "Заглушка: исследование, прототипы, итерации." },
  { caption: "Визуал и мокапы", text: "Заглушка: ключевые экраны и мокапы." },
  { caption: "Результаты", text: "Заглушка: итоги и выводы." }
];

function renderWorks() {
  list.innerHTML = "";

  works.forEach(function (work, index) {
    const block = document.createElement("article");
    block.className = "case-block";
    block.dataset.index = index;

    const cover = document.createElement("div");
    cover.className = "case-cover";
    if (work.cover) {
      cover.style.backgroundImage = 'url("' + work.cover + '")';
    }

    const meta = document.createElement("div");
    meta.className = "case-meta";

    const title = document.createElement("h3");
    title.textContent = work.title;

    const tag = document.createElement("p");
    tag.className = "work-tag";
    tag.textContent = work.tag;

    meta.append(title, tag);
    block.append(cover, meta);
    list.append(block);
  });
}

function renderPopup(work) {
  popupContent.innerHTML = "";

  const heading = document.createElement("h2");
  heading.textContent = work.title;
  popupContent.append(heading);

  const screens = work.screens && work.screens.length > 0 ? work.screens : caseTemplate;

  screens.forEach(function (screen) {
    const item = document.createElement("section");
    item.className = "popup-screen";

    if (screen.src) {
      item.classList.add("popup-screen-image");
      const img = document.createElement("img");
      img.src = screen.src;
      img.alt = screen.alt || "";
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
  popup.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closePopup() {
  popup.classList.remove("is-open");
  document.body.style.overflow = "";
}

list.addEventListener("click", function (event) {
  const block = event.target.closest(".case-block");
  if (block) {
    openPopup(Number(block.dataset.index));
  }
});

popup.addEventListener("click", function (event) {
  if (event.target.closest("[data-close]")) {
    closePopup();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closePopup();
  }
});

fetch("cases.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    works = data.works;
    renderWorks();
  })
  .catch(function (error) {
    console.error("Не удалось загрузить cases.json:", error);
  });