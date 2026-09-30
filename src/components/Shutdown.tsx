import { useState } from 'react'
import { Computer3 } from '@react95/icons';
import { setAuth } from '../hooks/auth';
import { useWindows } from '../os/store/windows';
import { useShell } from '../os/store/shell';
import Dialog from '../os/ui/Dialog';
import { Button, Radio } from '../os/ui/controls';

type ShutdownOption = "shutdown" | "restart" | "restart-dos";

const OPTIONS: { value: ShutdownOption; label: string }[] = [
    { value: "shutdown", label: "Shut down the computer?" },
    { value: "restart", label: "Restart the computer?" },
    { value: "restart-dos", label: "Restart the computer in MS-DOS mode?" },
];

function Shutdown({ close }: { close: () => void }) {
    const [selected, setSelected] = useState<ShutdownOption>("shutdown");
    const logout = setAuth((state) => state.logout);
    const closeAll = useWindows((state) => state.closeAll);
    const setWelcomeOpen = useShell((state) => state.setWelcomeOpen);

    function confirm() {
        if (selected === "shutdown") {
            closeAll();
            // The next login is greeted again
            setWelcomeOpen(true);
            logout();
        }
        close();
    }

    return (
        <Dialog title="Shut Down Windows" onClose={close} className="w-[min(400px,calc(100vw-16px))]">
            <div className="flex gap-3.5 p-1">
                <Computer3 variant="32x32_4" className="shrink-0" />
                <div className="flex flex-col gap-1.5">
                    <p className="mb-1">Are you sure you want to:</p>
                    {OPTIONS.map((option) => (
                        <Radio
                            key={option.value}
                            name="shutdown"
                            checked={selected === option.value}
                            onChange={() => setSelected(option.value)}
                        >
                            {option.label}
                        </Radio>
                    ))}
                </div>
            </div>
            <div className="flex justify-center gap-1.5 mt-3">
                <Button primary onClick={confirm}>Yes</Button>
                <Button onClick={close}>No</Button>
                <Button disabled>Help</Button>
            </div>
        </Dialog>
    )
}

export default Shutdown
