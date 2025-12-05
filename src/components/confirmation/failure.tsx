import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Failed() {
  const navigate = useNavigate();
  const [showSoundPill, setShowSoundPill] = useState(false);
  const unlockedRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // ---- Sound helpers ----
  const ensureContext = () => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)({
          latencyHint: "interactive",
        });
      } catch (e) {}
    }
    return audioCtxRef.current;
  };

  // Slightly sad/negative bell-like chime
  const playErrorTone = () => {
    const ac = ensureContext();
    if (!ac) return;
    const now = ac.currentTime + 0.02;

    const base = 554.37; // C#5
    const overtones = [
      { f: base, a: 0.45 },
      { f: base * 1.25, a: 0.2 },
      { f: base * 0.5, a: 0.12 },
    ];

    overtones.forEach(({ f, a }) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "triangle";
      o.frequency.value = f;
      o.connect(g);
      g.connect(ac.destination);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(a, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      // slight down gliss (sad effect)
      o.frequency.setValueAtTime(f * 1.04, now);
      o.frequency.exponentialRampToValueAtTime(f * 0.9, now + 0.09);
      o.start(now);
      o.stop(now + 1.3);
    });
  };

  const tryAutoplay = () => {
    const ac = ensureContext();
    if (!ac) return;

    const onSuccess = () => {
      unlockedRef.current = true;
      setShowSoundPill(false);
    };
    const onFail = () => setShowSoundPill(true);

    if (ac.state === "suspended") {
      ac.resume()
        .then(() => {
          playErrorTone();
          onSuccess();
        })
        .catch(onFail);
    } else {
      try {
        playErrorTone();
        onSuccess();
      } catch (e) {
        onFail();
      }
    }
  };

  // Auto init + retry logic + redirect
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onDom = () => tryAutoplay();
    document.addEventListener("DOMContentLoaded", onDom);
    tryAutoplay();

    const onVis = () => {
      if (!document.hidden && !unlockedRef.current) tryAutoplay();
    };
    document.addEventListener("visibilitychange", onVis, { once: true });

    const once = () => {
      if (!unlockedRef.current) tryAutoplay();
      window.removeEventListener("pointerdown", once);
      window.removeEventListener("keydown", once);
      window.removeEventListener("mousemove", once);
      window.removeEventListener("touchstart", once);
    };
    window.addEventListener("pointerdown", once, { once: true });
    window.addEventListener("keydown", once, { once: true });
    window.addEventListener("mousemove", once, { once: true });
    window.addEventListener("touchstart", once, { once: true });

    const timer = setTimeout(() => {
      navigate("/");
    }, 5000); // delay longer to let user read error

    return () => {
      document.removeEventListener("DOMContentLoaded", onDom);
      document.removeEventListener("visibilitychange", onVis);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className="min-h-dvh grid place-items-center text-white overflow-hidden p-4"
      style={{
        paddingTop: "max(12px, env(safe-area-inset-top))",
        paddingRight: "max(12px, env(safe-area-inset-right))",
        paddingBottom: "max(12px, env(safe-area-inset-bottom))",
        paddingLeft: "max(12px, env(safe-area-inset-left))",
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(255,255,255,.06) 0 2px, rgba(255,255,255,0) 2px 26px), radial-gradient(1200px 500px at 50% -300px, rgba(255,255,255,.14), transparent 60%), linear-gradient(180deg, #c62929, #9b1c1c)",
        animation: "sweep 7s linear infinite",
      }}
    >
      {/* stadium red light sweep */}
      <div
        className="fixed inset-0 pointer-events-none mix-blend-screen"
        style={{
          background:
            "linear-gradient(100deg, transparent 35%, rgba(255,255,255,.08) 50%, transparent 65%)",
          animation: "shine 7s linear infinite",
        }}
      />

      <main
        role="alert"
        aria-live="assertive"
        className="relative w-full max-w-[680px] bg-white text-[#0f172a] text-center shadow-[0_20px_50px_rgba(0,0,0,.3),_0_2px_8px_rgba(0,0,0,.12)] rounded-[clamp(16px,3vw,26px)] px-[clamp(16px,5vw,30px)] py-[clamp(20px,5vw,40px)] translate-y-[10px] opacity-0"
        style={{
          animation: "pop 700ms cubic-bezier(.2,.9,.2,1) forwards 120ms",
        }}
      >
        {/* Badge */}
        <div
          className="relative mx-auto mb-[clamp(10px,3vw,18px)] grid place-items-center rounded-full"
          style={{
            width: "clamp(80px, 22vw, 128px)",
            height: "clamp(80px, 22vw, 128px)",
            background: "radial-gradient(circle at 35% 35%, #fff, #fce7e7 70%)",
            boxShadow:
              "0 10px 26px rgba(0,0,0,.2), inset 0 0 0 6px rgba(255,40,40,.25)",
          }}
        >
          {/* pulse glow */}
          <span
            aria-hidden
            className="absolute inset-[-10px] rounded-full"
            style={{
              animation: "pulse 1100ms ease-out 360ms 2",
              boxShadow: "0 0 0 0 rgba(255,40,40,.34)",
            }}
          />

          {/* Big Cross (X) */}
          <svg
            className="block"
            style={{ width: "clamp(48px, 12vw, 72px)" }}
            viewBox="0 0 64 64"
            aria-hidden="true"
          >
            <path
              d="M20 20 L44 44 M44 20 L20 44"
              fill="none"
              stroke="#c62929"
              strokeLinecap="round"
              strokeWidth="10"
              style={{
                animation:
                  "draw 900ms ease-out forwards 260ms, glow 1200ms ease-out 260ms",
                strokeDasharray: 120,
                strokeDashoffset: 120,
              }}
            />
          </svg>
        </div>

        <h1 className="text-[clamp(20px,6vw,30px)] leading-tight mb-1 text-red-700">
          Payment Failed
        </h1>
        <p className="text-slate-600 text-[clamp(13px,4.5vw,17px)] leading-relaxed m-0">
          The transaction could not be completed. Please try again or contact
          the ground owner.
        </p>
        <motion.p
          className="mt-2 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Redirecting in 5 seconds...
        </motion.p>
      </main>

      {showSoundPill && (
        <button
          onClick={tryAutoplay}
          className="fixed left-1/2 -translate-x-1/2 font-bold text-white rounded-full px-4 py-2 shadow-[0_10px_22px_rgba(198,41,41,.35)]"
          style={{
            bottom: "max(12px, env(safe-area-inset-bottom))",
            background: "linear-gradient(180deg, #d73232, #b62424)",
            maxWidth: "calc(100vw - 24px)",
            whiteSpace: "nowrap",
          }}
        >
          Enable sound
        </button>
      )}

      <style>
        {`
        @keyframes sweep { from { background-position: 0 0, -200% 0; } to { background-position: 0 0, 200% 0; } }
        @keyframes shine { from { transform: translateX(-45%); } to { transform: translateX(45%); } }
        @keyframes pop { 0%{opacity:0; transform:translateY(12px) scale(.985)} 65%{opacity:1; transform:translateY(0) scale(1.02)} 100%{opacity:1; transform:translateY(0) scale(1)} }
        @keyframes pulse { 0%{box-shadow:0 0 0 0 rgba(255,40,40,.34)} 100%{box-shadow:0 0 0 20px rgba(255,40,40,0)} }
        @keyframes draw { to { stroke-dashoffset: 0; } }
        @keyframes glow { 50% { filter: drop-shadow(0 0 10px rgba(198,41,41,.8)); } 100% { filter: none; } }
      `}
      </style>
    </div>
  );
}

export default Failed;
