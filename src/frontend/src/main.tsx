import ReactDOM from "react-dom/client";
import App from "./App";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import "../index.css";

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};

/**
 * Synchronously extract caffeineAdminToken from the URL hash and store it in
 * sessionStorage BEFORE React renders anything. This prevents useActor from
 * calling clearParamFromHash() during query execution, which mutates browser
 * history mid-render and causes TanStack Router to hang indefinitely.
 *
 * After this block runs, getSecretParameter() will always find the token in
 * sessionStorage and will never need to touch the URL hash.
 */
(function extractAdminTokenEarly() {
  try {
    const hash = window.location.hash;
    if (!hash) return;

    // Token may appear as:
    //   #caffeineAdminToken=xxx           (bare hash)
    //   #?caffeineAdminToken=xxx          (hash with leading ?)
    //   #/some/path?caffeineAdminToken=xxx (hash path + query)
    const tokenMatch = hash.match(/caffeineAdminToken=([^&]+)/);
    if (tokenMatch?.[1]) {
      const token = decodeURIComponent(tokenMatch[1]);
      sessionStorage.setItem("caffeineAdminToken", token);

      // Clean the token from the URL without mutating router state
      try {
        const cleanHash = hash.replace(/[?&]?caffeineAdminToken=[^&]*/g, "");
        const newUrl =
          window.location.pathname +
          window.location.search +
          (cleanHash && cleanHash !== "#" ? cleanHash : "");
        window.history.replaceState(null, "", newUrl || "/");
      } catch {
        // Non-critical — ignore if replaceState fails
      }
    }
  } catch {
    // Non-critical — ignore any errors during early extraction
  }
})();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <InternetIdentityProvider>
    <App />
  </InternetIdentityProvider>,
);
