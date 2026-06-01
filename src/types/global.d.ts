interface Window {
  Trustpilot?: {
    loadFromElement: (element: HTMLElement, reload?: boolean) => void;
  };
  gtag?: (...args: unknown[]) => void;
}
