import { useState, useEffect } from "react";

// Replace with your Adsterra / CPA URL
const AD_LINK = "https://draweressence.com/qcexryt1?key=4268d53c43ba7d2265c7bda09189e48a";

export default function UnlockWrapper({ children }) {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const unlockStart = sessionStorage.getItem("unlockStart");
    if (unlockStart) {
      const elapsed = Date.now() - parseInt(unlockStart, 10);
      if (elapsed >= 30000) {
        setUnlocked(true);
        sessionStorage.removeItem("unlockStart");
      } else {
        const t = setTimeout(() => {
          setUnlocked(true);
          sessionStorage.removeItem("unlockStart");
        }, 30000 - elapsed);

        return () => clearTimeout(t);
      }
    }
  }, []);

  const startUnlock = () => {
    window.open(AD_LINK, "_blank");
    const start = Date.now();
    sessionStorage.setItem("unlockStart", start.toString());

    setTimeout(() => {
      setUnlocked(true);
      sessionStorage.removeItem("unlockStart");
    }, 30000);
  };

  if (!unlocked) {
    return (
      <div className="unlock-wrapper">
        <div className="unlock-gate">
          <div className="lock-icon">
            {/* Just show lock without timer */}
            <span className="lock">🔒</span>
          </div>

          <button className="unlock-btn" onClick={startUnlock}>
            🚀 Open Ad to Unlock
          </button>

          <p className="unlock-tip">
            Tip: Allow pop-ups & disable ad-blocker for smooth unlocking.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
