"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const TARGET = "Anderson Magalhaes";
const CHARS = "!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [text, setText] = useState(" ".repeat(TARGET.length));

  useEffect(() => {
    // If user has seen the loader recently, skip it
    if (typeof window !== "undefined") {
      const seen = sessionStorage.getItem("am-loader-seen");
      if (seen) {
        setVisible(false);
        return;
      }
      sessionStorage.setItem("am-loader-seen", "1");
    }

    const totalDuration = 1800;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / totalDuration, 1);
      const revealCount = Math.floor(progress * TARGET.length);

      let next = "";
      for (let i = 0; i < TARGET.length; i++) {
        if (i < revealCount) {
          next += TARGET[i];
        } else if (TARGET[i] === " ") {
          next += " ";
        } else {
          next += randomChar();
        }
      }
      setText(next);

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setText(TARGET);
        setTimeout(() => setVisible(false), 400);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] bg-brand-black flex items-center justify-center"
        >
          <div className="text-center">
            <p className="text-brand-emerald font-mono text-xs sm:text-sm mb-4 tracking-widest">
              {"> DECRYPTING..."}
            </p>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-mono font-bold text-brand-orange tracking-tight">
              {text}
            </h1>
            <div className="mt-6 h-1 w-48 sm:w-64 mx-auto bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-brand-orange to-brand-emerald"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
