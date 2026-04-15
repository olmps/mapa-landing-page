interface FacebookPixelEventOptions {
  eventID?: string;
}

interface FacebookPixelEvent {
  (command: "init", pixelId: string): void;
  (command: "track", event: string, params?: Record<string, unknown>, options?: FacebookPixelEventOptions): void;
  (command: "trackCustom", event: string, params?: Record<string, unknown>, options?: FacebookPixelEventOptions): void;
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
