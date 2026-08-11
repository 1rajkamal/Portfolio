export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'ai-ml' | 'data-science' | 'web-dev';
  description: string;
  points: string[];
  tags: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export interface SkillCategory {
  name: string;
  iconName: string;
  skills: { name: string; level?: string; color?: string }[];
}

export interface Certification {
  title: string;
  issuer: string;
  date?: string;
  pdfUrl?: string;
  imageUrl?: string;
  badgeColor?: string;
}

export interface Hackathon {
  title: string;
  description: string;
  image: string;
  tag: string;
  accentColor: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  location?: string;
  period: string;
  type: string;
  points: string[];
  technologies: string[];
}

export const PORTFOLIO_DATA = {
  personal: {
    name: "Raj Kamal",
    shortName: "Raj Kamal",
    title: "Full Stack Developer & Data Analyst",
    headline: "Focused on Solving Real-World Problems · From Curiosity to Creation",
    tagline: "No roadmap. No guidance. Just curiosity.",
    bio: "Passionate developer and data analyst focused on building real-world digital products. I work across full stack development, problem solving, generative AI, and data analytics to create meaningful, high-impact experiences.",
    location: "India",
    email: "rajkamal9741@gmail.com",
    portfolioUrl: "https://rajkamall.me",
    githubUrl: "https://github.com/1rajkamal",
    linkedinUrl: "https://www.linkedin.com/in/raj-kamal-490176291",
    profileImage: "/me.jpg",
    resumePdf: "/Raj_kamal.pdf",
    stats: [
      { value: "6+", label: "Real-World Projects" },
      { value: "8+", label: "Industry Certifications" },
      { value: "3", label: "Innovation Hackathons" },
      { value: "100%", label: "Problem-Solving Passion" }
    ]
  },

  skills: [
    {
      name: "Programming Languages",
      iconName: "Code2",
      skills: [
        { name: "Python", color: "#38bdf8" },
        { name: "Java", color: "#f97316" },
        { name: "C++", color: "#60a5fa" },
        { name: "SQL", color: "#a855f7" },
        { name: "JavaScript", color: "#facc15" },
        { name: "HTML/CSS", color: "#fb7185" }
      ]
    },
    {
      name: "Data Science & Analytics",
      iconName: "BarChart3",
      skills: [
        { name: "Pandas", color: "#10b981" },
        { name: "NumPy", color: "#06b6d4" },
        { name: "Matplotlib", color: "#ec4899" },
        { name: "Exploratory Data Analysis (EDA)", color: "#818cf8" },
        { name: "Data Cleaning & Wrangling", color: "#f59e0b" },
        { name: "Data Visualization", color: "#34d399" }
      ]
    },
    {
      name: "AI, ML & Chatbots",
      iconName: "BrainCircuit",
      skills: [
        { name: "Scikit-Learn", color: "#f97316" },
        { name: "Generative AI & LLMs", color: "#6366f1" },
        { name: "Natural Language Processing (NLP)", color: "#a855f7" },
        { name: "Chatbot Development", color: "#06b6d4" },
        { name: "Sentiment Analysis", color: "#ec4899" }
      ]
    },
    {
      name: "Web Development & Databases",
      iconName: "Layers",
      skills: [
        { name: "HTML5 / CSS3", color: "#fb7185" },
        { name: "JavaScript", color: "#facc15" },
        { name: "Flask", color: "#94a3b8" },
        { name: "Streamlit", color: "#ff4b4b" },
        { name: "MySQL / DBMS", color: "#0284c7" }
      ]
    },
    {
      name: "Tools & Design",
      iconName: "Wrench",
      skills: [
        { name: "Git & GitHub", color: "#f43f5e" },
        { name: "Figma (UI/UX)", color: "#a855f7" },
        { name: "Jupyter Notebook", color: "#f97316" },
        { name: "VS Code", color: "#0284c7" }
      ]
    }
  ] as SkillCategory[],

  projects: [
    {
      id: "alpha-talk",
      title: "Alpha Talk — Custom Reply Chatbot",
      subtitle: "Smart Automated Conversational AI Platform",
      category: "ai-ml",
      description: "Smart chatbot that gives custom replies based on your message text. Engineered with dynamic NLP text processing logic and real-time response generation.",
      points: [
        "Implemented intelligent message parsing algorithms to generate context-aware automated replies.",
        "Built responsive conversational components with session management and user authentication.",
        "Designed clean user interface for frictionless real-time messaging."
      ],
      tags: ["Python", "NLP", "Chatbot", "AI Tools", "Web Application"],
      image: "/alpha.png",
      githubUrl: "https://github.com/1rajkamal/Alpha_Talk",
      liveUrl: "https://alpha-kamal.onrender.com/login",
      featured: true
    },
    {
      id: "loan-predict",
      title: "LoanPredict Ai — Predict Loan Approval",
      subtitle: "Fast & Accurate ML Risk Prediction Engine",
      category: "data-science",
      description: "A Flask-based Machine Learning application that predicts loan approval using applicant details with fast and accurate results.",
      points: [
        "Trained Scikit-learn predictive models on applicant financial records and demographic data.",
        "Performed feature engineering, missing value imputation, and correlation optimization.",
        "Integrated Flask web backend with clean responsive UI for instant eligibility scoring."
      ],
      tags: ["Python", "Machine Learning", "Scikit-Learn", "Flask", "Predictive AI"],
      image: "/loan.png",
      githubUrl: "https://github.com/1rajkamal/loan-predictor",
      liveUrl: "https://loan-predictor-ns16.onrender.com/",
      featured: true
    },
    {
      id: "moodsense",
      title: "MoodSense — Text-Based Mood Detection",
      subtitle: "AI Sentiment & Emotion Prediction Model",
      category: "ai-ml",
      description: "AI model that analyzes the text you type and predicts whether you're Happy 😊 or Sad 😔 based on your message content.",
      points: [
        "Engineered natural language tokenization and emotion classification pipelines.",
        "Classifies text input into instant polarity and emotional metrics.",
        "Visualizes emotional confidence breakdowns in real time."
      ],
      tags: ["Python", "NLP", "Machine Learning", "Sentiment Analysis", "AI Model"],
      image: "/mood.png",
      githubUrl: "https://github.com/1rajkamal/MoodSense",
      liveUrl: "https://moodsense-1.onrender.com",
      featured: true
    },
    {
      id: "expense-tracker",
      title: "Expense-Tracker — Track Your Expenses",
      subtitle: "Personal Finance & Spending Analytics Manager",
      category: "web-dev",
      description: "A modern and responsive Expense Tracker web application that allows users to record income and expenses, analyze spending patterns, and manage personal finances efficiently.",
      points: [
        "Features real-time income and expense tracking with categorical breakdown.",
        "Interactive visual charts and analytics to monitor monthly budgets and saving targets.",
        "Optimized mobile-friendly UI with persistent local data storage."
      ],
      tags: ["JavaScript", "HTML5", "CSS3", "Finance Manager", "Analytics"],
      image: "/expense-tracker.png",
      githubUrl: "https://github.com/1rajkamal/Expense-Tracker",
      liveUrl: "https://1rajkamal.github.io/Expense-Tracker/",
      featured: true
    },
    {
      id: "how-fast-you-are",
      title: "How Fast You Are — Typing Reflex Speed Game",
      subtitle: "Real-Time Word Speed & Accuracy Challenge",
      category: "web-dev",
      description: "A fast-paced game that tests how quickly you can type falling words and tracks your speed, accuracy, and performance in real time.",
      points: [
        "Real-time kinetic word rendering with dynamic speed curves and difficulty scaling.",
        "Calculates Words Per Minute (WPM), accuracy percentages, and score multipliers.",
        "Designed engaging sound cues and high-score tracking."
      ],
      tags: ["JavaScript", "Interactive Game", "HTML5 Canvas", "Reflex Speed", "UI/UX"],
      image: "/fast.png",
      githubUrl: "https://github.com/1rajkamal/how-fast-you-are",
      liveUrl: "https://1rajkamal.github.io/how-fast-you-are/",
      featured: true
    },
    {
      id: "responsive-coaching",
      title: "Responsive Coaching Website — M.K Bright Path",
      subtitle: "Tuition Enquiry & Class Information Platform",
      category: "web-dev",
      description: "A fully responsive tuition enquiry website providing complete information from LKG to Class 10, curriculum insights, and fee structure.",
      points: [
        "Structured intuitive course discovery from LKG to Class 10 with clear concept clarity modules.",
        "Built enquiry submission workflows with instant client-side validation.",
        "Fully responsive modern layout designed for both mobile and desktop screens."
      ],
      tags: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "EdTech"],
      image: "/brightpath.png",
      githubUrl: "https://github.com/1rajkamal/brightpath",
      liveUrl: "https://1rajkamal.github.io/brightpath/",
      featured: true
    }
  ] as Project[],

  certifications: [
    {
      title: "Python Certification",
      issuer: "Cisco Networking Academy",
      pdfUrl: "/cispy.pdf",
      imageUrl: "/cispy.png",
      badgeColor: "#38bdf8"
    },
    {
      title: "Java Certification",
      issuer: "Oracle",
      pdfUrl: "/java.pdf",
      imageUrl: "/java.png",
      badgeColor: "#f97316"
    },
    {
      title: "Python Specialist",
      issuer: "Red Hat",
      pdfUrl: "/redpy.pdf",
      imageUrl: "/redpy.png",
      badgeColor: "#ef4444"
    },
    {
      title: "IT Specialist: HTML & CSS",
      issuer: "Certiport",
      pdfUrl: "/html.pdf",
      imageUrl: "/html.png",
      badgeColor: "#ec4899"
    },
    {
      title: "Database Management Systems (DBMS)",
      issuer: "Infosys Springboard",
      pdfUrl: "/cc.pdf",
      badgeColor: "#8b5cf8"
    },
    {
      title: "Programming Essentials in C (CLA)",
      issuer: "C++ Institute / Cisco",
      badgeColor: "#60a5fa"
    },
    {
      title: "Exploratory Data Analysis in Python",
      issuer: "Udemy",
      pdfUrl: "/EDA.pdf",
      badgeColor: "#10b981"
    },
    {
      title: "SQL Problem Solving",
      issuer: "HackerRank",
      badgeColor: "#22c55e"
    }
  ] as Certification[],

  hackathons: [
    {
      title: "MHTECHIN Innovation Challenge 2024",
      description: "Participated in the MHTECHIN Innovation Challenge 2024 organised by MHTECHIN.",
      image: "/mh.jpg",
      tag: "Participation",
      accentColor: "#8b5cf8"
    },
    {
      title: "InnovWar Hackathon",
      description: "Participated in InnovWar Hackathon organised by GN Group of Institutes, Greater Noida, Uttar Pradesh.",
      image: "/war.jpg",
      tag: "Participation",
      accentColor: "#38bdf8"
    },
    {
      title: "EY Techathon 5.0",
      description: "Participated in Round 1: Executive Summary Submission of EY Techathon 5.0 organised by EY.",
      image: "/ey.jpg",
      tag: "Round 1",
      accentColor: "#f59e0b"
    }
  ] as Hackathon[],

  education: [
    {
      degree: "B.Tech in Computer Science and Engineering (Data Science)",
      institution: "Bachelor of Technology",
      details: "Specializing in Data Science, Machine Learning algorithms, Data Structures, Exploratory Data Analysis, Database Management, and Full Stack Development."
    }
  ],

  experience: [
    {
      role: "Full Stack Developer & Data Analyst",
      company: "Independent Software & Open Source Projects",
      period: "2023 – Present",
      type: "Software Development & Analytics",
      points: [
        "Developed custom conversational chatbots and NLP sentiment classification engines.",
        "Built responsive web applications including tuition enquiry platforms and personal finance managers.",
        "Conducted extensive Exploratory Data Analysis (EDA) and data wrangling with Pandas and NumPy.",
        "Earned 8+ industry certifications from Cisco, Oracle, Red Hat, Certiport, and Infosys."
      ],
      technologies: ["Python", "Pandas", "Scikit-Learn", "NLP", "JavaScript", "HTML/CSS", "SQL", "Git"]
    }
  ] as ExperienceItem[],

  // 3D World Landmarks configuration
  world3d: {
    spawnPoint: [0, 1.5, 12] as [number, number, number],
    zones: [
      {
        id: "about",
        label: "About Me",
        hint: "Curiosity to Creation",
        position: [0, 0, -32] as [number, number, number],
        radius: 11,
        color: "#818cf8",
        panel: {
          eyebrow: "About Raj Kamal",
          title: "Full Stack Developer & Data Analyst",
          body: [
            "Focused on solving real-world problems through clean code, data analysis, and intelligent software.",
            "Specializing in Computer Science & Data Science with hands-on skills in Python, Java, C++, and Web Development.",
            "From curiosity to creation: building tools that simplify complexity and create real value."
          ],
          chips: ["Full Stack Developer", "Data Analyst", "Python & AI Enthusiast"],
          cta: { label: "View Full Profile", href: "#about" }
        }
      },
      {
        id: "skills",
        label: "Skills Tower",
        hint: "Smash the Physics Skill Blocks!",
        position: [-36, 0, -10] as [number, number, number],
        radius: 12,
        color: "#38bdf8",
        panel: {
          eyebrow: "Tech Stack & Tools",
          title: "What I Build & Analyze With",
          body: [
            "Every block in this 3D tower is part of my technical arsenal. Drive your hovercraft right into it to knock it down!"
          ],
          chips: ["Python", "Java", "C++", "JavaScript", "Pandas", "NumPy", "Scikit-Learn", "SQL", "HTML/CSS", "Git", "Figma"],
          cta: { label: "Explore Detailed Skills", href: "#skills" }
        }
      },
      {
        id: "projects",
        label: "3D Project Gallery",
        hint: "Curved Amphitheater of Live Apps",
        position: [34, 0, -16] as [number, number, number],
        radius: 14,
        color: "#ec4899",
        panel: {
          eyebrow: "Featured Projects",
          title: "Chatbots, Web Apps & ML Models",
          body: [
            "From Alpha Talk AI Chatbot to LoanPredict Ai, MoodSense, Expense-Tracker, How Fast You Are, and M.K Bright Path Coaching Platform. Explore each screen!"
          ],
          chips: ["Alpha Talk", "LoanPredict Ai", "MoodSense", "Expense-Tracker", "How Fast You Are", "M.K Bright Path"],
          cta: { label: "Open Projects Showcase", href: "#projects" }
        }
      },
      {
        id: "experience",
        label: "Hackathons & Journey",
        hint: "Climb the Achievement Pillars",
        position: [30, 0, 26] as [number, number, number],
        radius: 12,
        color: "#10b981",
        panel: {
          eyebrow: "Hackathons & Milestones",
          title: "MHTECHIN, InnovWar & EY Techathon 5.0",
          body: [
            "Participated in MHTECHIN Innovation Challenge 2024, InnovWar Hackathon, and EY Techathon 5.0.",
            "Certified by Cisco (Python), Oracle (Java), Red Hat, Certiport, and Infosys."
          ],
          chips: ["MHTECHIN 2024", "InnovWar Hackathon", "EY Techathon 5.0"],
          cta: { label: "View Certificates & Hackathons", href: "#hackathons" }
        }
      },
      {
        id: "contact",
        label: "Contact Portal",
        hint: "Step into the Teleport Portal",
        position: [-28, 0, 30] as [number, number, number],
        radius: 11,
        color: "#f59e0b",
        panel: {
          eyebrow: "Get in Touch",
          title: "Let's Build Something Together!",
          body: [
            "Have a software project, collaboration, or opportunity? Let's connect!",
            "Email: rajkamal9741@gmail.com · Portfolio: rajkamall.me"
          ],
          chips: ["Open for Projects", "Full Stack Roles", "Data Analysis"],
          cta: { label: "Send Email Direct", href: "mailto:rajkamal9741@gmail.com", external: true }
        }
      }
    ],
    dataOrbLocations: [
      [14, 2, -6],
      [-16, 2.1, 16],
      [4, 3.2, 34],
      [-44, 1.9, 22],
      [46, 2.1, 6],
      [-8, 2, -50],
      [22, 3.4, -42],
      [-40, 3.1, -38]
    ] as [number, number, number][],
    launchPadLocations: [
      [12, 0, 14],
      [-20, 0, -2],
      [8, 0, -20],
      [-6, 0, 42],
      [40, 0, 34]
    ] as [number, number, number][],
    pyramidPropLocations: [
      { at: [18, 22] as [number, number], hue: 210 },
      { at: [-14, -24] as [number, number], hue: 280 },
      { at: [-32, 8] as [number, number], hue: 160 },
      { at: [44, -4] as [number, number], hue: 330 },
      { at: [2, -14] as [number, number], hue: 40 },
      { at: [-46, -18] as [number, number], hue: 190 }
    ],
    skillBlocks: [
      { label: "Python", color: "#38bdf8" },
      { label: "Java", color: "#f97316" },
      { label: "C++", color: "#60a5fa" },
      { label: "JavaScript", color: "#facc15" },
      { label: "Pandas", color: "#10b981" },
      { label: "Scikit-Learn", color: "#f97316" },
      { label: "SQL", color: "#a855f7" },
      { label: "NLP", color: "#ec4899" },
      { label: "HTML/CSS", color: "#fb7185" },
      { label: "NumPy", color: "#3b82f6" },
      { label: "Git", color: "#f43f5e" },
      { label: "EDA", color: "#14b8a6" }
    ]
  }
};
