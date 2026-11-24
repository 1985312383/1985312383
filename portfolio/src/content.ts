export const avatarUrl = "https://avatars.githubusercontent.com/u/56398475?v=4&size=64";
export const githubProfile = "https://github.com/1985312383";
export const torchRepo = "https://github.com/datawhalechina/torch-rechub";
export const installCommand = "pip install torch-rechub";
export const publicationDoi = "10.1109/TRPMS.2025.3540212";
export const publicationTitle = "Beam Hardening Correction for Image-Domain Material Decomposition in Photon-Counting CT";
export const conference2022 = {
  title: "Preliminary performance evaluation of a prototype whole body photon counting CT using moderate detector pixel size design",
  citationUrl: "https://pubs.rsna.org/doi/full/10.1148/radiol.240662",
};

export const sections = [
  { id: "top", label: "首页" },
  { id: "education", label: "教育背景" },
  { id: "experience", label: "工作经历" },
  { id: "work", label: "开源项目" },
  { id: "research", label: "论文与专利" },
] as const;

export const education = [
  { period: "2021—2024", school: "上海科技大学", english: "ShanghaiTech University", degree: "硕士", major: "计算机科学与技术", research: "硕士阶段论文", href: "#paper-trpms" },
  { period: "2017—2021", school: "上海理工大学", english: "University of Shanghai for Science and Technology", degree: "学士", major: "自动化", research: "实用新型《一种高效日语学习机》第三发明人", href: "#patent-CN210721885U" },
];

export const roles = [
  {
    id: "pingan", employer: "中国平安 · 壹钱包", role: "算法工程师", period: "2025.05 — 至今",
    focus: "从事推荐算法与大模型应用开发。",
  },
  {
    id: "wind", employer: "万得信息 Wind", role: "推荐算法工程师", period: "2024.08 — 2025.03",
    focus: "负责金融资讯推荐。",
  },
];

export const modules = [
  {
    id: "matching", label: ["召回", "与排序"], path: "torch_rechub/models/", icon: "layers",
    overview: "实现 AFM、DIEN、BST 和 DSSM-SENet，扩展 SASRec、NARM、STAMP 的双塔推理与批内训练。",
    files: [
      { name: "matching/", note: "召回模型", href: "/tree/main/torch_rechub/models/matching" },
      { name: "ranking/", note: "CTR 排序", href: "/tree/main/torch_rechub/models/ranking" },
      { name: "multi_task/", note: "多任务学习", href: "/tree/main/torch_rechub/models/multi_task" },
    ],
  },
  {
    id: "generative", label: ["生成式", "推荐"], path: "torch-rechub/", icon: "branch",
    overview: "实现 HSTU、轻量 HLLM 和 SeqTrainer，完善 RQ-VAE 与 TIGER 的语义 ID 生成、约束解码和训练推理流程。",
    files: [
      { name: "models/generative/", note: "模型实现", href: "/tree/main/torch_rechub/models/generative" },
      { name: "trainers/", note: "训练器", href: "/tree/main/torch_rechub/trainers" },
      { name: "examples/generative/", note: "运行示例", href: "/tree/main/examples/generative" },
    ],
  },
  {
    id: "evaluation", label: ["训练", "与评测"], path: "torch-rechub/", icon: "sliders",
    overview: "完善序列样本、时间切分、负采样与 Spark / Parquet 接入，建设统一 Benchmark，补齐 GAUC、Top-K、多样性、覆盖率和新颖性评测。",
    files: [
      { name: "benchmarks/", note: "基准实验", href: "/tree/main/benchmarks" },
      { name: "basic/metric.py", note: "评估指标", href: "/blob/main/torch_rechub/basic/metric.py" },
      { name: "examples/", note: "训练示例", href: "/tree/main/examples" },
    ],
  },
  {
    id: "serving", label: ["检索", "与部署"], path: "torch-rechub/", icon: "terminal",
    overview: "为双塔模型接入向量检索，支持分别导出用户塔和物品塔。完善 ONNX 导出、INT8 与 FP16 量化以及推理验证。",
    files: [
      { name: "serving/", note: "向量索引", href: "/tree/main/torch_rechub/serving" },
      { name: "utils/onnx_export.py", note: "模型导出", href: "/blob/main/torch_rechub/utils/onnx_export.py" },
      { name: "tests/", note: "回归验证", href: "/tree/main/tests" },
    ],
  },
  {
    id: "hardware", label: ["硬件", "适配"], path: "torch-rechub/", icon: "chip",
    overview: "维护 CPU、NVIDIA CUDA、AMD ROCm 和华为昇腾 NPU 的训练配置与示例。AMD GPU 沿用 PyTorch 的 cuda 设备接口，昇腾通过 torch_npu 接入同一套训练器。",
    files: [
      { name: "guide/install.md", note: "按设备安装", href: "/blob/main/docs/zh/guide/install.md" },
      { name: "guide/quick_start.md", note: "运行训练示例", href: "/blob/main/docs/zh/guide/quick_start.md" },
      { name: "trainers/", note: "训练器实现", href: "/tree/main/torch_rechub/trainers" },
    ],
  },
].map(item => ({ ...item, title: item.label.join("") }));

export const otherProjects = [
  {
    id: "easy-vecdb", title: "easy-vecdb", role: "核心贡献者 · Annoy 教程作者",
    description: "编写 Annoy 入门、核心 API 和调优三章教程。配套的电影推荐实战用 MovieLens 数据训练 DSSM 双塔，再用 Annoy 为电影向量建立索引，找出用户可能喜欢的电影。",
    repo: "https://github.com/datawhalechina/easy-vecdb",
    links: [
      { label: "阅读 Annoy 教程", href: "https://easy-vecdb.datawhale.cc/Annoy/chapter1/Annoy入门与环境搭建.html" },
      { label: "电影推荐实战", href: "https://easy-vecdb.datawhale.cc/projects/project1/README.html" },
    ],
  },
  {
    id: "cosmos-guide", title: "搜广推宇宙漫游指南", role: "项目发起人 · 作者",
    description: "为初学者编写搜索、推荐和计算广告指南。从召回与排序讲起，比较三类系统的目标、常用算法和评估方法。",
    repo: "https://github.com/1985312383/search-rec-ads-cosmos-explorer",
    links: [{ label: "在线阅读", href: "https://1985312383.github.io/search-rec-ads-cosmos-explorer/zh/" }],
  },
  {
    id: "hello-rocm", title: "hello-rocm", role: "推荐系统教程作者",
    description: "编写六篇中英文实战教程，带读者在 AMD GPU 上运行 DeepFM、DIN、DSSM 和 MMOE，再跟踪训练实验、导出 ONNX 并验证推理结果。",
    repo: "https://github.com/datawhalechina/hello-rocm",
    links: [{ label: "AMD GPU 推荐系统实战", href: "https://datawhalechina.github.io/hello-rocm/zh/05-amd-yes/torch-rechub/" }],
  },
];

export const patents = [
  { number: "CN122864436A", topic: "系统配置的自动化校验方法、装置、设备及介质", date: "2026-10-02", kind: "发明申请公布", credit: "独立发明人", organization: "平安付电子支付有限公司", href: "https://eureka.patsnap.com/patent/CN122864436A" },
  { number: "CN122713499A", topic: "业务流动数据预测方法、装置、计算机设备及存储介质", date: "2026-09-08", kind: "发明申请公布", credit: "独立发明人", organization: "平安付电子支付有限公司", href: "https://eureka.patsnap.com/patent/CN122713499A" },
  { number: "CN120235965A", topic: "CT图像校正方法、装置、计算机设备和存储介质", date: "2025-07-01", kind: "发明申请公布", credit: "第 1 发明人 / 共 2 人", organization: "上海联影医疗科技股份有限公司", href: "https://patents.google.com/patent/CN120235965A/zh" },
  { number: "CN210721885U", topic: "一种高效日语学习机", date: "2020-06-09", kind: "实用新型授权公告", credit: "第 3 发明人 / 共 5 人", organization: "上海理工大学", href: "https://patents.google.com/patent/CN210721885U/zh" },
];

export const searchIndex = [
  { title: "教育背景", description: "上海科技大学硕士 · 上海理工大学学士", icon: "book", href: "#education", words: "学校 教育 硕士 学士 本科 计算机科学与技术 自动化 ShanghaiTech USST" },
  ...roles.map(job => ({ title: job.employer, description: job.role, icon: "case", href: "#" + job.id, words: "工作 经历 " + job.focus + " " + job.id })),
  { title: "Torch-RecHub", description: "Datawhale · 项目负责人", icon: "layers", href: "#torch-rechub", words: "开源 推荐算法 推荐系统 pytorch torch rechub 框架 pip install" },
  ...modules.map(item => ({ title: item.title, description: "Torch-RecHub · " + item.path, icon: item.icon, href: "#module-" + item.id, words: item.overview + " torch-rechub" })),
  { title: "下一部电影，是怎么选出来的？", description: "Torch-RecHub · 双塔召回实战", icon: "terminal", href: "#movie-recall", words: "电影推荐 电影召回工作台 观众 机械臂 双塔 用户塔 电影塔 向量 余弦相似度 近邻 检索 召回 MovieLens DSSM Annoy easy-vecdb" },
  ...otherProjects.map(project => ({ title: project.title, description: project.role, icon: "book", href: "#" + project.id, words: "开源 教程 " + project.description })),
  ...patents.map(item => ({ title: item.topic, description: item.number + " · " + item.kind, icon: "file", href: "#patent-" + item.number, words: "专利 发明人 范涛 公开号 " + item.credit + " " + item.organization })),
  { title: "光子计数 CT 束硬化校正", description: "2025 · IEEE TRPMS · 期刊论文", icon: "file", href: "#paper-trpms", words: "论文 学术 期刊 发表 paper ShanghaiTech Tao Fan 范涛 DOI " + publicationTitle + " " + publicationDoi },
  { title: "全身光子计数 CT 原型机性能评估", description: "2022 · IEEE NSS/MIC/RTSD · 会议论文", icon: "file", href: "#paper-nss-2022", words: "论文 学术 会议 米兰 第一作者 Fan Tao 范涛 " + conference2022.title },
];
