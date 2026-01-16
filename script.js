async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Ne mogu da učitam ${path}`);
  return res.json();
}

function renderParagraphs(el, text) {
  el.innerHTML = "";
  const parts = (text || "").split("\n\n").map(s => s.trim()).filter(Boolean);
  parts.forEach(p => {
    const node = document.createElement("p");
    node.textContent = p;
    node.style.color = "var(--muted)";
    node.style.lineHeight = "1.7";
    node.style.margin = "0 0 10px";
    el.appendChild(node);
  });
}

function linkifyPhone(phone) {
  const cleaned = (phone || "").replace(/\s+/g, "");
  return `<a href="tel:${cleaned}">${phone}</a>`;
}

function linkifyEmail(email) {
  return `<a href="mailto:${email}">${email}</a>`;
}

(async function init() {
  document.getElementById("year").textContent = new Date().getFullYear();

  const [about, services, contact] = await Promise.all([
    loadJSON("content/about.json"),
    loadJSON("content/services.json"),
    loadJSON("content/contact.json"),
  ]);

  // HERO
  document.getElementById("brandTitle").textContent = contact.brandTitle || "Geodetski biro Geosoft";
  document.getElementById("heroSubtitle").textContent = contact.heroSubtitle || "";
  document.getElementById("heroPhone").innerHTML = `📞 ${linkifyPhone(contact.phone)}`;
  document.getElementById("heroEmail").innerHTML = `✉️ ${linkifyEmail(contact.publicEmail)}`;

  // ABOUT
  renderParagraphs(document.getElementById("aboutText"), about.text);

  // SERVICES
  const grid = document.getElementById("servicesGrid");
  grid.innerHTML = "";
  (services.items || []).forEach(item => {
    const card = document.createElement("div");
    card.className = "service";
    card.innerHTML = `
      <div class="service__title">${item.title}</div>
      ${item.desc ? `<p class="service__desc">${item.desc}</p>` : ``}
    `;
    grid.appendChild(card);
  });

  // CONTACT
  document.getElementById("contactAddress").textContent = `📍 Adresa: ${contact.address}`;
  document.getElementById("contactPhone").innerHTML = `📞 Telefon: ${linkifyPhone(contact.phone)}`;
  document.getElementById("contactEmail").innerHTML = `✉️ Email: ${linkifyEmail(contact.publicEmail)}`;
  document.getElementById("formReceiver").textContent = contact.formReceiverEmail;
})();
