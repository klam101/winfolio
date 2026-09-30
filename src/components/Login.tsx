import { useState } from 'react'
import { Keys } from '@react95/icons';
import { setAuth } from '../hooks/auth'
import Dialog from '../os/ui/Dialog';
import { Button, TextField } from '../os/ui/controls';

// Classic "safe to turn off" screen; clicking anywhere boots back to the login dialog
function PoweredOff({ onPowerOn }: { onPowerOn: () => void }) {
    return (
        <div
            onClick={onPowerOn}
            className="fixed inset-0 z-2000 flex flex-col items-center justify-center p-4 text-center bg-black text-[#ff8c00] cursor-pointer"
        >
            <p className="text-[28px]">It's now safe to turn off your computer.</p>
            <p className="mt-4 text-[#aaa]">(Click anywhere to turn it back on)</p>
        </div>
    )
}

function Login() {
    const login = setAuth((state) => state.login);
    const [poweredOff, setPoweredOff] = useState(false);

    if (poweredOff) return <PoweredOff onPowerOn={() => setPoweredOff(false)} />;

    return (
        <Dialog title="Welcome to Windows" className="w-[min(480px,calc(100vw-16px))]">
            <form className="flex gap-3 p-1" onSubmit={(e) => { e.preventDefault(); login(); }}>
                <Keys width={48} height={48} className="shrink-0" />
                <div className="flex-1 min-w-0 flex flex-col gap-2.5">
                    <p>Type a user name and password to log on to Windows.</p>
                    <label className="flex items-center gap-2">
                        <span className="w-17.5 shrink-0">User name:</span>
                        <TextField defaultValue="Guest" className="flex-1 min-w-0" autoComplete="off" />
                    </label>
                    <label className="flex items-center gap-2">
                        <span className="w-17.5 shrink-0">Password:</span>
                        <TextField type="password" defaultValue="guest" className="flex-1 min-w-0" autoComplete="off" />
                    </label>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                    <Button primary type="submit" autoFocus>OK</Button>
                    <Button onClick={() => setPoweredOff(true)}>Shut Down</Button>
                </div>
            </form>
        </Dialog>
    )
}

export default Login
