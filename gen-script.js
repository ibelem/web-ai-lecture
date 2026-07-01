// 从 slides.html 自动抽取讲稿，生成可打印的 SPEAKER_SCRIPT.md
// 用法： node gen-script.js
// 幻灯片讲稿（每页 <aside class="notes-src">）是唯一信息源，改完重跑即可同步。
const fs = require("fs");
const html = fs.readFileSync("slides.html", "utf8");

const slideRe = /<section class="slide[^"]*">([\s\S]*?)<\/section>/g;
// <br> 先转空格再去标签，避免标题换行处文字粘连
const stripTags = (s) =>
  s.replace(/<br\s*\/?>/gi, " ")
   .replace(/<[^>]+>/g, "")
   .replace(/\s+/g, " ")
   .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
   .trim();

let out = [];
out.push("# 演讲稿 · 《你的 AI PC 不只会跑软件》");
out.push("");
out.push("> 90 分钟 Web AI 讲座完整口播稿。每页含时间区间与演讲词，可直接照读或脱稿排练。");
out.push("> 自动从 slides.html 生成 —— 改幻灯片讲稿后重跑 `node gen-script.js` 即可同步。");
out.push("");
out.push("**演示操作键**：← / → 翻页 · N 讲稿开关 · Esc 关讲稿 · F 全屏");
out.push("");
out.push("---");
out.push("");

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

  out.push(`## P${n} · ${stripTags(h)}`);
  const meta = [];
  if (kicker) meta.push(stripTags(kicker));
  if (time) meta.push(`⏱ ${time}`);
  if (meta.length) out.push(`*${meta.join(" · ")}*`);
  out.push("");
  out.push(note.split("\n").map((l) => l.trim()).filter(Boolean).join("\n\n"));
  out.push("");
  out.push("---");
  out.push("");
}

fs.writeFileSync("SPEAKER_SCRIPT.md", out.join("\n"), "utf8");
console.log("✅ 生成 SPEAKER_SCRIPT.md，共 " + n + " 页");
