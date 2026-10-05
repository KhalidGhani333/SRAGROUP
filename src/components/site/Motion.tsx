import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import type { Lang } from "@/i18n/routes";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Subtle fade-and-rise. By default it plays when scrolled into view;
 * `immediate` plays on mount (for above-the-fold hero content).
 */
export function Reveal({
  children,
  delay = 0,
  className,
  immediate = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const target = { opacity: 1, y: 0 };
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      {...(immediate
        ? { animate: target }
        : { whileInView: target, viewport: { once: true, margin: "-60px" } })}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Headline that rises word by word from behind a mask. */
export function RevealText({
  text,
  as: Tag = "h1",
  className,
  delay = 0,
  immediate = true,
}: {
  text: string;
  as?: "h1" | "h2" | "p";
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const MotionTag = motion[Tag];
  return (
    <MotionTag
      className={className}
      aria-label={text}
      initial="hidden"
      {...(immediate
        ? { animate: "show" }
        : { whileInView: "show", viewport: { once: true, margin: "-60px" } })}
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: reduce ? { y: 0 } : { y: "105%" },
              show: { y: 0, transition: { duration: 0.9, ease } },
            }}
          >
            {word}
            {i < words.length - 1 && " "}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/** Infinite horizontal ticker. Content is duplicated once for a seamless loop. */
export function Marquee({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="animate-marquee flex w-max hover:[animation-play-state:paused]">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Number that counts up from zero the first time it enters the viewport.
 * Server-rendered with the final value so crawlers and no-JS visitors see the real figure.
 */
export function CountUp({
  value,
  decimals = 0,
  suffix = "",
  lang,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  lang: Lang;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const format = (n: number) =>
    new Intl.NumberFormat(lang === "it" ? "it-IT" : "en-GB", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(n) + suffix;

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    if (!inView) {
      el.textContent = format(0);
      return;
    }
    const controls = animate(0, value, {
      duration: 2,
      ease,
      onUpdate: (n) => {
        el.textContent = format(n);
      },
    });
    return () => controls.stop();
    // format depends only on lang/decimals/suffix, which are covered below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value, decimals, suffix, lang]);

  return (
    <span ref={ref} className="tabular-nums">
      {format(value)}
    </span>
  );
}
