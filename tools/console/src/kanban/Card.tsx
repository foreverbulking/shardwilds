import { Badge } from '../components/ui/badge';
import type { Story } from './types';

interface Props {
  story: Story;
  onClick: () => void;
}

export function Card({ story, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-md border border-border bg-card hover:bg-accent transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-mono text-muted-foreground">{story.storyId}</span>
        <Badge variant="outline" className="text-xs">
          {story.status}
        </Badge>
      </div>
      <h4 className="font-medium text-sm mb-1">{story.title}</h4>
      {story.epic && <p className="text-xs text-muted-foreground">{story.epic}</p>}
    </button>
  );
}