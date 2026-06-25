import { useEffect, useRef, useState } from 'react';

interface UseEventSourceOptions {
  onMessage: (event: { type: string; path?: string }) => void;
}

export function useEventSource(url: string, options: UseEventSourceOptions) {
  const [connected, setConnected] = useState(false);
  const callbackRef = useRef(options.onMessage);
  callbackRef.current = options.onMessage;

  useEffect(() => {
    let source: EventSource | null = null;
    let retryDelay = 1000;
    let cancelled = false;

    function connect() {
      if (cancelled) return;
      source = new EventSource(url);
      source.onopen = () => {
        retryDelay = 1000;
        setConnected(true);
      };
      source.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as { type: string; path?: string };
          callbackRef.current(data);
        } catch (parseError) {
          console.error('SSE parse error:', parseError);
        }
      };
      source.onerror = () => {
        setConnected(false);
        source?.close();
        source = null;
        if (!cancelled) {
          setTimeout(connect, retryDelay);
          retryDelay = Math.min(retryDelay * 2, 30000);
        }
      };
    }

    connect();

    return () => {
      cancelled = true;
      source?.close();
    };
  }, [url]);

  return { connected };
}