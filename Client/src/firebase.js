import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

if (typeof window !== "undefined") {
  getAnalytics(app);
}

export const auth = getAuth(app);
//console.log("PROJECT ID =>", auth.app.options.projectId);
//console.log("AUTH DOMAIN =>", auth.app.options.authDomain);

export const createRecaptcha = async (
  containerId = "recaptcha-container"
) => {
  if (typeof window === "undefined") return null;
  // Robust creation: wait for container to exist, ensure grecaptcha script loaded,
  // clear any previous verifier, then create a singleton RecaptchaVerifier.
  const waitFor = async (predicate, timeout = 1000, interval = 50) => {
    const start = Date.now();
    return new Promise((resolve) => {
      const tick = () => {
        if (predicate()) return resolve(true);
        if (Date.now() - start >= timeout) return resolve(false);
        setTimeout(tick, interval);
      };
      tick();
    });
  };

  try {
    const containerReady = await (async () => {
      if (document.getElementById(containerId)) return true;
      const ok = await waitFor(() => !!document.getElementById(containerId), 1000, 50);
      return ok;
    })();

    if (!containerReady) {
      console.error(`reCAPTCHA container '${containerId}' not found`);
      return null;
    }

    const loadRecaptchaScript = async () => {
      if (window.grecaptcha) return true;
      // inject script
      return new Promise((resolve, reject) => {
        const existing = document.querySelector('script[src*="recaptcha"]');
        if (existing) {
          // wait for grecaptcha to appear
          waitFor(() => !!window.grecaptcha, 2000, 100).then(resolve);
          return;
        }
        const s = document.createElement("script");
        s.src = "https://www.google.com/recaptcha/api.js?render=explicit";
        s.async = true;
        s.defer = true;
        s.onload = () => {
          waitFor(() => !!window.grecaptcha, 2000, 100).then((ok) => (ok ? resolve(true) : resolve(false)));
        };
        s.onerror = () => reject(new Error("Failed to load reCAPTCHA script"));
        document.head.appendChild(s);
      });
    };

    await loadRecaptchaScript().catch((e) => {
      console.warn("Could not ensure grecaptcha loaded:", e);
    });

    const container = document.getElementById(containerId);
    console.debug("createRecaptcha: container found?", !!container, "id:", containerId);
    console.debug("createRecaptcha: grecaptcha present?", !!window.grecaptcha, window.grecaptcha ? window.grecaptcha.render : undefined);
    const existingScript = document.querySelector('script[src*="recaptcha"]');
    console.debug("createRecaptcha: existing recaptcha script:", existingScript ? existingScript.src : null);

    // If a verifier already exists, return it instead of recreating to avoid
    // the "already been rendered" error from grecaptcha when called multiple times.
    if (window.recaptchaVerifier) {
      return window.recaptchaVerifier;

  // try {
  //    return window.recaptchaVerifier;
  // } 

  // window.recaptchaVerifier = null;

  // const container = document.getElementById(containerId);
  // if (container) {
  //   container.innerHTML = "";
  // }
}


    // Create verifier using container id (string) which is supported by firebase SDK
    try {
      // Some Firebase versions expect `auth` as the first argument.
      // Use `auth` first to be compatible and because we clear previous verifier earlier.
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        containerId,
        {
          size: "invisible",
          callback: () => {
            console.log("reCAPTCHA solved");
          },
          "expired-callback": () => {
            console.log("reCAPTCHA expired");
          },
        },
        
      );
      //  await window.recaptchaVerifier.render();
    } catch (createErr) {
      console.error("RecaptchaVerifier construction failed:", createErr);
      return null;
    }

    return window.recaptchaVerifier;
  } catch (err) {
    console.error("createRecaptcha error:", err);
    return null;
  }
};