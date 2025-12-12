import { projects } from "../data/projects.js";
import { setThemeFromStorage, toggleTheme, qs, el, getParam } from "./utils.js";

setThemeFromStorage();
qs("#themeToggle")?.addEventListener("click", toggleTheme);
qs("#year").textContent = String(new Date().getFullYear());

const id = getParam("id") || "";
const project = projects.find((p) => p.id === id) || projects[0];

document.title = `${project.title} | Ruoqi Wang`;

const header = qs("#projectHeader");
const media = qs("#mediaBlock");
const summary = qs("#summaryBlock");
const systems = qs("#systemsBlock");
const tech = qs("#techBlock");
const code = qs("#codeBlock");
const links = qs("#linksBlock");
const tags = qs("#tagsBlock");

function safeArr(x) {
  return Array.isArray(x) ? x : [];
}

/**
 * ✅ 只隐藏“那张卡片”，不要用 closest('section')！
 * 因为 section 是整个页面外壳，会把 video/gallery 一起干掉。
 */
function hideClosestCard(blockEl) {
  if (!blockEl) return;
  const card = blockEl.closest(".card");
  if (card) {
    card.style.display = "none";
    return;
  }
  // fallback: 清空内容
  blockEl.innerHTML = "";
}

function renderBlock(parent, block, ctx) {
  if (!block || typeof block !== "object") return;
  const type = block.type || "p";

  if (type === "section") {
    const sec = el("section", { class: "project-section" });
    if (block.title) sec.appendChild(el("h2", { text: block.title }));
    safeArr(block.body).forEach((b) => renderBlock(sec, b, ctx));
    parent.appendChild(sec);
    return;
  }

  if (type === "h2") {
    parent.appendChild(el("h2", { text: block.text || "" }));
    return;
  }
  if (type === "h3") {
    parent.appendChild(el("h3", { text: block.text || "" }));
    return;
  }
  if (type === "p") {
    parent.appendChild(el("p", { text: block.text || "" }));
    return;
  }

  if (type === "bullets") {
    const ul = el("ul");
    safeArr(block.items).forEach((item) => ul.appendChild(el("li", { text: String(item) })));
    parent.appendChild(ul);
    return;
  }

  if (type === "divider") {
    parent.appendChild(el("div", { class: "hr" }));
    return;
  }

  if (type === "details") {
    const d = document.createElement("details");
    d.className = "details";
    if (block.open) d.setAttribute("open", "");
    const s = document.createElement("summary");
    s.textContent = block.title || "More";
    d.appendChild(s);

    const inner = el("div", { class: "details-body" });

    // details 支持 body
    safeArr(block.body).forEach((b) => renderBlock(inner, b, ctx));

    // 或者 items 快捷 bullets
    if (Array.isArray(block.items) && block.items.length) {
      renderBlock(inner, { type: "bullets", items: block.items }, ctx);
    }

    d.appendChild(inner);
    parent.appendChild(d);
    return;
  }

  // 自动复用你现有字段
  if (type === "listFrom") {
    const title = block.title || "";
    const key = block.key || "";
    const items = safeArr(ctx?.project?.[key]);

    const sec = el("section", { class: "project-section" });
    if (title) sec.appendChild(el("h2", { text: title }));

    const ul = el("ul");
    items.forEach((x) => ul.appendChild(el("li", { text: x })));
    sec.appendChild(ul);

    parent.appendChild(sec);
    return;
  }

  if (type === "image") {
    const figure = el("figure", { class: "pb-figure" });

    const img = el("img", {
      src: block.src || "",
      alt: block.alt || "",
      loading: "lazy"
    });

    // ✅ 让 pageBlocks 里的图片也能点开 lightbox
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      // caption 优先，其次 alt
      openLightbox(block.src, block.caption || block.alt || "");
    });

    figure.appendChild(img);

    if (block.caption) {
      figure.appendChild(el("figcaption", { class: "muted small", text: block.caption }));
    }

    parent.appendChild(figure);
    return;
  }

  if (type === "code") {
    const sec = el("div", { class: "code-sample" });

    if (block.title) sec.appendChild(el("h4", { text: block.title }));
    if (block.explain) sec.appendChild(el("p", { class: "muted small", text: block.explain }));

    const pre = el("pre");
    const codeEl = el("code");
    codeEl.textContent = block.code || "";
    pre.appendChild(codeEl);

    sec.appendChild(pre);
    parent.appendChild(sec);
    return;
  }


  if (type === "codeFrom") {
    const title = block.title || "Code Highlights";
    const arr = safeArr(ctx?.project?.codeHighlights);

    const sec = el("section", { class: "project-section" });
    sec.appendChild(el("h2", { text: title }));

    arr.forEach((ch) => {
      const blockEl = el("div", { class: "code-sample" });
      blockEl.appendChild(el("h4", { text: ch.title || "" }));
      if (ch.explain) blockEl.appendChild(el("p", { class: "muted small", text: ch.explain }));

      const pre = el("pre");
      const codeEl = el("code");
      codeEl.textContent = ch.code || "";
      pre.appendChild(codeEl);

      blockEl.appendChild(pre);
      sec.appendChild(blockEl);
      sec.appendChild(el("div", { class: "hr" }));
    });

    parent.appendChild(sec);
    return;
  }

  // fallback
  parent.appendChild(el("p", { text: block.text ? String(block.text) : "" }));
}

function renderPageBlocksIntoProjectMain() {
  const blocks = safeArr(project.pageBlocks);
  if (!blocks.length) return false;

  // ✅ 只隐藏旧卡片（不会把整个 section 干掉）
  hideClosestCard(summary);
  hideClosestCard(systems);
  hideClosestCard(tech);
  hideClosestCard(code);

  const root = el("div", { id: "pageBlocksRoot" });
  blocks.forEach((b) => renderBlock(root, b, { project }));

  // ✅ 插入到 mediaBlock 后面（而不是插到 links 前/外层）
  const mainCol = document.querySelector(".project-main");
  if (mainCol) {
    // mediaBlock 在最前面
    mainCol.appendChild(root);
    return true;
  }

  // fallback
  (document.querySelector("main") || document.body).appendChild(root);
  return true;
}

/* ===== Header ===== */
header.innerHTML = "";
header.appendChild(
  el("div", {}, [
    el("h1", { text: project.title }),
    el("p", { class: "project-kicker", text: project.kicker || "" }),
  ])
);

const meta = el("div", { class: "tags" });
[
  project.role ? `Role: ${project.role}` : null,
  Array.isArray(project.tools) ? `Tools: ${project.tools.join(", ")}` : null,
]
  .filter(Boolean)
  .forEach((x) => meta.appendChild(el("span", { class: "tag", text: x })));
header.appendChild(meta);

/* ===== Media (Video + Gallery) ===== */
media.innerHTML = "";

// video embed
if (project.videoEmbedUrl) {
  const wrap = el("div", { class: "video-embed" });
  const iframe = el("iframe", {
    src: project.videoEmbedUrl,
    title: `${project.title} 视频`,
    allow:
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
    allowfullscreen: "true",
  });
  wrap.appendChild(iframe);
  media.appendChild(wrap);
}

// local video
if (project.localVideo) {
  const v = el("video", { class: "video-local" });
  v.setAttribute("controls", "");
  v.setAttribute("playsinline", "");
  v.setAttribute("preload", "metadata");
  v.innerHTML = `<source src="${project.localVideo.src}" type="${project.localVideo.type}">`;
  media.appendChild(v);
}

// gallery
if (project.gallery?.length) {
  const grid = el("div", { class: "media-grid" });
  project.gallery.forEach((g) => {
    const item = el("div", { class: "media-item" });
    const img = el("img", { src: g.src, alt: g.alt || "gallery image" });
    img.addEventListener("click", () => openLightbox(g.src, g.caption || ""));
    item.appendChild(img);
    grid.appendChild(item);
  });
  media.appendChild(grid);
}

/* ===== PageBlocks or fallback ===== */
const usedBlocks = renderPageBlocksIntoProjectMain();

if (!usedBlocks) {
  // fallback: old fixed rendering
  summary.innerHTML = "";
  safeArr(project.summary).forEach((par) => summary.appendChild(el("p", { text: par })));

  systems.innerHTML = "";
  const ul1 = el("ul");
  safeArr(project.systems).forEach((s) => ul1.appendChild(el("li", { text: s })));
  systems.appendChild(ul1);

  tech.innerHTML = "";
  const ul2 = el("ul");
  safeArr(project.technical).forEach((s) => ul2.appendChild(el("li", { text: s })));
  tech.appendChild(ul2);

  code.innerHTML = "";
  safeArr(project.codeHighlights).forEach((ch) => {
    const block = el("div", { class: "code-sample" });
    block.appendChild(el("h4", { text: ch.title || "" }));
    if (ch.explain) block.appendChild(el("p", { class: "muted small", text: ch.explain }));
    const pre = el("pre");
    const codeEl = el("code");
    codeEl.textContent = ch.code || "";
    pre.appendChild(codeEl);
    block.appendChild(pre);
    block.appendChild(el("div", { class: "hr" }));
    code.appendChild(block);
  });
}

/* ===== Links + tags ===== */
links.innerHTML = "";
const linkEntries = Object.entries(project.links || {});

if (linkEntries.length === 0 || project.hideLinks === true) {
  // 只隐藏 Links 这一段（标题、内容、分隔线），保留 Tags
  const card = links.closest(".card");
  if (card) {
    const linksTitle = card.querySelector('h3'); // 默认这个card里第一个h3就是 Links
    const hr = card.querySelector('.hr');

    if (linksTitle) linksTitle.style.display = "none";
    links.style.display = "none";
    if (hr) hr.style.display = "none";
  } else {
    // fallback：至少隐藏 links 容器
    links.style.display = "none";
  }
} else {
  links.style.display = "";
  const linkList = el("div", { class: "tags" });
  linkEntries.forEach(([k, v]) => {
    linkList.appendChild(
      el("a", { class: "tag", href: v, text: k, target: "_blank", rel: "noopener" })
    );
  });
  links.appendChild(linkList);
}

tags.innerHTML = "";
safeArr(project.tags).forEach((t) => tags.appendChild(el("span", { class: "tag", text: t })));

/* ===== Lightbox ===== */
const dlg = qs("#lightbox");
const dlgImg = qs("#lightboxImg");
const dlgCap = qs("#lightboxCaption");
const dlgClose = qs("#lightboxClose");

function openLightbox(src, caption) {
  dlgImg.src = src;
  dlgCap.textContent = caption || "";
  if (typeof dlg.showModal === "function") dlg.showModal();
}

dlgClose?.addEventListener("click", () => dlg.close());
dlg?.addEventListener("click", (e) => {
  const rect = dlg.getBoundingClientRect();
  const isInside =
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom;
  if (!isInside) dlg.close();
});
