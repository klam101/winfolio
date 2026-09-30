// Web version of public/resume.pdf, shown in the Word window and reused by the AIM profile.
// Wrap words in **double asterisks** to bold them. The phone number is left out of the web page on purpose.

export type Job = {
  id: string;
  org: string;
  // Short name for the AIM buddy list
  short: string;
  role: string;
  date: string;
  location: string;
  bullets: string[];
};

export const resume = {
  name: "Kevin Lam",
  contact: [
    { label: "kevinlam718@gmail.com", url: "mailto:kevinlam718@gmail.com" },
    { label: "github.com/klam101", url: "https://github.com/klam101" },
    { label: "linkedin.com/in/kevinylam", url: "https://linkedin.com/in/kevinylam" },
  ],
  education: [
    {
      school: "Clemson University",
      degree: "Bachelor of Science in Computer Science, Minor in Business Administration",
      date: "Class of 2026",
      gpa: "GPA: 3.50/4.0",
      coursework: "Object Oriented Programming, Data Structures, Algorithms, Operating Systems, Data Science, Artificial Intelligence",
    },
  ],
  experience: [
    {
      id: "eleos",
      org: "Eleos Technologies",
      short: "Eleos",
      role: "Software Quality Assurance Tester",
      date: "Jan 2026 - Present",
      location: "Clemson, SC",
      bullets: [
        "Executed **Regression Testing** across **3** releases of Eleos' Android and iOS driver app, used for document scanning and navigation by **17,000+** truck drivers, identifying and triaging defects before deployment to prevent costly post-release issues",
        "Performed **Manual** and **Exploratory Testing** on new and existing features across both platforms, uncovering **100+** edge cases and usability issues that reduced the post-release defect rate by **50%** and strengthened overall release confidence",
        "Collaborated with developers to reproduce, document, prioritize, and verify software defects using **Linear**, reducing average resolution time by **25%** and improving release readiness across multiple sprint cycles",
      ],
    },
    {
      id: "niwc",
      org: "NIWC Atlantic - Clemson Capstone",
      short: "NIWC Atlantic",
      role: "Software Engineer Intern",
      date: "Aug 2025 - Dec 2025",
      location: "Clemson, SC",
      bullets: [
        "Led development of a full-stack training platform for NIWC Atlantic using **TypeScript**, **React**, **Node.js**, and **Tailwind CSS**, delivering an **MVP** for onboarding and upskilling U.S. Navy engineers under the Department of Defense",
        "Built **REST APIs** in **TypeScript** using **AWS Lambda** and **API Gateway** to connect the front-end to a serverless back-end",
        "Implemented an AI-driven **RAG pipeline** using **AWS Bedrock**, **S3**, **Lambda**, **API Gateway**, and **DynamoDB** to deliver personalized, context-aware training recommendations, cutting the time to find relevant material by **30%**",
        "Took ownership of requirements left undefined after an earlier design phase delivered only partial UI specs by working directly with NIWC Atlantic's project manager to clarify scope and align a four-person team around a unified plan",
      ],
    },
    {
      id: "itron",
      org: "Itron Inc.",
      short: "Itron",
      role: "Software Engineer Intern",
      date: "Jan 2024 - Dec 2024",
      location: "West Union, SC",
      bullets: [
        "Enhanced Itron's global platform by utilizing **C#**, **MudBlazor**, and **T-SQL**, tracking **30,000+** deployed smart meters, building automated job-assignment tooling that cut meter location and status-check time across job sites by over **70%**",
        "Automated daily diagnostic reporting by integrating **Azure** and **Microsoft APIs**, delivering real-time performance summaries and system health metrics to multiple stakeholders, reducing manual reporting effort by **15%** across the team",
        "Optimized meter inventory queries using **LINQ**, improving dashboard and report load times by **50%** for field engineering teams",
        "Participated in an **Agile** environment with weekly stand-ups, sprint planning, and Azure DevOps for version control and CI/CD, which contributed to **36** on-time sprint releases over the course of the internship",
      ],
    },
  ] as Job[],
  projects: [
    {
      name: "Sunset",
      subtitle: "Online Banking Platform",
      link: { label: "GitHub", url: "https://github.com/klam101/sunset" },
      bullets: [
        "Built a full-stack banking platform on **Next.js 14** (**App Router**, **SSR**, **server actions**) enabling users to securely link and view multiple bank accounts, observe real-time transactions, and execute peer-to-peer transfers across various linked accounts",
        "Integrated **Plaid's** banking **API** to securely link accounts and sync live balance and transaction data in real time",
        "Implemented **Appwrite** for authentication, database, and storage, and **Sentry** for application monitoring and session replay",
        "Used **React Hook Form** and **Zod** for type-safe, validated multi-step form flows, and **shadcn/ui** with **Tailwind CSS** to deliver a clean, responsive, accessible, and polished user interface across devices",
      ],
    },
  ],
  skills: [
    { group: "Languages", items: "C/C++, C#, Python, Java, JavaScript, TypeScript, T-SQL, PL/SQL" },
    { group: "Technologies", items: "Git, Linux, Windows, AWS, Node.js, Next.js, React, ASP.NET, MSSQL, Oracle DBMS, LINQ" },
    { group: "AI-Assisted Development", items: "Ollama, Claude, ChatGPT, GitHub Copilot, Cursor, Gemini, DeepSeek" },
  ],
};
