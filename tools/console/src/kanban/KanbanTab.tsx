import { useState } from 'react';
import { Board } from './Board';
import { CardExpanded } from './CardExpanded';
import { useStories } from './useStories';
import type { Story } from './types';

export function KanbanTab() {
  const { stories, loading, error, refresh } = useStories();
  const [selected, setSelected] = useState<Story | null>(null);

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading stories…</div>;
  }
  if (error) {
    return (
      <div className="p-6 text-destructive">
        <h3 className="font-bold">Failed to load stories</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }
  if (stories.length === 0) {
    return (
      <div className="p-6 text-muted-foreground italic">
        No stories yet — drop your first STORY-XXX markdown in <code>docs/stories/</code>.
      </div>
    );
  }

  return (
    <>
      <Board stories={stories} onSelect={setSelected} />
      <CardExpanded story={selected} onClose={() => setSelected(null)} onSaved={refresh} />
    </>
  );
}