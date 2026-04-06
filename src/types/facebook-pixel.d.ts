interface FacebookPixelEvent {
  (command: "init", pixelId: string): void;
  (command: "track", event: string, params?: Record<string, unknown>): void;
  (command: "trackCustom", event: string, params?: Record<string, unknown>): void;
}

interface Window {
  fbq: FacebookPixelEvent & {
    callMethod?: Function;
    queue?: unknown[];
    loaded?: boolean;
    version?: string;
    push?: Function;
  };
}
