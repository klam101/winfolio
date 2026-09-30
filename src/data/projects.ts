// Add a project here and it shows up in the Media Player playlist.
// Screenshots and demo videos go in public/projects/ and are referenced by file name,
// e.g. images: ["winfolio-1.png"], video: "winfolio-demo.mp4" (a video plays instead of the screenshots)

export type Project = {
  id: string;
  name: string;
  summary: string;
  description: string[];
  tech: string[];
  images?: string[];
  video?: string;
  github?: string;
  demo?: string;
};

export const projects: Project[] = [
  {
    id: "sunset",
    name: "Sunset",
    summary: "A personal finance and banking dashboard.",
    description: [
      "A banking dashboard where users connect real bank accounts through Plaid Link, see balances across all linked banks, browse a searchable, categorized transaction history with a spending breakdown chart, and send ACH transfers between accounts through Dwolla.",
      "Built as a full-stack Next.js App Router app with Server Actions, deployed on Vercel, with Appwrite for authentication and the database. Bank data itself is never stored: Plaid supplies live account and transaction data, and Dwolla handles moving funds.",
      "Includes form validation with React Hook Form and Zod, a responsive UI with a collapsible sidebar and mobile navigation, and Sentry error monitoring across client, server, and edge runtimes.",
    ],
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Plaid API", "Dwolla API", "Appwrite", "Chart.js", "Zod", "Sentry", "Vercel"],
    images: ["sunset-demo.png"],
    github: "https://github.com/klam101/sunset",
    demo: "https://sunset-rk1r.vercel.app",
  },
  {
    id: "winfolio",
    name: "Winfolio",
    summary: "This site: a Windows 95 desktop portfolio.",
    description: [
      "A portfolio website styled as a Windows 95 desktop, with draggable windows, a working taskbar and start menu, and a login and shutdown flow.",
      "Window state (open windows, stacking order, maximize) is managed in a zustand store, with a registry so desktop icons, the start menu and folders can all open the same windows.",
    ],
    tech: ["React", "TypeScript", "Vite", "Zustand", "React95"],
    github: "https://github.com/klam101/winfolio",
    demo: "https://klam101.github.io/winfolio/",
  },
];
