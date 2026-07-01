# 你的 AI PC 不只会跑软件

> 在浏览器里用 WebGPU + WebNN 跑本地 AI 大模型与视觉应用

一堂面向大学生的 90 分钟 Web AI 讲座，覆盖 **WebGPU、WebNN API、ONNX Runtime Web、Transformers.js**。对标参考课《你的电脑不只会跑软件》，强调 Intel AI PC（CPU / GPU / NPU 三引擎）的软硬件协同与本地推理。

## 内容

| 文件 | 用途 |
|------|------|
| [`slides.html`](slides.html) | 42 页 Intel 技术风演示文稿，**双击打开即可全屏演示**（内置讲稿面板） |
| [`SPEAKER_SCRIPT.md`](SPEAKER_SCRIPT.md) | 可打印演讲稿（Markdown），含每页时间区间与完整口播词 |
| [`SPEAKER_SCRIPT.pdf`](SPEAKER_SCRIPT.pdf) | 演讲稿 PDF（A4，排版好，直接打印排练） |
| [`COURSE.md`](COURSE.md) | 课程设计文档：定位、学习目标、时间轴、运行说明 |
| [`gen-script.js`](gen-script.js) | 演讲稿生成器（改幻灯片讲稿后跑 `node gen-script.js` 同步 Markdown） |
| [`gen-pdf.js`](gen-pdf.js) | PDF 生成器（见下方「重新生成 PDF」） |
| [`track-a-webgpu-llm/`](track-a-webgpu-llm/) | 动手 Demo A：WebGPU + Transformers.js 跑本地大语言模型 |
| [`track-b-webnn-cv/`](track-b-webnn-cv/) | 动手 Demo B：WebNN + Transformers.js 跑图像分类（NPU 加速） |

## 演示操作键

`←` / `→` 翻页 · `N` 讲稿开关 · `Esc` 关讲稿 · `F` 全屏 · 触屏可左右滑动

## 动手 Demo 运行

两个 Demo 都用 CDN 加载库，**直接双击 `index.html` 即可**，无需本地服务器。

- **浏览器**：Chrome / Edge 最新版（WebGPU 默认开启）。
- **WebNN（轨道 B）**：需在 `chrome://flags` 开启 `#web-machine-learning-neural-network`；不支持时自动回退 WASM(CPU)。
- **首次运行需联网**下载模型（约几十 MB），之后浏览器缓存，可离线。

### 轨道 A · WebGPU 跑 LLM
1. 双击 `track-a-webgpu-llm/index.html`
2. 点「加载模型」→ 输入问题 → 「生成」
3. 观察首 token 延迟、tokens/s；切 `webgpu` / `wasm` 对比

### 轨道 B · WebNN 跑图像分类
1. 双击 `track-b-webnn-cv/index.html`
2. 点「加载模型」→ 上传图片 → 「分类」
3. 观察 Top-5 结果与推理耗时；切 `webnn` / `wasm` 对比

## 重新生成演讲稿 / PDF

讲稿以 `slides.html` 里每页的讲稿块为唯一信息源，改完幻灯片后：

```bash
node gen-script.js    # 同步 SPEAKER_SCRIPT.md
node gen-pdf.js       # 生成 SPEAKER_SCRIPT.print.html（中间产物）
# 用 Chrome headless 渲染 PDF：
chrome --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=SPEAKER_SCRIPT.pdf \
  file:///<绝对路径>/SPEAKER_SCRIPT.print.html
```

## 核心主线

> AI PC 有 **CPU / GPU / NPU** 三个引擎。浏览器通过 **WebGPU** 摸到 GPU 跑大模型，通过 **WebNN** 摸到 NPU 跑视觉。全部**本地推理**：数据不出机、零云端成本、可离线。下层 **ONNX Runtime Web** 把它们统一成可切换 backend，上层 **Transformers.js** 再简化成一行 `pipeline()`。

## License

MIT
