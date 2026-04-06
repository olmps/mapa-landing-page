import posthog from "posthog-js";

export function initPostHog() {
  if (typeof window === "undefined") return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;

  const host =
    process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

  posthog.init(key, {
    api_host: host,
    // Cookieless mode — no consent banner needed
    persistence: "memory",
    // Capture pageviews manually via PostHogPageview component
    capture_pageview: false,
    capture_pageleave: true,
  });
}

export { posthog };
