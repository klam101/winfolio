import { useEffect } from "react";
import { setAuth } from "./hooks/auth";
import Login from "./components/Login";
import WindowManager from "./components/WindowManager";
import Desktop from "./os/components/Desktop";
import Taskbar from "./os/components/Taskbar";
import ContextMenuHost from "./os/components/ContextMenuHost";
import WelcomeDialog from "./os/components/WelcomeDialog";
import { useDisplaySettings } from "./os/store/settings";
import { useShell } from "./os/store/shell";
import { applyScheme } from "./os/schemes";
import { asset } from "./utils/asset";

function App() {
  const authenticated = setAuth((state) => state.authenticated);
  const welcomeOpen = useShell((s) => s.welcomeOpen);
  const schemeId = useDisplaySettings((s) => s.schemeId);

  // The window color scheme restyles everything, the login dialog included
  useEffect(() => applyScheme(schemeId), [schemeId]);

  if (!authenticated) {
    return (
      <div className="fixed inset-0 bg-desktop">
        <img src={asset("logo.png")} alt="" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 max-w-[80vw]" />
        <Login />
      </div>
    );
  }

  return (
    <>
      <Desktop />
      <WindowManager />
      <Taskbar />
      <ContextMenuHost />
      {welcomeOpen && <WelcomeDialog />}
    </>
  );
}

export default App
