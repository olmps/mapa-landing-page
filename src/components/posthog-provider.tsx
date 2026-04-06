"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { posthog, initPostHog } from "@/lib/posthog";

// Captures pageviews on every navigation and identifies users by email param.
export function PostHogProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initPostHog();
      initialized.current = true;
    }
  }, []);

  // Track pageviews on route changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    posthog.capture("$pageview", { $current_url: window.location.origin + url });
  }, [pathname, searchParams]);

  // Identify user by email param (from Beehiiv UTM links)
  useEffect(() => {
    const email = searchParams.get("email");
    if (!email) return;

    const utmProperties: Record<string, string> = {};
    const utmKeys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ];
    utmKeys.forEach((key) => {
      const value = searchParams.get(key);
      if (value) utmProperties[key] = value;
    });

    posthog.identify(email, { email, ...utmProperties });
  }, [searchParams]);

  return null;
}
