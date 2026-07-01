# 你的 AI PC 不只会跑软件：在浏览器里用 WebGPU + WebNN 跑本地 AI 大模型与视觉应用

> 副标题：打开网页即推理 —— Intel CPU / GPU / NPU 加速，零服务器成本的 Web AI 全栈实战

---

## 一、课程定位与一句话主线

**面向对象**：有基础 Web / 编程经验的大学生（JS 能读懂即可，不需要 AI 背景）

**时长**：90 分钟

**核心主线（贯穿全课的那张图）**：

> AI PC 有 **CPU / GPU / NPU** 三个引擎。浏览器通过 **WebGPU** 摸到 GPU 跑大模型，通过 **WebNN** 摸到 NPU 跑视觉。全部**本地推理**：数据不出机、零云端成本、可离线。下层 **ONNX Runtime Web** 把它们统一成可切换 backend，上层 **Transformers.js** 再简化成一行 `pipeline()`。

---

## 二、学习目标（讲完学生应能）

1. 说清 **AI PC 三引擎**与 WebGPU / WebNN 的对应关系。
2. 讲明 WebGPU（通用算力）与 WebNN（神经网络专用加速，直达 NPU）各自解决什么、如何分工。
3. 理解 ONNX Runtime Web 的 **WASM / WebGPU / WebNN** 三种 backend 取舍。
4. 用 Transformers.js 在浏览器里**跑通一个真实模型**。
5. 判断什么任务适合**浏览器本地推理**、什么仍需云端。

---

## 三、90 分钟议程总表

| 时间 | 模块 | 一句话核心 |
|------|------|-----------|
| 0–10 | 开场：为什么是 Web AI | AI PC 三引擎 + "打开网页就跑大模型"现场 Demo |
| 10–25 | WebGPU：浏览器的通用算力 | 摸到 GPU，做 LLM 的算力底座 |
| 25–40 | WebNN：直达 CPU/GPU/NPU | 唯一能直达 NPU 的 Web 标准，能效关键 |
| 40–55 | ONNX Runtime Web：统一推理引擎 | 三 backend 怎么选 |
| 55–70 | Transformers.js：一行调用 HF | `pipeline()` 抽象 + 模型缓存 |
| 70–87 | 动手实践（A / B 二选一） | A：WebGPU 跑 LLM / B：WebNN 跑 CV |
| 87–90 | 总结 + Q&A | 全景闭环图 + 作业 |

---

## 四、各模块详细内容

### 模块 0 ｜ 开场：为什么是 Web AI（0–10 min）

**钩子 Demo**：现场打开一个网页，本地跑起一个小 LLM 对话 —— 没有后端、没有 API key、断网也能用。

**讲三件事**：
- **AI PC = CPU + GPU + NPU 三引擎**，NPU 是这一代 AI PC 的标志单元。
- 浏览器是离学生最近的 AI 入口；WebGPU / WebNN 就是浏览器摸到这三个引擎的桥梁。
- **云端 vs 本地三角对比**：成本（Token 费用 vs 0）、隐私（数据上传 vs 不出机）、延迟（网络往返 vs 本地）。

> 落点：今天我们不调云端 API，我们让**这台 AI PC 自己算**。

---

### 模块 1 ｜ WebGPU：浏览器的通用算力（10–25 min）

- **是什么**：浏览器里的现代 GPU 接口，继承自 native 的 Vulkan / Metal / D3D12。
- **为什么取代 WebGL**：WebGL 为画图设计，WebGPU 原生支持 **compute shader（通用并行计算）**，这正是 AI 需要的。
- **心智模型**（不写 shader，只建立直觉）：GPU = 几千个小核同时做矩阵乘；LLM 的自回归生成本质就是海量并行矩阵乘 → GPU 最划算。
- **在 AI PC 上的意义**：释放集显 / 独显算力跑生成式模型。

> 落点：**WebGPU 管"通用并行算力"，是大模型的底座。**

---

### 模块 2 ｜ WebNN API：直达 CPU / GPU / NPU（25–40 min）

- **是什么**：W3C 正在标准化的神经网络专用 Web API，直接把推理任务交给操作系统的 ML 加速栈。
- **构图思路**：`MLGraphBuilder` 把算子（conv、matmul、relu…）搭成计算图，交给硬件优化执行。
- **与 WebGPU 分工**：
  - WebGPU = 通用计算，你自己组织算力
  - WebNN = 专用加速，把整张算子图交给系统/NPU 优化
- **NPU 的价值（Intel 主线）**：固定的 CNN 算子图直达 NPU，**能效比 GPU 通用计算更高**，风扇不转、续航友好。
- **底层加速**：在 Windows 上，WebNN 可由 **Intel OpenVINO™** 等作为底层后端驱动 NPU / GPU。

> 落点：**WebNN 管"神经网络专用加速"，是目前 Web 端唯一直达 NPU 的标准。**

---

### 模块 3 ｜ ONNX Runtime Web：统一推理引擎（40–55 min）

- **ONNX 是什么**：跨框架的模型交换格式（PyTorch / TF 都能导出）。
- **ORT Web 的三种 execution provider**：

| Backend | 跑在哪 | 适合 | 取舍 |
|---------|--------|------|------|
| **WASM** | CPU | 兼容性最好、到处能跑 | 最慢 |
| **WebGPU** | GPU | 大模型、并行重 | 需要 WebGPU 支持 |
| **WebNN** | NPU/GPU/CPU | CNN 视觉、低功耗 | 标准较新，算子覆盖在扩 |

- **一段最小推理代码**（创建 session → 选 backend → 喂输入 → 拿输出）。
- **关键认知**：**同一个 ONNX 模型，换一行 backend 配置就能换硬件**。

> 落点：**ORT Web 把 WebGPU / WebNN 统一成可切换的 backend。**

---

### 模块 4 ｜ Transformers.js：一行调用 Hugging Face（55–70 min）

- **是什么**：Hugging Face 官方的 JS 库，把 ORT Web 再包一层，API 跟 Python `transformers` 几乎一致。
- **核心抽象**：`pipeline(task, model, options)` —— 一行拿到一个可用模型。
- **架构位置**：`Transformers.js → ONNX Runtime Web → WebGPU / WebNN → AI PC 硬件`。
- **模型加载与缓存**：首次从 HF Hub 下载，之后存进浏览器 **Cache Storage**，二次秒开、可离线。
- **`device` 选项**：`"wasm"` / `"webgpu"`，一个参数切换硬件。

> 落点：**上层一行 `pipeline()`，底层自动落到 AI PC 的 GPU / NPU。**

---

### 模块 5 ｜ 动手实践：A / B 二选一（70–87 min）

学生在**自己的浏览器**里跑通，体验"本地推理"。两条轨道展示两个标准各自最擅长的场景。

#### 🅰 轨道 A：WebGPU + Transformers.js 本地大语言模型

- **做什么**：浏览器里跑小参数 LLM，实现本地对话 / 文本生成。
- **模型**：`SmolLM2-360M-Instruct` 或 `Qwen2.5-0.5B-Instruct`（轻量、加载快）。
- **关键代码**：`pipeline("text-generation", model, { device: "webgpu" })`
- **看什么**：首 token 延迟、生成速度（tokens/s）；切 WebGPU vs WASM 对比提速。
- **体现 AI PC**：GPU 算力跑生成式模型。
- **运行文件**：`track-a-webgpu-llm/index.html`（双击打开即可）

#### 🅱 轨道 B：WebNN + CV 视觉应用

- **做什么**：调摄像头 / 上传图片，做实时图像分类，体验 NPU 加速。
- **模型**：`MobileNetV4`（分类），Transformers.js + WebNN backend。
- **关键代码**：`pipeline("image-classification", model, { device: "webnn" })`
- **看什么**：CPU vs NPU 的延迟与功耗差异；NPU 跑起来风扇不转。
- **体现 AI PC**：NPU 能效优势。
- **运行文件**：`track-b-webnn-cv/index.html`（双击打开即可）

**进阶任务**：切换 backend 观察性能变化。
**开放任务**："设计一个属于你自己的 Web AI 小应用"（留作课后作业）。

---

### 模块 6 ｜ 总结 + Q&A（87–90 min）

- **全景闭环图**回顾：`AI PC 三引擎 ↔ WebGPU/WebNN ↔ ORT Web ↔ Transformers.js`。
- **能做 / 不能做**：本地小模型、隐私敏感、离线场景 ✅；超大模型、需要最新知识 → 仍需云端。
- **学习资源**：Transformers.js 文档、ONNX Runtime Web 文档、WebNN 规范、Intel AI PC / OpenVINO™ 资料。
- **作业**：基于轨道 A 或 B 改造出一个自己的小应用。

---

## 五、幻灯片（`slides.html` · 共 42 页，含讲稿）

**打开方式**：双击 `slides.html`，浏览器直接全屏演示。

**操作键**：
- `←` / `→`（或空格）：翻页
- `N`：开/关**讲稿面板**（每页底部弹出完整演讲词 + 该页时间区间）
- `F`：全屏
- `Home` / `End`：跳到首页 / 末页
- 鼠标点击左 1/4 区回退、其余前进；触屏可左右滑动

**页序（42 页，对应 90 分钟时间轴）**：

| 页 | 内容 | 时间 |
|----|------|------|
| 1 | 封面 | 0:00 |
| 2 | 这堂课你会带走什么 | 0:30 |
| 3 | 钩子 Live Demo | 1:30 |
| 4 | 云端 vs 本地三角 | 4:00 |
| 5 | AI PC 三引擎 | 7:00 |
| 6 | 全景地图（第 1 次） | 9:00 |
| 7 | 议程路线图 | 10:00 |
| 8 | 模块一封面：WebGPU | 10:30 |
| 9 | WebGPU 痛点 | 11:00 |
| 10 | WebGPU 是什么 | 13:00 |
| 11 | WebGPU vs WebGL | 15:00 |
| 12 | 并行心智模型 | 16:30 |
| 13 | WebGPU 兼容性 | 19:00 |
| 14 | 模块二封面：WebNN | 20:30 |
| 15 | WebNN 痛点 | 21:00 |
| 16 | WebNN 是什么 | 23:00 |
| 17 | `MLGraphBuilder` 代码 | 25:00 |
| 18 | WebGPU vs WebNN 分工 | 27:00 |
| 19 | NPU 能效 | 29:30 |
| 20 | WebNN + OpenVINO™ | 31:30 |
| 21 | WebNN 现状 | 33:30 |
| 22 | 模块三封面：ORT Web | 35:30 |
| 23 | ONNX 格式（PDF 类比） | 36:00 |
| 24 | ORT Web 在栈中的位置 | 38:00 |
| 25 | 三 backend 对比 | 40:00 |
| 26 | 最小推理代码 | 42:30 |
| 27 | 换一行换硬件 | 45:00 |
| 28 | 模块四封面：Transformers.js | 46:30 |
| 29 | 是什么 / 对照 Python | 47:00 |
| 30 | `pipeline()` 抽象 | 49:00 |
| 31 | 全栈架构串联（第 2 次） | 51:30 |
| 32 | 缓存机制 | 53:30 |
| 33 | 任务一览 | 55:30 |
| 34 | 动手封面 | 57:00 |
| 35 | 动手总览 A/B | 57:30 |
| 36 | 轨道 A 步骤 + 代码 | 59:00 |
| 37 | 轨道 A 观察点 | 64:00 |
| 38 | 轨道 B 步骤 + 代码 | 65:30 |
| 39 | 轨道 B 观察点 | 70:30 |
| 40 | 全景闭环（第 3 次） | 72:00 |
| 41 | 能做 / 不能做（判断力） | 74:00 |
| 42 | 资源 + 作业 + Q&A | 77:00 |

> **讲稿设计说明**：全景图刻意出现三次（p6 给地图、p31 串联、p40 闭环），形成"先看地图 → 逐层标记 → 回到地图"的认知闭环；"该本地的本地，该云端的云端"在 p4 抛出、p41 回收，首尾呼应。每页讲稿含开场过渡、类比、现场操作提示与巡场动线，可直接照读。

---

## 六、动手实践运行说明

### 通用前置

- **浏览器**：Chrome / Edge 最新版（WebGPU 默认开启）。
- **WebNN（轨道 B）**：需要支持 WebNN 的浏览器。Edge / Chrome 可在 `chrome://flags` 开启 `#web-machine-learning-neural-network`，或使用带 WebNN 的预览版。
- **首次运行需联网**下载模型（之后浏览器缓存，可离线）。
- 两个 `index.html` 都用 CDN 加载库，**直接双击打开即可**，无需本地服务器。

### 轨道 A：WebGPU LLM

1. 双击 `track-a-webgpu-llm/index.html`。
2. 点"加载模型"，等待下载（约几十 MB）。
3. 输入问题，点"生成"，观察首 token 延迟与 tokens/s。
4. 切换 `device` 下拉（webgpu / wasm）对比速度。

### 轨道 B：WebNN CV

1. 双击 `track-b-webnn-cv/index.html`。
2. 点"加载模型"。
3. 上传一张图片，看分类结果与推理耗时。
4. 切换 `device` 下拉（webnn / wasm）对比延迟。

---

## 七、风格说明

幻灯片采用 **Intel 技术品牌风**：深色背景 + 能量蓝（`#00C7FD`）主色调，科技感强，对标参考课《你的电脑不只会跑软件》。
