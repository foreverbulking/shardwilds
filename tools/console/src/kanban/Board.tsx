import { Card } from './Card';
import type { Story, ColumnId } from './types';

interface Props {
  stories: Story[];
  onSelect: (story: Story) => void;
}

const COLUMNS: { id: ColumnId; label: string }[] = [
  { id: 'todo', label: 'Todo' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

export function Board({ stories, onSelect }: Props) {
  const byColumn = COLUMNS.map((column) => ({
    ...column,
    stories: stories
      .filter((story) => story.status === column.id)
      .sort((a, b) => a.order - b.order),
  }));

  return (
    <div className="grid grid-cols-4 gap-4 p-4 h-full overflow-auto">
      {byColumn.map((column) => (
        <div key={column.id} className="flex flex-col bg-secondary/30 rounded-md p-3">
          <h3 className="text-sm font-semibold mb-3 flex items-center justify-between">
            <span>{column.label}</span>
            <span className="text-xs text-muted-foreground">{column.stories.length}</span>
          </h3>
          <div className="flex flex-col gap-2 overflow-auto">
            {column.stories.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-4 text-center">No stories</p>
            ) : (
              column.stories.map((story) => (
                <Card key={story.storyId} story={story} onClick={() => onSelect(story)} />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}