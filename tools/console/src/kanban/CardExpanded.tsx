import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { serializeStory } from './markdown';
import type { Story, Status } from './types';

interface Props {
  story: Story | null;
  onClose: () => void;
  onSaved: () => void;
}

const STATUSES: Status[] = ['todo', 'in-progress', 'review', 'done'];

export function CardExpanded({ story, onClose, onSaved }: Props) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<Status>('todo');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (story) {
      setTitle(story.title);
      setStatus(story.status);
      setBody(story.body);
      setError(null);
    }
  }, [story]);

  useEffect(() => {
    if (!story) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void save();
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, status, body]);

  async function save() {
    if (!story) return;
    if (title === story.title && status === story.status && body === story.body) return;
    setSaving(true);
    setError(null);
    try {
      const serialized = serializeStory({
        storyId: story.storyId,
        title,
        status,
        phase: story.phase,
        epic: story.epic,
        body,
        order: story.order,
      });
      const response = await fetch(
        `/api/console/stories/${encodeURIComponent(story.storyId)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ raw: serialized }),
        },
      );
      if (!response.ok) {
        const errorBody = (await response.json()) as { error?: string };
        throw new Error(errorBody.error ?? `HTTP ${response.status}`);
      }
      onSaved();
    } catch (saveError) {
      setError((saveError as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (!story) return null;

  return (
    <Dialog open={!!story} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm">{story.storyId}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value as Status)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              {STATUSES.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">Body</Label>
            <textarea
              id="body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={12}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {saving ? 'Saving…' : 'Saved'}
            </span>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}