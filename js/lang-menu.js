const langBtn = document.getElementById("lang-btn");
const langMenu = document.getElementById("lang-menu");

// показати / сховати меню
langBtn.addEventListener("click", () => {
  langMenu.classList.toggle("show");
});

// вибір мови
langMenu.addEventListener("click", (e) => {
  if (e.target.dataset.lang) {
    const selectedLang = e.target.dataset.lang;

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

// клік поза меню закриває його
document.addEventListener("click", (e) => {
  if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
    langMenu.classList.remove("show");
  }
});

//При завантаженні сторінки — перевіряємо збережену мову
window.addEventListener("DOMContentLoaded", () => {
  const savedLang = sessionStorage.getItem("lang") || "en";
  langBtn.textContent = (savedLang === "en" ? "EN" : "UA") + " ▼";

  document.querySelectorAll("[data-en]").forEach((el) => {
    el.innerHTML = el.dataset[savedLang];
  });
});
