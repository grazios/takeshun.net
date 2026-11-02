"use strict";

const themes = {
  orange: { color: "#c54b2b", label: "ORANGE" },
  green: { color: "#526044", label: "GREEN" },
  blue: { color: "#355cb0", label: "BLUE" }
};
const swatches = document.querySelectorAll("[data-theme]");
function selectTheme(name, persist = true) {
  if (!Object.hasOwn(themes, name)) return;
  document.documentElement.style.setProperty("--accent", themes[name].color);
  const label = document.getElementById("palette-name");
  if (label) label.textContent = themes[name].label;
  swatches.forEach(button => {
    const selected = button.dataset.theme === name;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  if (persist) {
    try { localStorage.setItem("takeshun-theme", name); } catch {}
  }
}
swatches.forEach(button => button.addEventListener("click", () => selectTheme(button.dataset.theme)));
try { selectTheme(localStorage.getItem("takeshun-theme"), false); } catch {}

const search = document.getElementById("note-search");
if (search) {
  const cards = [...document.querySelectorAll("[data-note]")];
  const filters = [...document.querySelectorAll("[data-filter]")];
  const emptyState = document.getElementById("empty-state");
  const count = document.getElementById("result-count");
  const normalize = value => value.normalize("NFKC").toLocaleLowerCase("ja").trim();
  const searchable = new Map(cards.map(card => [card, normalize(card.textContent + " " + card.dataset.search)]));
  let category = "all";

  function filterNotes(writeUrl = true) {
    const terms = normalize(search.value).split(/\s+/).filter(Boolean);
    let visible = 0;
    cards.forEach(card => {
      const match = (category === "all" || card.dataset.category === category)
        && terms.every(term => searchable.get(card).includes(term));
      card.hidden = !match;
      if (match) visible += 1;
    });
    count.textContent = String(visible);
    emptyState.hidden = visible !== 0;
    filters.forEach(button => {
      const selected = button.dataset.filter === category;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    if (writeUrl) {
      const url = new URL(location.href);
      if (search.value.trim()) url.searchParams.set("q", search.value.trim());
      else url.searchParams.delete("q");
      if (category !== "all") url.searchParams.set("category", category);
      else url.searchParams.delete("category");
      history.replaceState(null, "", url);
    }
    document.querySelectorAll("[data-note] h3 a").forEach(link => {
      const url = new URL(link.href);
      const list = new URL(location.href);
      if (list.search) url.searchParams.set("from", list.search);
      else url.searchParams.delete("from");
      link.href = url.href;
    });
  }

  function readFilters() {
    const params = new URLSearchParams(location.search);
    search.value = params.get("q") || "";
    category = filters.some(button => button.dataset.filter === params.get("category"))
      ? params.get("category") : "all";
    filterNotes(false);
  }
  search.addEventListener("input", () => filterNotes());
  filters.forEach(button => button.addEventListener("click", () => {
    category = button.dataset.filter;
    filterNotes();
  }));
  document.getElementById("reset-search").addEventListener("click", () => {
    category = "all";
    search.value = "";
    filterNotes();
    search.focus();
  });
  window.addEventListener("popstate", readFilters);
  window.addEventListener("pageshow", readFilters);
  readFilters();
} else {
  // Carry only known list filters back to the local index page.
  const from = new URLSearchParams(new URLSearchParams(location.search).get("from") || "");
  const allowed = new URLSearchParams();
  if (from.get("q")) allowed.set("q", from.get("q"));
  if (["frontend", "deployment"].includes(from.get("category"))) allowed.set("category", from.get("category"));
  if (allowed.size) {
    document.querySelectorAll('a[href="../index.html#notes"]').forEach(link => {
      link.href = "../index.html?" + allowed.toString() + "#notes";
    });
  }
}
document.querySelectorAll("[data-js-only]").forEach(element => { element.hidden = false; });

