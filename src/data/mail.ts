import { WINDOW_IDS } from "../windows/ids";

// Messages in the Outlook Express inbox, written from Kevin to the visitor.
// minutesAgo sets the Received time relative to when the page was opened, so dates never go stale.

export type InboxMessage = {
  id: string;
  subject: string;
  minutesAgo: number;
  body: string[];
  links?: { label: string; url: string }[];
  windows?: { label: string; id: string }[];
};

export const OWNER = { name: "Kevin Lam", email: "kevinlam718@gmail.com" };

export const inbox: InboxMessage[] = [
  {
    id: "welcome",
    subject: "Welcome! Thanks for stopping by",
    minutesAgo: 2,
    body: [
      "Hi there,",
      "Thanks for booting up my portfolio. Everything on the desktop is a program you can open:",
      "• Resume.doc opens my resume in Word (File > Save As PDF gets you a copy)",
      "• Projects plays my projects in Media Player",
      "• About Me is my AIM buddy info",
      "If you'd like to get in touch, click Compose Message and it will land in my real inbox.",
      "Kevin",
    ],
    windows: [
      { label: "Open Resume.doc", id: WINDOW_IDS.resume },
      { label: "Open Projects", id: WINDOW_IDS.projects },
      { label: "Open About Me", id: WINDOW_IDS.about },
    ],
  },
  {
    id: "reach",
    subject: "How to reach me",
    minutesAgo: 60,
    body: [
      "The fastest way is Compose Message right here. You can also find me at:",
    ],
    links: [
      { label: "kevinlam718@gmail.com", url: "mailto:kevinlam718@gmail.com" },
      { label: "linkedin.com/in/kevinylam", url: "https://linkedin.com/in/kevinylam" },
      { label: "github.com/klam101", url: "https://github.com/klam101" },
    ],
  },
  {
    id: "stack",
    subject: "What I work with",
    minutesAgo: 60 * 24,
    body: [
      "Right now I'm a Software QA Tester at Eleos Technologies, running regression, manual and exploratory testing on their Android and iOS driver app, which 17,000+ truck drivers use every day.",
      "Before that I led development of a full-stack training platform for NIWC Atlantic (TypeScript, React, Node.js, Tailwind CSS), with REST APIs on AWS Lambda and API Gateway and a RAG recommendation pipeline on AWS Bedrock and DynamoDB.",
      "I also spent a year at Itron building enterprise tools with C#, MudBlazor, T-SQL and LINQ for 30,000+ deployed smart meters.",
      "On my own time I build full-stack web apps, like Sunset, a banking platform on Next.js with Plaid and Appwrite.",
    ],
    windows: [{ label: "Open Projects", id: WINDOW_IDS.projects }],
  },
  {
    id: "site",
    subject: "About this site",
    minutesAgo: 60 * 24 * 3,
    body: [
      "This desktop is built from scratch with React, TypeScript, Vite and Tailwind CSS: its own window manager, taskbar, Start menu and control panels, with zustand for state. The icons come from @react95/icons.",
      "Winamp is Webamp, a faithful open-source Winamp 2.9 by Jordan Eldredge. Its playlist is from netBloc Vol. 24 on Free Music Archive, used under each artist's Creative Commons license.",
      "The source is on GitHub if you want to poke around.",
    ],
    links: [
      { label: "github.com/klam101/winfolio", url: "https://github.com/klam101/winfolio" },
      { label: "webamp.org", url: "https://webamp.org" },
    ],
  },
];
