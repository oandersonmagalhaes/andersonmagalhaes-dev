"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./LoadingScreen.module.css";

const TARGET = "Anderson Magalhaes";
const CHARS = "!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [text, setText] = useState(" ".repeat(TARGET.length));

  useEffect(() => {
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
          className={styles.overlay}
        >
          <div className={styles.inner}>
            <p className={styles.label}>{"> DECRYPTING..."}</p>
            <h1 className={styles.title}>{text}</h1>
            <div className={styles.bar}>
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                className={styles.barFill}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
