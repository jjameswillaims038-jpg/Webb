import { useState, useEffect } from "react";

/*
 UnlockWrapper usage:
 Wrap any tool page content with <UnlockWrapper>{content}</UnlockWrapper>
 It opens an ad link in a new tab, stores timestamp and unlocks after 20s (persisted in sessionStorage).
 Replace AD_LINK with your Adsterra/CPA URL when ready.
*/
const AD_LINK = "https://draweressence.com/qcexryt1?key=4268d53c43ba7d2265c7bda09189e48a";

export default function UnlockWrapper({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [count, setCount] = useState(20);

  useEffect(() => {
    const unlockStart = sessionStorage.getItem("unlockStart");
    if (unlockStart) {
      const elapsed = Date.now() - parseInt(unlockStart, 10);
      if (elapsed >= 20000) {
        setUnlocked(true);
        sessionStorage.removeItem("unlockStart");
      } else {
        const remain = Math.ceil((20000 - elapsed) / 1000);
        setCount(remain);
        const t = setTimeout(() => {
          setUnlocked(true);
          sessionStorage.removeItem("unlockStart");
        }, 20000 - elapsed);
        const interval = setInterval(() => {
          setCount(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => { clearTimeout(t); clearInterval(interval); };
      }
    }
  }, []);

  const unlock = () => {
    window.open(AD_LINK, "_blank");
    const start = Date.now();
    sessionStorage.setItem("unlockStart", start.toString());
    setCount(20);
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) { clearInterval(interval); setUnlocked(true); sessionStorage.removeItem("unlockStart"); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  if (!unlocked) {
    return (
      <div className="unlock-wrapper">
        <div className="unlock-card">
          <h2>🔒 Unlock Nightforge Tool</h2>
          <p>open ad and click <strong>{count}s</strong> to unlock this tool.</p>
          <div className="unlock-actions">
            <button className="btn-primary" onClick={unlock}>🚀 VIEW AD TO UNLOCK</button>
            <button className="btn-ghost" onClick={() => { alert("If you want a demo without ads, contact Mr Dev."); }}>Demo / Contact</button>
          </div>
          <small className="unlock-note">Tip: disable adblocker and allow popups for best results.</small>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
