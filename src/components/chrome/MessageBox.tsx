import { User2, User3, User4, User5 } from '@react95/icons'
import Dialog from '../../os/ui/Dialog'
import { Button } from '../../os/ui/controls'

export type MessageBoxButton = { value: string; onClick: () => void };

type MessageType = 'error' | 'info' | 'question' | 'warning';

// The classic Win95 message box icons
const ICONS: Record<MessageType, typeof User5> = { info: User5, question: User3, warning: User2, error: User4 };

interface MessageBoxProps {
  title: string;
  message: string;
  type?: MessageType;
  buttons: MessageBoxButton[];
  onClose: () => void;
}

function MessageBox({ title, message, type = 'info', buttons, onClose }: MessageBoxProps) {
  const Icon = ICONS[type];
  return (
    <Dialog title={title} onClose={onClose} className="w-max max-w-[min(440px,calc(100vw-16px))]">
      <div className="flex items-center gap-3.5 p-1.5 pr-3">
        <Icon variant="32x32_4" className="shrink-0" />
        <p className="select-text">{message}</p>
      </div>
      <div className="flex justify-center gap-1.5 mt-2">
        {buttons.map((button, i) => (
          <Button key={button.value} primary={i === 0} autoFocus={i === 0} onClick={button.onClick}>{button.value}</Button>
        ))}
      </div>
    </Dialog>
  );
}

export default MessageBox
