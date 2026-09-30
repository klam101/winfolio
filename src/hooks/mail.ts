import { create } from "zustand";

export type SentMessage = { id: string; from: string; subject: string; body: string; date: Date };
export type Draft = { from: string; subject: string; body: string };

const EMPTY_DRAFT: Draft = { from: "", subject: "", body: "" };

// Session-only mail state: what the visitor has read, deleted, drafted and sent
interface MailStore {
  readIds: string[];
  deletedIds: string[];
  sent: SentMessage[];
  draft: Draft;
  markRead: (id: string) => void;
  markAllRead: (ids: string[]) => void;
  deleteMessage: (id: string) => void;
  addSent: (message: Omit<SentMessage, "id" | "date">) => void;
  updateDraft: (changes: Partial<Draft>) => void;
  clearDraft: () => void;
}

export const useMail = create<MailStore>((set) => ({
  readIds: [],
  deletedIds: [],
  sent: [],
  draft: EMPTY_DRAFT,
  markRead: (id) => set((s) => (s.readIds.includes(id) ? s : { readIds: [...s.readIds, id] })),
  markAllRead: (ids) => set((s) => ({ readIds: [...new Set([...s.readIds, ...ids])] })),
  deleteMessage: (id) => set((s) => ({ deletedIds: [...s.deletedIds, id] })),
  addSent: (message) => set((s) => ({
    sent: [...s.sent, { ...message, id: `sent-${s.sent.length + 1}`, date: new Date() }],
  })),
  updateDraft: (changes) => set((s) => ({ draft: { ...s.draft, ...changes } })),
  clearDraft: () => set({ draft: EMPTY_DRAFT }),
}));

export const hasDraft = (draft: Draft) => Boolean(draft.subject || draft.body);
