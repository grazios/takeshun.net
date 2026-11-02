"use strict";
const themes = { orange: { color: "#d74720", label: "01 / ORANGE" }, green: { color: "#526044", label: "02 / GREEN" }, blue: { color: "#355cb0", label: "03 / BLUE" } };
const swatches = document.querySelectorAll("[data-theme]");
function selectTheme(name) {
  const theme = themes[name];
  if (!theme) return;
  document.documentElement.style.setProperty("--accent", theme.color);
  document.getElementById("palette-name").textContent = theme.label;
  swatches.forEach(button => {
    const selected = button.dataset.theme === name;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  try { localStorage.setItem("takeshun-theme", name); } catch {}
}
swatches.forEach(button => button.addEventListener("click", () => selectTheme(button.dataset.theme)));
try { const saved = localStorage.getItem("takeshun-theme"); if (saved) selectTheme(saved); } catch {}

