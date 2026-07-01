// 从 slides.html 抽取讲稿，生成打印友好的 SPEAKER_SCRIPT.html（供 Chrome 转 PDF）
// 用法： node gen-pdf.js   然后用 Chrome headless --print-to-pdf 渲染
// 与 gen-script.js 同源（slides.html 的 <aside class="notes-src">），保证不漂移。
const fs = require("fs");
const html = fs.readFileSync("slides.html", "utf8");

const slideRe = /<section class="slide[^"]*">([\s\S]*?)<\/section>/g;
const clean = (s) =>
  s.replace(/<br\s*\/?>/gi, " ")
   .replace(/<[^>]+>/g, "")
   .replace(/\s+/g, " ")
   .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
   .trim();
const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

let cards = [];
let m, n = 0;
while ((m = slideRe.exec(html)) !== null) {
  n++;
  const body = m[1];
  const kicker = (body.match(/<div class="kicker">([\s\S]*?)<\/div>/) || [, ""])[1];
  const h = (body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) ||
             body.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [, ""])[1];
  const noteM = body.match(/<aside class="notes-src"[^>]*data-time="([^"]*)"[^>]*>([\s\S]*?)<\/aside>/);
  const time = noteM ? noteM[1] : "";
  const note = noteM ? noteM[2] : "（本页无讲稿）";

  const paras = note.split("\n").map((l) => l.trim()).filter(Boolean)
    .map((p) => `<p>${esc(p)}</p>`).join("\n");

  const meta = [clean(kicker), time ? "⏱ " + time : ""].filter(Boolean).join(" · ");

  cards.push(`<article class="page">
  <div class="ph"><span class="pn">P${n}</span><span class="pt">${esc(clean(h))}</span></div>
  ${meta ? `<div class="pm">${esc(meta)}</div>` : ""}
  <div class="pb">${paras}</div>
</article>`);
}

const doc = `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8">
<title>演讲稿 · 你的 AI PC 不只会跑软件</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body {
    font-family: "Microsoft YaHei", "PingFang SC", -apple-system, "Segoe UI", sans-serif;
    color: #1a1f26; line-height: 1.75; font-size: 12.5pt; margin: 0;
  }
  .cover { text-align: center; padding: 40mm 0 20mm; page-break-after: always; }
  .cover .badge { color: #0068B5; letter-spacing: 3px; font-size: 11pt; }
  .cover h1 { font-size: 26pt; margin: 10mm 0 4mm; color: #0a0e14; }
  .cover .sub { color: #55606d; font-size: 13pt; }
  .cover .keys { margin-top: 14mm; font-size: 10.5pt; color: #55606d; }
  .cover .keys code { background:#eef3f7; padding:1px 6px; border-radius:4px; }

  .page { page-break-inside: avoid; margin-bottom: 9mm; padding-bottom: 6mm; border-bottom: 1px solid #e5ebf0; }
  .page:last-child { border-bottom: none; }
  .ph { display: flex; align-items: baseline; gap: 10px; margin-bottom: 2mm; }
  .pn { background:#0068B5; color:#fff; font-weight:700; font-size:10pt; padding:1px 9px; border-radius:5px; white-space:nowrap; }
  .pt { font-size: 15pt; font-weight: 700; color:#0a0e14; }
  .pm { color:#7a8694; font-size:10pt; margin-bottom:3mm; }
  .pb p { margin: 0 0 2.5mm; }
  .pb p:first-child { margin-top: 1mm; }
</style></head>
<body>
  <div class="cover">
    <div class="badge">INTEL AI PC · WEB AI 全栈实战 · 演讲稿</div>
    <h1>你的 AI PC 不只会跑软件</h1>
    <div class="sub">在浏览器里用 WebGPU + WebNN 跑本地 AI 大模型与视觉应用<br>90 分钟 · 42 页 · 完整口播稿</div>
    <div class="keys">演示操作键： <code>←</code>/<code>→</code> 翻页 · <code>N</code> 讲稿开关 · <code>Esc</code> 关讲稿 · <code>F</code> 全屏</div>
  </div>
  ${cards.join("\n")}
</body></html>`;

fs.writeFileSync("SPEAKER_SCRIPT.print.html", doc, "utf8");
console.log("✅ 生成 SPEAKER_SCRIPT.print.html，共 " + n + " 页");
