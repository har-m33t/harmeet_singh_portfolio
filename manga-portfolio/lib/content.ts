/**
 * Single source of truth for resume content.
 * Mirrors the master LaTeX resume — update here, not in components.
 */

export type Link = {
  label: string;
  href: string;
};

/**
 * A measured result. Much of this work is improvement over a stated baseline,
 * so `from` carries the number that was beaten and the UI renders the delta.
 */
export type Metric = {
  /** The one figure worth remembering. Rendered in the accent color. */
  key?: boolean;
  label: string;
  value: string;
  /** Baseline the value improved on. */
  from?: string;
  /** Which way is good — drives the arrow glyph. */
  dir?: "up" | "down";
};

export type Experience = {
  id: string;
  org: string;
  role: string;
  location: string;
  period: string;
  /** Sort key — later is more recent. Format: YYYYMM. */
  start: number;
  stack: string[];
  bullets: string[];
  /** Up to three headline results. */
  metrics?: Metric[];
  links?: Link[];
};

/** Folders in the experiment tree, in display order. */
export const CATEGORIES = [
  { id: "ml-cv", label: "ml-cv", blurb: "Learning and perception systems" },
  { id: "robotics-controls", label: "robotics-controls", blurb: "Things that move" },
  { id: "full-stack", label: "full-stack", blurb: "End-to-end products" },
  { id: "data-ai", label: "data-ai", blurb: "Analysis and classical AI" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type Project = {
  id: string;
  title: string;
  /** Short name used in the index rail. */
  codename: string;
  /** URL segment: /projects/<slug>. Stable — changing one breaks shared links. */
  slug: string;
  category: CategoryId;
  date: string;
  start: number;
  tags: string[];
  stack: string[];
  bullets: string[];
  /** Up to three headline results. */
  metrics?: Metric[];
  /** Omitted when the repository is private. */
  repo?: string;
  /** Non-repo link, e.g. a live deployment. */
  live?: string;
  /** Files under /public/projects. Treated as plots unless `screenshot`. */
  images?: { src: string; caption: string; screenshot?: boolean }[];
  /** Headline result, shown in the index rail. */
  headline?: string;
};

export const EXPERIENCES: Experience[] = [
  {
    id: "abbvie",
    org: "AbbVie — Clinical Innovation R&D",
    role: "Data Scientist & Machine Learning Intern",
    location: "Irvine, CA",
    period: "Jun 2026 — Present",
    start: 202606,
    metrics: [
      { key: true, label: "Pixel accuracy", value: "82%", from: "62%", dir: "up" },
      { label: "Parameters cut", value: "110M+", dir: "down" },
      { label: "Compute cost", value: "~80%", dir: "down" },
    ],
    stack: ["PyTorch", "AWS SageMaker", "S3", "HRNetV2", "ResNet50", "MediaPipe", "TensorBoard", "Encord"],
    bullets: [
      "Trained a semantic segmentation model to 82% pixel accuracy, up from a 62% U-Net baseline, on an HRNetV2 + C1 encoder-decoder architecture running on AWS SageMaker over S3 pipelines.",
      "Cut 110M+ parameters and ~80% of compute cost from head pose classification while raising accuracy 45%, by replacing a vision transformer backbone with ResNet50 plus MediaPipe face-crop bounding box detection.",
      "Automated annotation QA across 2k+ images with Encord scripts handed to Encord agents, running IoU checks, model performance visualizations, and failure analysis in TensorBoard and Matplotlib.",
    ],
  },
  {
    id: "dpl",
    org: "Design and Partnership Lab, UC Irvine",
    role: "Data Science Research Assistant",
    location: "Irvine, CA",
    period: "Sep 2026 — Present",
    start: 202609,
    metrics: [
      { label: "Transcripts processed", value: "45k+" },
      { key: true, label: "GPU memory", value: "~70%", dir: "down" },
      { label: "Inference time", value: "~40%", dir: "down" },
    ],
    stack: ["Python", "BERTopic", "Qwen3-Embedding-8B", "Quantization", "Pandas"],
    bullets: [
      "Applied data science and language-model analysis to raw student data across edtech research projects, turning unstructured transcripts into structured, analysis-ready features.",
      "Built a Python cleaning and preprocessing pipeline for 45k+ student transcripts, producing datasets for educational studies on the psychological aspects of learning.",
      "Upgraded a BERTopic topic-extraction pipeline by swapping in Qwen3-Embedding-8B with 4-bit quantization, cutting GPU memory ~70% and embedding inference time ~40% against the full-precision model.",
    ],
  },
  {
    id: "uarizona",
    org: "University of Arizona, College of Medicine — Ping Research Group",
    role: "AI & Bioinformatics Research Intern",
    location: "Remote",
    period: "Jun 2026 — Aug 2026",
    start: 202606.5,
    metrics: [
      { key: true, label: "ROC-AUC", value: "0.81", from: "0.73", dir: "up" },
      { label: "RNA samples", value: "1.1M+" },
      { label: "Instruction pairs", value: "220K+" },
    ],
    stack: ["DeepSpeed ZeRO-2", "HuggingFace", "LoRA", "LangGraph", "pgvector", "PostgreSQL", "Ollama"],
    bullets: [
      "Trained a two-stage multimodal LLM with DeepSpeed ZeRO-2 on 220K+ instruction-tuning pairs, aligning frozen 37M–147M parameter HuggingFace encoders to a LoRA-tuned 7B parameter backbone through a linear projection layer.",
      "Reached 0.81 ROC-AUC on cardiovascular disease prediction across 1.1M+ RNA samples, improving on a 0.73 frozen-encoder and linear-probe baseline over extracted embeddings.",
      "Built a clinical AI system in Python, with LangGraph orchestrating a stateful 6-condition pipeline over hybrid RAG across 116 validated PostgreSQL/pgvector entries and local 12B–20B parameter LLMs on Ollama.",
    ],
    links: [
      { label: "Ping Research Group", href: "https://sites.arizona.edu/ping-lab/" },
      { label: "github.com/har-m33t/CARE-AI-Lite", href: "https://github.com/har-m33t/CARE-AI-Lite" },
    ],
  },
  {
    id: "secondwind",
    org: "SecondWind — Selling to AI Agents",
    role: "AI Software Engineering Intern",
    location: "Remote",
    period: "Aug 2026 — Oct 2026",
    start: 202608,
    metrics: [
      { key: true, label: "Tool-calling functions", value: "32" },
      { label: "Write operation types", value: "23" },
      { label: "Audit findings closed", value: "10" },
    ],
    stack: ["TypeScript", "Next.js", "Claude Agent SDK", "MCP", "MongoDB", "Prisma", "Google Cloud Run"],
    bullets: [
      "Built an LLM-powered strategy agent in TypeScript and Next.js using the Claude Agent SDK and an MCP server with 32 tool-calling functions over MongoDB/Prisma, turning AI-visibility and traffic data into recommendations.",
      "Extended the agent to write to MongoDB across 23 operation types using encrypted, human-in-the-loop change plans, with admin approval, audit logging, and one-click undo on every database write.",
      "Hardened the agent on Google Cloud Run against prompt injection and runaway API costs using input validation, HTML sanitization, and rate limiting, closing 10 security audit findings and a ~5.5x billing overcharge.",
    ],
  },
  {
    id: "legacy",
    org: "Legacy Robotics (URC Competition Team), UC Irvine",
    role: "Software Engineer, Autonomous Navigation · Incoming Chief Software Lead",
    location: "Irvine, CA",
    period: "Apr 2026 — Present",
    start: 202604,
    metrics: [
      { key: true, label: "Detection latency", value: "sub-30ms", dir: "down" },
      { label: "Precision / recall", value: "96.5 / 94.9%" },
      { label: "Localization error", value: "sub-5cm", dir: "down" },
    ],
    stack: ["ROS2", "YOLOv11", "TensorRT", "ONNX", "NVIDIA Jetson", "ZED SDK", "OpenCV", "RTK-GNSS"],
    bullets: [
      "Reduced object-detection latency to sub-30ms on an NVIDIA Jetson, compiling YOLOv11 at 96.5% precision and 94.9% recall to ONNX and optimizing with TensorRT.",
      "Achieved sub-5cm localization with ArUco-tag detection and PnP pose estimation, computing 3D translation and rotation vectors for real-time range and bearing during autonomous post approach, fused with GNSS coordinates and IMU data.",
      "Built a ROS2 navigation stack integrating A* global planning with VFH/DWA local planners, consuming RTK-GNSS waypoints and publishing geometry_msgs/Twist motor commands.",
      "Fused YOLOv11 detections on URC-specific targets with ZED 2 stereo depth to produce metric distance estimates for localized object detection at competition waypoints.",
      "Shipped a config-driven YOLO model factory with 5 model-source aliases and 10+ CLI-overridable training parameters, replacing hardcoded scripts.",
    ],
  },
  {
    id: "robosub",
    org: "Underwater Robotics Project (RoboSub), UC Irvine",
    role: "Computer Vision / Perception Engineer",
    location: "Irvine, CA",
    period: "Feb 2026 — Jun 2026",
    start: 202602,
    stack: ["Python", "OpenCV", "ROS2", "YOLOv11", "CLAHE", "NumPy"],
    bullets: [
      "Built Python/OpenCV pipelines for real-time underwater detection of gates and buoys, including an HSV-based color detection algorithm, publishing detections to ROS2 topics for downstream autonomy and navigation.",
      "Developed a YOLOv11 detection pipeline with underwater-specific preprocessing — CLAHE and color attenuation correction — to improve robustness in low-visibility conditions.",
      "Built and tested ROS2 Python nodes with state-machine logic that convert perception outputs into motion commands, enabling closed-loop AUV control in simulation and on hardware.",
      "Defined perception API contracts with the autonomy, mechanical, and electrical teams to integrate CV outputs into the AUV control system before hardware deployment.",
    ],
  },
  {
    id: "ucips",
    org: "UC Irvine — School of Physical Sciences",
    role: "Digital Media Assistant",
    location: "Irvine, CA",
    period: "Apr 2025 — Apr 2026",
    start: 202504,
    metrics: [
      { key: true, label: "Audience interaction", value: "60%", dir: "up" },
      { label: "New followers", value: "1,000+", dir: "up" },
    ],
    stack: ["HTML", "CSS", "JavaScript", "Canva", "Buffer", "CapCut"],
    bullets: [
      "Helped implement the new UCI School of Physical Sciences website, building frontend pages in HTML, CSS, and JavaScript to improve digital outreach.",
      "Designed and scheduled Instagram content with Canva, Buffer, and CapCut, increasing audience interaction 60% while keeping brand consistency.",
      "Co-developed targeted digital marketing campaigns aligned with departmental outreach goals, gaining 1,000+ new followers.",
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    id: "viper",
    title: "AI-Generated Image Forensics Pipeline",
    codename: "VIPER",
    slug: "viper",
    category: "ml-cv",
    date: "Apr 2026",
    start: 202604,
    headline: "1st place — UCI Datathon 2026",
    tags: ["ML", "Computer Vision", "Data Science"],
    metrics: [
      { key: true, label: "Accuracy", value: "98.9%" },
      { label: "AUC-ROC", value: "0.98+" },
      { label: "Classification error", value: "55%", dir: "down" },
    ],
    stack: ["PyTorch", "ConvNeXt-Tiny", "Grad-CAM", "UMAP", "Scikit-learn"],
    bullets: [
      "Won 1st place at the UCI 2026 Datathon against 120+ participants with a forensic pipeline detecting AI-generated images at 98.9% accuracy and 0.98+ AUC-ROC across 500k+ images.",
      "Cut classification error 55% against a logistic regression baseline by fine-tuning an unfrozen 28M+ parameter PyTorch model (ConvNeXt-Tiny) concatenated with 33 engineered forensic features.",
      "Made predictions interpretable with Grad-CAM heatmaps and UMAP visualizations.",
    ],
    repo: "https://github.com/har-m33t/VIPER",
    images: [
      { src: "/projects/viper-roc.png", caption: "ROC — validation split. VIPER-ConvNeXt-Unfrozen-MLP reaches 0.9975 AUC against 0.8411 for the forensic-only logistic regression baseline." },
      { src: "/projects/viper-confusion.png", caption: "Confusion matrix on the held-out split." },
      { src: "/projects/viper-per-generator.png", caption: "Detection accuracy broken out per source generator." },
      { src: "/projects/viper-training.png", caption: "Training curves across the model sweep." },
    ],
  },
  {
    id: "nimbus",
    title: "Real-Time Sign-Language-to-English Translation",
    codename: "NIMBUS",
    slug: "nimbus",
    category: "ml-cv",
    date: "Apr 2026",
    start: 202604.5,
    headline: "800ms to 15ms client-side inference",
    tags: ["ML", "Full-Stack", "Cloud", "Edge AI"],
    metrics: [
      { key: true, label: "Inference latency", value: "15ms", from: "800ms", dir: "down" },
      { label: "Keypoints at 30 FPS", value: "55" },
      { label: "Translation round-trip", value: "1.5s", dir: "down" },
    ],
    stack: ["ONNX", "MediaPipe", "AWS Lambda", "DynamoDB", "API Gateway", "Amazon Bedrock", "Cognito"],
    bullets: [
      "Streamed 55 MediaPipe keypoints at 30 FPS through a browser Web Worker, keeping pose extraction off the UI thread.",
      "Cut client-side inference latency 99.98% — from 800ms to 15ms — with an ONNX-compiled TGCN model.",
      "Captioned live multi-user calls on an event-driven AWS serverless backend (9+ Lambda functions, API Gateway WebSockets, DynamoDB, S3, Cognito) feeding Amazon Bedrock for ASL-to-English translation in under 1.5s.",
    ],
    repo: "https://github.com/har-m33t/NIMBUS",
  },
  {
    id: "sixeyes",
    title: "Drone Fleet Intelligence Dashboard",
    codename: "SIX EYES",
    slug: "six-eyes",
    category: "robotics-controls",
    date: "Jun 2026",
    start: 202606,
    headline: "6 concurrent UAVs at 20Hz telemetry",
    tags: ["Robotics", "Computer Vision", "Full-Stack", "Defense"],
    metrics: [
      { label: "Concurrent UAVs", value: "6" },
      { key: true, label: "Telemetry rate", value: "20Hz" },
      { label: "Area coverage", value: "100%" },
    ],
    stack: ["React", "TypeScript", "Vite", "Zustand", "Python", "WebSockets", "Shapely", "Mapbox", "YOLOv8n"],
    bullets: [
      "Engineered a 3-tier ground control station for 6 concurrent simulated UAVs, rendering 20Hz live telemetry and video through a multi-threaded Python WebSocket backend and a React/TypeScript/Vite + Zustand frontend.",
      "Achieved 100% continuous area coverage of operator-drawn search polygons with Shapely boustrophedon path planning on a Mapbox tactical map.",
      "Delivered sub-second tactical event synthesis during flight operations by feeding YOLOv8n person detections to the Claude API.",
    ],
    repo: "https://github.com/har-m33t/six_eyes_drone_intelligence_platform",
  },
  {
    id: "tvc",
    title: "TVC Rocket Flight Simulation",
    codename: "TVC ROCKET",
    slug: "tvc-rocket",
    category: "robotics-controls",
    date: "May 2026",
    start: 202605,
    headline: "6-DOF thrust vector control on a 10ms loop",
    tags: ["Controls", "Simulation", "Defense"],
    metrics: [
      { key: true, label: "Control loop", value: "10ms" },
      { label: "GNC modules", value: "6" },
      { label: "Perturbation axes", value: "3" },
    ],
    stack: ["Python", "RocketPy", "PID", "Monte Carlo", "Pandas", "Matplotlib"],
    bullets: [
      "Developed a 6-DOF thrust-vector-control flight simulation in Python (RocketPy) on a 10ms loop, validating rate-limited PID pitch stabilization across a 10s flight profile.",
      "Architected a 6-module GNC pipeline isolating subsystems, with 100% parameterization of structural rocket configurations.",
      "Quantified structural risk with Monte Carlo simulations across 3 perturbation axes, mapping stability boundaries and trajectory dispersion with Pandas and Matplotlib.",
    ],
  },
  {
    id: "parceliq",
    title: "Parcel Risk Intelligence Platform",
    codename: "PARCELIQ",
    slug: "parceliq",
    category: "ml-cv",
    date: "Mar 2026",
    start: 202603,
    headline: "92% boundary confidence on footprint extraction",
    tags: ["ML", "Computer Vision", "Full-Stack"],
    metrics: [
      { key: true, label: "Boundary confidence", value: "92%" },
      { label: "Spatial features", value: "9" },
      { label: "Training rows", value: "2,000+" },
    ],
    stack: ["React", "Vite", "Tailwind", "Flask", "OpenCV", "Mapbox GL", "Groq", "Scikit-learn"],
    bullets: [
      "Built a hybrid ML risk engine stacking Gradient Boosting, MLP, and Logistic Regression with deterministic modeling across 9 spatial features, trained on 2,000+ rows to score property risk.",
      "Architected an 8-stage OpenCV pipeline reaching 92% boundary confidence in building-footprint extraction via HSV-based contour segmentation.",
      "Shipped a full-stack platform (React, Vite, Tailwind, Flask) with a 3D Mapbox GL dashboard of 3+ interactive layers, a Groq-powered AI chat assistant, and automated PDF reporting.",
    ],
  },
  {
    id: "f1",
    title: "F1 Pit Stop Strategy RL Model",
    codename: "F1 STRATEGY",
    slug: "f1-strategy",
    category: "ml-cv",
    date: "Jan 2026",
    start: 202601,
    headline: "DQN agent over a custom lap-by-lap MDP",
    tags: ["Reinforcement Learning", "ML", "Data Science"],
    metrics: [
      { key: true, label: "Drivers compared", value: "20" },
      { label: "Seasons ingested", value: "3" },
      { label: "Tests written", value: "50" },
    ],
    stack: ["Stable-Baselines3", "Gymnasium", "FastF1", "SQLite", "Parquet", "Streamlit", "Matplotlib"],
    bullets: [
      "Built a data pipeline ingesting 2022–2024 race lap data from the FastF1 API into SQLite/Parquet, engineering tire-degradation, lap-time trend, track-temperature, and safety-car features.",
      "Trained a Stable-Baselines3 DQN agent in a custom Gymnasium lap-by-lap MDP to pick track-specific pit windows (1-stop vs. 2-stop), benchmarked against Logistic Regression and Random Forest baselines plus heuristic and random policies.",
      "Stress-tested the agent with noise sweeps and explained decisions through Q-value logging and counterfactual analysis, backed by 50 unit and environment tests.",
      "Created 2D/3D Matplotlib visualizations and a Streamlit dashboard comparing predicted vs. actual pit strategies for 20 drivers.",
    ],
    repo: "https://github.com/har-m33t/f1__rl_pitstop_prediction_model",
  },
  {
    id: "thetatau",
    title: "Theta Tau Hybrid RC Car — Embedded Systems",
    codename: "HYBRID RC",
    slug: "hybrid-rc",
    category: "robotics-controls",
    date: "Jan 2026 — Present",
    start: 202601.5,
    headline: "STM32 control across gas-electric transitions",
    tags: ["Embedded", "Hardware", "C/C++"],
    metrics: [
      { key: true, label: "Bus protocols", value: "3" },
      { label: "Powertrain modes", value: "2" },
    ],
    stack: ["C/C++", "STM32CubeIDE", "PID", "PWM", "UART", "SPI", "I2C"],
    bullets: [
      "Programmed STM32 microcontrollers in C/C++ with STM32CubeIDE, implementing PID control loops, PWM motor control, and ECU interfacing for a hybrid gas-electric RC car.",
      "Integrated UART, SPI, and I2C protocols to interface with sensors and peripherals, including accelerometers, LCD displays, and Flash memory modules.",
      "Developed gas-to-electric and electric-to-gas transition algorithms, battery monitoring, and real-time system feedback across embedded hardware and software layers.",
    ],
  },
  {
    id: "quantum",
    title: "Quantum Particle Simulator Portfolio",
    codename: "THIS SITE",
    slug: "this-site",
    category: "full-stack",
    date: "Mar 2026",
    start: 202603.5,
    headline: "You are inside it",
    tags: ["Frontend", "3D / Graphics", "WebGL"],
    stack: ["Next.js", "React Three Fiber", "Three.js", "TypeScript", "GLSL", "Zustand", "Framer Motion"],
    bullets: [
      "Architected an interactive quantum-themed portfolio in WebGL (Next.js, React Three Fiber, TypeScript) with a navigable 3D node graph, particle system, and procedural electric-line materials.",
      "Wrote custom GLSL shader materials and a Three.js post-processing pipeline with scanline, bloom, and CRT-noise effects.",
      "Designed state-driven section navigation with Zustand and Framer Motion for seamless panel transitions.",
    ],
    live: "https://harmeet-singh.dev",
  },
  {
    id: "foundationfix",
    title: "FoundationFix — AI Foundation Shade Matching",
    codename: "FOUNDATIONFIX",
    slug: "foundationfix",
    category: "full-stack",
    date: "Nov 2025",
    start: 202511,
    headline: "30%+ better color match, sub-second pipeline",
    tags: ["Full-Stack", "Computer Vision", "IoT"],
    metrics: [
      { key: true, label: "Color-match accuracy", value: "30%+", dir: "up" },
      { label: "Skin regions", value: "10" },
      { label: "Dispense time", value: "25s", dir: "down" },
    ],
    stack: ["React", "TypeScript", "Flask", "OpenCV", "NumPy", "Raspberry Pi", "SQL"],
    bullets: [
      "Built a full-stack foundation shade-matching app (React/TypeScript, Flask REST APIs) computing optimal pigment ratios from user images with sub-1s end-to-end upload-and-processing latency, using 5s real-time polling across 3+ core endpoints.",
      "Engineered a computer vision pipeline with OpenCV Haar Cascades and geometric segmentation splitting each face into 10 skin regions for robust ROI extraction, vectorized in NumPy for constant-time processing per request.",
      "Calibrated for lighting using 24 Macbeth reference patches with top-5% luminance filtering, Tikhonov-regularized least squares, and RGB to LAB transformation, improving color-match accuracy 30%+.",
      "Integrated Raspberry Pi hardware for sub-milliliter pigment dispensing, producing on-demand blends in under 25 seconds and halving manual color-adjustment effort.",
      "Designed a secure SQL database schema with authentication to persist user profiles and shade recommendations.",
    ],
  },
  {
    id: "stock",
    title: "Machine Learning Stock Prediction Model",
    codename: "S&P FORECAST",
    slug: "sp-forecast",
    category: "data-ai",
    date: "Jan 2025",
    start: 202501,
    headline: "59% precision over 50+ years of data",
    tags: ["ML", "Data Science", "Finance"],
    metrics: [
      { key: true, label: "Precision", value: "59%" },
      { label: "Accuracy", value: "55%" },
      { label: "Years of data", value: "50+" },
    ],
    stack: ["Scikit-learn", "yFinance", "GridSearchCV", "Pandas"],
    bullets: [
      "Predicted S&P 500 movements with a RandomForestClassifier at 59% precision and 55% accuracy on 50+ years of historical data pulled with yFinance.",
      "Engineered RSI, rolling-average, and trend features and tuned the model with GridSearchCV.",
      "Designed a backtesting framework to evaluate performance over time, using ROC curve analysis to pick classification thresholds.",
    ],
  },
  {
    id: "tictactoe",
    title: "AI Tic-Tac-Toe Agent",
    codename: "MINIMAX",
    slug: "minimax",
    category: "data-ai",
    date: "Dec 2024",
    start: 202412,
    headline: "0% loss rate, 99.8% faster search",
    tags: ["AI", "Algorithms"],
    metrics: [
      { key: true, label: "Loss rate", value: "0%" },
      { label: "Compute time", value: "99.8%", dir: "down" },
    ],
    stack: ["Python", "PyGame", "Minimax", "Alpha-Beta Pruning"],
    bullets: [
      "Developed a Python Minimax agent that plays optimally against human opponents with a 0% loss rate.",
      "Added alpha-beta pruning to the recursive game-tree search, reducing computation time 99.8%.",
      "Built a command-line and PyGame interface with error handling and game-state validation, managing the board with tree data structures.",
    ],
  },
  {
    id: "twitter",
    title: "Twitter Product Sentiment Scraper",
    codename: "SENTIMENT",
    slug: "sentiment",
    category: "data-ai",
    date: "Oct 2024",
    start: 202410,
    headline: "Polarity scoring over 100+ tweets",
    tags: ["Data Science", "NLP"],
    metrics: [
      { key: true, label: "Tweets analyzed", value: "100+" },
      { label: "Sentiment classes", value: "3" },
    ],
    stack: ["Python", "Tweepy", "TextBlob", "Pandas", "Matplotlib"],
    bullets: [
      "Built an object-oriented Python pipeline with the Tweepy API to collect and clean 100+ product-related tweets, filtering out retweets, replies, hashtags, and external links.",
      "Ran TextBlob sentiment analysis to classify tweets as positive, negative, or neutral with quantified polarity scores, stored and analyzed in Pandas DataFrames.",
      "Visualized sentiment distributions and opinion trends over time with Matplotlib bar and pie charts.",
    ],
  },
];

export const SKILLS: { group: string; items: string[] }[] = [
  {
    group: "AI / ML",
    items: ["PyTorch", "TensorFlow", "Scikit-Learn", "HuggingFace", "ONNX", "TensorRT", "OpenCV", "MediaPipe", "YOLO", "LangChain", "LangGraph", "RAG", "MCP", "Claude Agent SDK", "DeepSpeed", "LoRA / Post-Training", "Instruction Tuning", "CNNs", "Stable-Baselines3", "Gymnasium", "Model Optimization"],
  },
  {
    group: "Languages",
    items: ["Python", "C/C++", "Java", "JavaScript", "TypeScript", "SQL", "R", "HTML", "CSS", "GLSL"],
  },
  {
    group: "Frameworks & Libraries",
    items: ["React", "Next.js", "Node.js", "Vite", "Tailwind CSS", "Three.js", "Flask", "FastAPI", "Prisma", "MongoDB", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Streamlit"],
  },
  {
    group: "Robotics & Embedded",
    items: ["ROS2", "ZED SDK", "NVIDIA Jetson", "STM32", "Raspberry Pi", "PID / PWM", "UART / SPI / I2C", "RocketPy", "Digital Logic"],
  },
  {
    group: "Cloud & Infrastructure",
    items: ["AWS SageMaker", "Lambda", "S3", "DynamoDB", "API Gateway", "Bedrock", "Cognito", "EC2", "Google Cloud Run", "Azure", "Docker", "Slurm", "Vercel", "Linux", "CI/CD"],
  },
  {
    group: "Tools",
    items: ["Git", "GitHub", "GitLab", "Jupyter", "VS Code", "PyCharm", "TensorBoard", "Claude Code", "Codex", "Jira", "Agile / Scrum"],
  },
];

export const PROFILE = {
  name: "Harmeet Singh",
  particleId: "HS-13",
  phone: "+1 (209) 403-5151",
  email: "harmeets130922@gmail.com",
  github: "https://github.com/har-m33t",
  githubLabel: "github.com/har-m33t",
  linkedin: "https://linkedin.com/in/harmeet-singh-uppal",
  linkedinLabel: "linkedin.com/in/harmeet-singh-uppal",
  site: "https://harmeet-singh.dev",
  location: "Irvine, CA · PST",
  school: "University of California, Irvine",
  degree: "B.S. Computer Science with Honors",
  gpa: "3.7 / 4.0",
  graduation: "June 2028",
  domains: ["Machine Learning", "Data Systems", "Software Engineering"],
  coursework: [
    "Python Series",
    "C/C++",
    "Statistics for CS",
    "Software Engineering",
    "Digital Design",
    "Computer Networks",
    "Data Structures & Algorithms",
  ],
};

/** Ongoing roles first, then most recent start. */
export const SORTED_EXPERIENCES = [...EXPERIENCES].sort((a, b) => {
  const ongoing = (e: Experience) => (e.period.includes("Present") ? 1 : 0);
  return ongoing(b) - ongoing(a) || b.start - a.start;
});
export const SORTED_PROJECTS = [...PROJECTS].sort((a, b) => b.start - a.start);

/** Projects grouped into tree folders, each sorted most-recent-first. */
export const PROJECT_TREE = CATEGORIES.map((c) => ({
  ...c,
  projects: SORTED_PROJECTS.filter((p) => p.category === c.id),
}));

export function projectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

/** Folder holding a given project, for auto-expanding the tree on deep link. */
export function categoryOfSlug(slug: string): CategoryId | undefined {
  return projectBySlug(slug)?.category;
}
