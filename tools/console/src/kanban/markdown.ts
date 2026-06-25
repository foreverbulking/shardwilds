import matter from 'gray-matter';
import type { Story, StoryInput, Status } from './types';

const VALID_STATUSES: Status[] = ['todo', 'in-progress', 'review', 'done'];

function isStatus(value: unknown): value is Status {
  return typeof value === 'string' && VALID_STATUSES.includes(value as Status);
}

export function parseStory(raw: string, filePath: string): Story {
  const parsed = matter(raw);
  const data = parsed.data as Record<string, unknown>;

  if (typeof data.story_id !== 'string' || data.story_id.length === 0) {
    throw new Error('Missing required frontmatter field: story_id');
  }
  if (typeof data.title !== 'string') {
    throw new Error('Missing required frontmatter field: title');
  }
  if (!isStatus(data.status)) {
    throw new Error(`Invalid status: must be one of ${VALID_STATUSES.join(', ')}`);
  }

  return {
    storyId: data.story_id,
    title: data.title,
    status: data.status,
    phase: typeof data.phase === 'string' ? data.phase : '',
    epic: typeof data.epic === 'string' ? data.epic : '',
    createdAt: typeof data.created_at === 'string' ? data.created_at : '',
    updatedAt: typeof data.updated_at === 'string' ? data.updated_at : '',
    order: typeof data.order === 'number' ? data.order : 0,
    body: parsed.content,
    filePath,
  };
}

export function serializeStory(story: StoryInput): string {
  const today = new Date().toISOString().slice(0, 10);
  const frontmatter: Record<string, unknown> = {
    story_id: story.storyId,
    title: story.title,
    status: story.status,
    phase: story.phase,
    epic: story.epic,
    created_at: today,
    updated_at: today,
    order: story.order,
  };
  return matter.stringify(story.body, frontmatter);
}