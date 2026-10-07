// Small progressive enhancements; every page works without JavaScript.
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // Mobile navigation drawer.
  document.querySelector("[data-open-nav]")?.addEventListener("click", () => body.classList.add("nav-open"));
  document.querySelector("[data-close-nav]")?.addEventListener("click", () => body.classList.remove("nav-open"));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") body.classList.remove("nav-open");
  });

  // Dismissible flash messages.
  document.querySelectorAll("[data-dismiss]").forEach((btn) =>
    btn.addEventListener("click", () => btn.closest(".flash")?.remove()),
  );

  // Ask before destructive actions.
  document.querySelectorAll("form[data-confirm]").forEach((form) =>
    form.addEventListener("submit", (e) => {
      if (!window.confirm(form.dataset.confirm)) e.preventDefault();
    }),
  );

  // Whole table rows open their record, while inner links keep working.
  document.querySelectorAll("tr[data-href]").forEach((row) =>
    row.addEventListener("click", (e) => {
      if (e.target.closest("a, button, input, select")) return;
      window.location.href = row.dataset.href;
    }),
  );

  // Filters apply as soon as a dropdown or date changes.
  document.querySelectorAll("form[data-autosubmit]").forEach((form) =>
    form.querySelectorAll("select, input[type=date]").forEach((el) =>
      el.addEventListener("change", () => form.requestSubmit()),
    ),
  );

  // Admins always see every division, so hide the division picker for that role.
  document.querySelectorAll("[data-role-select]").forEach((select) => {
    const field = select.closest("form")?.querySelector("[data-division-field]");
    const sync = () => field && (field.hidden = select.value === "admin");
    select.addEventListener("change", sync);
    sync();
  });

  // Strong temporary password generator.
  document.querySelectorAll("[data-generate]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const input = btn.closest(".field")?.querySelector("[data-password]");
      if (!input) return;
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
      const bytes = crypto.getRandomValues(new Uint32Array(12));
      let pwd = Array.from(bytes, (n) => chars[n % chars.length]).join("");
      pwd = pwd.slice(0, 10) + (bytes[0] % 10) + "x";
      input.value = pwd;
      input.focus();
      input.select();
    }),
  );
});
