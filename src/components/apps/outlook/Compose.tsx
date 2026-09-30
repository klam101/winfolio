import { useState } from 'react'
import { TextArea, TextField } from '../../../os/ui/controls'
import { Copy, Cut, Paste, Sendmail2001, Wab321011 } from '@react95/icons'
import MenuBar, { type Menu } from '../../chrome/MenuBar'
import { Toolbar, ToolbarButton, ToolbarSeparator } from '../../chrome/Toolbar'
import StatusBar from '../../chrome/StatusBar'
import MessageBox, { type MessageBoxButton } from '../../chrome/MessageBox'
import { OWNER } from '../../../data/mail'
import { useMail } from '../../../hooks/mail'
import { useOpenWindow, useWindows } from '../../../os/store/windows'
import { WINDOW_IDS } from '../../../windows/ids'

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Box = {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  buttons: MessageBoxButton[];
};

function Compose() {
  const openWindow = useOpenWindow();
  const closeWindow = useWindows((s) => s.closeWindow);
  const { draft, updateDraft, clearDraft, addSent } = useMail();
  const [honeypot, setHoneypot] = useState("");
  const [sending, setSending] = useState(false);
  const [box, setBox] = useState<Box | null>(null);

  const close = () => closeWindow(WINDOW_IDS.compose);
  const dismiss = () => setBox(null);

  function openMailApp() {
    const params = new URLSearchParams({ subject: draft.subject, body: draft.body });
    window.location.href = `mailto:${OWNER.email}?${params.toString().replace(/\+/g, "%20")}`;
    setBox(null);
  }

  function showFallback(message: string) {
    setBox({
      title: "Outlook Express",
      type: "error",
      message,
      buttons: [{ value: "Use Email App", onClick: openMailApp }, { value: "Cancel", onClick: dismiss }],
    });
  }

  function warn(message: string) {
    setBox({ title: "Outlook Express", type: "warning", message, buttons: [{ value: "OK", onClick: dismiss }] });
  }

  function sentSuccessfully() {
    addSent({ from: draft.from, subject: draft.subject, body: draft.body });
    const replyTo = draft.from;
    clearDraft();
    setBox({
      title: "Message Sent",
      type: "info",
      message: `Your message has been sent. Kevin will reply to ${replyTo}.`,
      buttons: [{ value: "OK", onClick: close }],
    });
  }

  async function send() {
    if (!EMAIL_PATTERN.test(draft.from.trim())) {
      warn("Please enter your email address in the From box so Kevin can reply.");
      return;
    }
    if (!draft.body.trim()) {
      warn("Your message is empty. Please write something before sending.");
      return;
    }
    // Bots fill in the hidden field; pretend it worked and drop the message
    if (honeypot) {
      sentSuccessfully();
      return;
    }
    if (!FORMSPREE_ID) {
      showFallback("Outlook Express isn't connected to a mail server. Send this message with your own email app instead?");
      return;
    }

    setSending(true);
    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: draft.from.trim(),
          _subject: draft.subject || "Message from your portfolio",
          message: draft.body,
        }),
      });
      if (!response.ok) throw new Error(`Formspree responded ${response.status}`);
      sentSuccessfully();
    } catch {
      showFallback("Outlook Express could not send your message. Send it with your own email app instead?");
    } finally {
      setSending(false);
    }
  }

  const menus: Menu[] = [
    { label: "File", items: [{ label: "Send Message", onClick: send }, { divider: true }, { label: "Close", onClick: close }] },
    { label: "Edit", items: [{ label: "Undo" }, { divider: true }, { label: "Cut" }, { label: "Copy" }, { label: "Paste" }] },
    { label: "View", items: [{ label: "All Headers" }] },
    { label: "Insert", items: [{ label: "File Attachment..." }, { label: "Signature" }] },
    { label: "Tools", items: [{ label: "Address Book...", onClick: () => openWindow(WINDOW_IDS.addressBook) }, { label: "Spelling..." }] },
    { label: "Help", items: [{ label: "Contents and Index" }] },
  ];

  return (
    <div className="app compose">
      <MenuBar menus={menus}/>
      <Toolbar>
        <ToolbarButton label="Send" icon={<Sendmail2001 variant="32x32_4" width={24} height={24}/>} onClick={sending ? undefined : send}/>
        <ToolbarSeparator/>
        <ToolbarButton title="Cut" icon={<Cut variant="16x16_4"/>}/>
        <ToolbarButton title="Copy" icon={<Copy variant="16x16_4"/>}/>
        <ToolbarButton title="Paste" icon={<Paste variant="16x16_4"/>}/>
        <ToolbarSeparator/>
        <ToolbarButton label="Addresses" icon={<Wab321011 variant="32x32_4" width={24} height={24}/>} onClick={() => openWindow(WINDOW_IDS.addressBook)}/>
      </Toolbar>
      <form className="compose-form" onSubmit={(e) => { e.preventDefault(); void send(); }}>
        <div className="compose-fields">
          <label>To:</label>
          <div className="compose-to sunken"><span className="compose-chip">{OWNER.name}</span></div>
          <label htmlFor="compose-from">From:</label>
          <TextField
            id="compose-from"
            type="email"
            placeholder="your.email@example.com"
            autoComplete="email"
            value={draft.from}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDraft({ from: e.target.value })}
          />
          <label htmlFor="compose-subject">Subject:</label>
          <TextField
            id="compose-subject"
            value={draft.subject}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDraft({ subject: e.target.value })}
          />
        </div>
        <input
          className="compose-honeypot"
          name="_gotcha"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
        <TextArea
          className="compose-body"
          aria-label="Message"
          placeholder="Write your message to Kevin here..."
          value={draft.body}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateDraft({ body: e.target.value })}
        />
      </form>
      <StatusBar cells={[sending ? "Sending message..." : "Ready"]}/>
      {box && <MessageBox title={box.title} message={box.message} type={box.type} buttons={box.buttons} onClose={dismiss}/>}
    </div>
  );
}

export default Compose
