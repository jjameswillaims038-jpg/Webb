import { useState, useEffect } from "react";

// Replace with your Adsterra / CPA URL
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
        const interval = setInterval(() => setCount(p => Math.max(0, p - 1)), 1000);
        return () => { clearTimeout(t); clearInterval(interval); };
      }
    }
  }, []);

  const startUnlock = () => {
    window.open(AD_LINK, "_blank");
    const start = Date.now();
    sessionStorage.setItem("unlockStart", start.toString());
    setCount(20);
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setUnlocked(true);
          sessionStorage.removeItem("unlockStart");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (!unlocked) {
    return (
      <div className="unlock-wrapper">
        <div className="unlock-gate">
          <div className="lock-icon">
            {/* Animated padlock countdown */}
            <span className="lock">🔒</span>
            <span className="timer">{count}s</span>
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
