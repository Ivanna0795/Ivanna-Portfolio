const langBtn = document.getElementById("lang-btn");
const langMenu = document.getElementById("lang-menu");
const burgerBtn = document.getElementById("burger-btn");
const headerHat = document.getElementById("header-hat");

// показати / сховати lang-меню
langBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  langMenu.classList.toggle("show");
});

// вибір мови
langMenu.addEventListener("click", (e) => {
  const target = e.target.closest("[data-lang]");
  if (target) {
    const selectedLang = target.dataset.lang;

    // змінюємо текст кнопки
    langBtn.textContent = (selectedLang === "en" ? "EN" : "UA") + " ▼";

    // оновлюємо тексти на сторінці
    document.querySelectorAll("[data-en]").forEach((el) => {
      el.innerHTML = el.dataset[selectedLang];
    });

    // зберігаємо вибір у sessionStorage
    sessionStorage.setItem("lang", selectedLang);

    // ховаємо меню
    langMenu.classList.remove("show");
  }
});

// клік поза lang-меню закриває його
document.addEventListener("click", (e) => {
  if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
    langMenu.classList.remove("show");
  }
});

// Hamburger menu toggle
if (burgerBtn && headerHat) {
  burgerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    burgerBtn.classList.toggle("active");
    headerHat.classList.toggle("open");
  });

  // закрити при кліку поза меню
  document.addEventListener("click", (e) => {
    if (!burgerBtn.contains(e.target) && !headerHat.contains(e.target)) {
      burgerBtn.classList.remove("active");
      headerHat.classList.remove("open");
    }
  });

  // закрити після кліку на посилання
  headerHat.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      burgerBtn.classList.remove("active");
      headerHat.classList.remove("open");
    });
  });
}

// При завантаженні сторінки — перевіряємо збережену мову
window.addEventListener("DOMContentLoaded", () => {
  const savedLang = sessionStorage.getItem("lang") || "en";
  langBtn.textContent = (savedLang === "en" ? "EN" : "UA") + " ▼";

  document.querySelectorAll("[data-en]").forEach((el) => {
    el.innerHTML = el.dataset[savedLang];
  });
});
