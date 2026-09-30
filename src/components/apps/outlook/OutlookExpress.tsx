import { useEffect, useState, type ReactNode } from 'react'
import { Button } from '../../../os/ui/controls'
import { FileDelete, Folder, FolderOpen, Mail, Mailnews20, Sendmail2001, Wab321011 } from '@react95/icons'
import MenuBar, { type Menu } from '../../chrome/MenuBar'
import { Toolbar, ToolbarButton, ToolbarSeparator } from '../../chrome/Toolbar'
import StatusBar from '../../chrome/StatusBar'
import MessageBox from '../../chrome/MessageBox'
import { inbox, OWNER } from '../../../data/mail'
import { hasDraft, useMail } from '../../../hooks/mail'
import { useOpenWindow, useWindows } from '../../../os/store/windows'
import { WINDOW_IDS } from '../../../windows/ids'

type FolderId = 'inbox' | 'outbox' | 'sent' | 'deleted' | 'drafts';

const FOLDERS: { id: FolderId; label: string }[] = [
  { id: 'inbox', label: 'Inbox' },
  { id: 'outbox', label: 'Outbox' },
  { id: 'sent', label: 'Sent Items' },
  { id: 'deleted', label: 'Deleted Items' },
  { id: 'drafts', label: 'Drafts' },
];

type Row = {
  id: string;
  kind: 'inbox' | 'sent' | 'draft';
  from: string;
  to: string;
  subject: string;
  date: Date;
  unread: boolean;
  body: ReactNode;
};

// Inbox times are relative to page load so the messages always look fresh
const loadedAt = Date.now();

const formatDate = (date: Date) =>
  `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;

const bigIcon = { width: 24, height: 24 };

function OutlookExpress() {
  const openWindow = useOpenWindow();
  const closeWindow = useWindows((s) => s.closeWindow);
  const { readIds, deletedIds, sent, draft, markRead, markAllRead, deleteMessage, updateDraft } = useMail();
  const [folder, setFolder] = useState<FolderId>('inbox');
  const [selectedId, setSelectedId] = useState<string | null>('welcome');
  const [box, setBox] = useState<{ title: string; message: string } | null>(null);

  // The welcome message starts open, so it counts as read
  useEffect(() => markRead('welcome'), [markRead]);

  const inboxRows = (deleted: boolean): Row[] =>
    inbox
      .filter((m) => deletedIds.includes(m.id) === deleted)
      .map((m) => ({
        id: m.id,
        kind: 'inbox',
        from: OWNER.name,
        to: 'You',
        subject: m.subject,
        date: new Date(loadedAt - m.minutesAgo * 60_000),
        unread: !readIds.includes(m.id),
        body: (
          <>
            {m.body.map((line, i) => <p key={i}>{line}</p>)}
            {m.links && (
              <ul>{m.links.map((l) => <li key={l.url}><a href={l.url} target="_blank" rel="noreferrer">{l.label}</a></li>)}</ul>
            )}
            {m.windows && (
              <div className="flex gap-2" style={{ flexWrap: 'wrap', marginTop: 8 }}>
                {m.windows.map((w) => <Button key={w.id} onClick={() => openWindow(w.id)}>{w.label}</Button>)}
              </div>
            )}
          </>
        ),
      }));

  const rowsByFolder: Record<FolderId, Row[]> = {
    inbox: inboxRows(false),
    deleted: inboxRows(true),
    outbox: [],
    sent: sent.map((m) => ({
      id: m.id, kind: 'sent', from: m.from, to: OWNER.name, subject: m.subject || '(no subject)', date: m.date, unread: false,
      body: <p style={{ whiteSpace: 'pre-wrap' }}>{m.body}</p>,
    })),
    drafts: hasDraft(draft) ? [{
      id: 'draft', kind: 'draft', from: draft.from || 'You', to: OWNER.name, subject: draft.subject || '(no subject)', date: new Date(), unread: false,
      body: <p style={{ whiteSpace: 'pre-wrap' }}>{draft.body}</p>,
    }] : [],
  };

  const rows = rowsByFolder[folder];
  const selected = rows.find((r) => r.id === selectedId) ?? null;
  const unreadCount = rowsByFolder.inbox.filter((r) => r.unread).length;

  function goToFolder(id: FolderId) {
    setFolder(id);
    setSelectedId(null);
  }

  function selectRow(row: Row) {
    setSelectedId(row.id);
    if (row.kind === 'inbox') markRead(row.id);
  }

  function reply() {
    if (!selected || selected.kind !== 'inbox') return;
    updateDraft({ subject: `Re: ${selected.subject}` });
    openWindow(WINDOW_IDS.compose);
  }

  function remove() {
    if (!selected || folder !== 'inbox') return;
    deleteMessage(selected.id);
    setSelectedId(null);
  }

  const sendReceive = () => setBox({ title: "Outlook Express", message: "No new messages. To reach Kevin, click Compose Message." });
  const canReply = selected?.kind === 'inbox';
  const canDelete = Boolean(selected) && folder === 'inbox';

  const menus: Menu[] = [
    { label: "File", items: [{ label: "New Message", onClick: () => openWindow(WINDOW_IDS.compose) }, { divider: true }, { label: "Close", onClick: () => closeWindow(WINDOW_IDS.contact) }] },
    { label: "Edit", items: [
      { label: "Delete", onClick: canDelete ? remove : undefined },
      { label: "Mark All as Read", onClick: () => markAllRead(inbox.map((m) => m.id)) },
    ]},
    { label: "View", items: [{ label: "Columns..." }, { label: "Layout..." }] },
    { label: "Go", items: FOLDERS.map((f) => ({ label: f.label, onClick: () => goToFolder(f.id) })) },
    { label: "Tools", items: [{ label: "Send and Receive", onClick: sendReceive }, { label: "Address Book...", onClick: () => openWindow(WINDOW_IDS.addressBook) }] },
    { label: "Compose", items: [{ label: "New Message", onClick: () => openWindow(WINDOW_IDS.compose) }, { label: "Reply to Author", onClick: canReply ? reply : undefined }] },
    { label: "Help", items: [{ label: "About Outlook Express", onClick: () => setBox({ title: "About Outlook Express", message: "Kevin's mailbox. Messages you send from Compose go straight to his real inbox." }) }] },
  ];

  return (
    <div className="app oe">
      <MenuBar menus={menus}/>
      <Toolbar>
        <ToolbarButton label="Compose Message" icon={<Sendmail2001 variant="32x32_4" {...bigIcon}/>} onClick={() => openWindow(WINDOW_IDS.compose)}/>
        <ToolbarSeparator/>
        <ToolbarButton label="Reply" icon={<Mail variant="32x32_4" {...bigIcon}/>} onClick={canReply ? reply : undefined}/>
        <ToolbarButton label="Delete" icon={<FileDelete variant="32x32_4" {...bigIcon}/>} onClick={canDelete ? remove : undefined}/>
        <ToolbarSeparator/>
        <ToolbarButton label="Send/Recv" icon={<Mailnews20 variant="32x32_4" {...bigIcon}/>} onClick={sendReceive}/>
        <ToolbarButton label="Address Book" icon={<Wab321011 variant="32x32_4" {...bigIcon}/>} onClick={() => openWindow(WINDOW_IDS.addressBook)}/>
      </Toolbar>
      <div className="oe-body">
        <div className="oe-folders sunken">
          <div className="oe-folder-root">Outlook Express</div>
          <div className="oe-folder-root" style={{ paddingLeft: 12 }}><FolderOpen variant="16x16_4"/> Local Folders</div>
          {FOLDERS.map((f) => {
            const count = f.id === 'inbox' ? unreadCount : 0;
            return (
              <div
                key={f.id}
                className={`list-row oe-folder${folder === f.id ? ' selected' : ''}`}
                onClick={() => goToFolder(f.id)}
              >
                {f.id === 'inbox' ? <Mail variant="16x16_4"/> : <Folder variant="16x16_4"/>}
                <span style={{ fontWeight: count ? 'bold' : undefined }}>{f.label}{count ? ` (${count})` : ''}</span>
              </div>
            );
          })}
        </div>

        <div className="oe-main">
          <div className="oe-list sunken">
            <div className="oe-row oe-head">
              <span>{folder === 'sent' || folder === 'drafts' ? 'To' : 'From'}</span><span>Subject</span><span>Received</span>
            </div>
            {rows.length === 0 && <div className="oe-empty">There are no items in this view.</div>}
            {rows.map((row) => (
              <div
                key={row.id}
                className={`list-row oe-row${row.id === selectedId ? ' selected' : ''}${row.unread ? ' unread' : ''}`}
                onClick={() => selectRow(row)}
                onDoubleClick={() => { if (row.kind === 'draft') openWindow(WINDOW_IDS.compose); }}
              >
                <span><Mail variant="16x16_4"/> {row.kind === 'inbox' ? row.from : row.to}</span>
                <span>{row.subject}</span>
                <span>{formatDate(row.date)}</span>
              </div>
            ))}
          </div>

          <div className="oe-preview sunken">
            {selected ? (
              <>
                <div className="oe-preview-head">
                  <div><strong>From:</strong> {selected.from}</div>
                  <div><strong>Date:</strong> {formatDate(selected.date)}</div>
                  <div><strong>To:</strong> {selected.to}</div>
                  <div><strong>Subject:</strong> {selected.subject}</div>
                </div>
                <div className="oe-preview-body">{selected.body}</div>
              </>
            ) : (
              <div className="oe-empty">There is no message selected.</div>
            )}
          </div>
        </div>
      </div>
      <StatusBar cells={[`${rows.length} message(s), ${folder === 'inbox' ? unreadCount : 0} unread`, "Working Online"]}/>
      {box && (
        <MessageBox title={box.title} message={box.message} buttons={[{ value: "OK", onClick: () => setBox(null) }]} onClose={() => setBox(null)}/>
      )}
    </div>
  );
}

export default OutlookExpress
