import { useEffect, useState, useCallback } from 'react';
import { parseStory } from './markdown';
import type { Story } from './types';

interface StoriesResponse {
  file: string;
  path: string;
  raw: string;
}

export function useStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/console/stories');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const items = (await response.json()) as StoriesResponse[];
      const parsed = items
        .map((item) => {
          try {
            return parseStory(item.raw, item.path);
          } catch (parseError) {
            console.error(`Failed to parse ${item.file}:`, parseError);
            return null;
          }
        })
        .filter((story): story is Story => story !== null);
      setStories(parsed);
      setError(null);
    } catch (fetchError) {
      setError((fetchError as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { stories, loading, error, refresh };
}