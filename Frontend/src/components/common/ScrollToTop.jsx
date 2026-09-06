import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Resets document scrolling for ordinary client-side route changes while
 * preserving native hash navigation and browser Back/Forward restoration.
 */
export default function ScrollToTop() {
  const { pathname, hash, key } = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef(new Map());
  const activeKey = useRef(key);
  const firstRender = useRef(true);

  useEffect(() => {
    const recordPosition = () => {
      positions.current.set(activeKey.current, window.scrollY);
    };

    window.addEventListener("scroll", recordPosition, { passive: true });
    return () => window.removeEventListener("scroll", recordPosition);
  }, []);

  useEffect(() => {
    if (!("scrollRestoration" in window.history)) return undefined;

    const previousSetting = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousSetting;
    };
  }, []);

  useLayoutEffect(() => {
    activeKey.current = key;

    if (firstRender.current) {
      firstRender.current = false;
      return undefined;
    }

    if (hash) return undefined;

    const top =
      navigationType === "POP" ? positions.current.get(key) ?? 0 : 0;

    window.scrollTo(0, top);
    const frame = window.requestAnimationFrame(() => window.scrollTo(0, top));

    return () => window.cancelAnimationFrame(frame);
  }, [hash, key, navigationType, pathname]);

  return null;
}
