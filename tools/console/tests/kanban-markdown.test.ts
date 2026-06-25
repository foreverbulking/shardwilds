import { describe, it, expect } from 'vitest';
import { parseStory, serializeStory } from '../src/kanban/markdown';

describe('parseStory', () => {
  it('extracts frontmatter and body', () => {
    const raw = `---
story_id: STORY-040
title: Design Player Tables
status: todo
phase: "Phase 4"
epic: "EPIC-040 Identity"
created_at: 2026-06-25
updated_at: 2026-06-25
order: 0
---

# Design

Body content here.`;

    const story = parseStory(raw, '/tmp/STORY-040-design.md');
    expect(story.storyId).toBe('STORY-040');
    expect(story.title).toBe('Design Player Tables');
    expect(story.status).toBe('todo');
    expect(story.phase).toBe('Phase 4');
    expect(story.epic).toBe('EPIC-040 Identity');
    expect(story.order).toBe(0);
    expect(story.body).toContain('# Design');
    expect(story.body).toContain('Body content here.');
    expect(story.filePath).toBe('/tmp/STORY-040-design.md');
  });

  it('defaults missing optional fields', () => {
    const raw = `---
story_id: STORY-001
title: Minimal
status: done
---
body`;

    const story = parseStory(raw, '/tmp/STORY-001.md');
    expect(story.phase).toBe('');
    expect(story.epic).toBe('');
    expect(story.order).toBe(0);
  });

  it('throws on missing story_id', () => {
    const raw = `---
title: No ID
status: todo
---
body`;

    expect(() => parseStory(raw, '/tmp/x.md')).toThrow(/story_id/);
  });

  it('throws on invalid status', () => {
    const raw = `---
story_id: STORY-X
title: Bad status
status: blocked
---
body`;

    expect(() => parseStory(raw, '/tmp/x.md')).toThrow(/status/);
  });
});

describe('serializeStory', () => {
  it('round-trips parseStory output', () => {
    const original = `---
story_id: STORY-040
title: Round Trip
status: in-progress
phase: "Phase 4"
epic: "EPIC-040"
created_at: 2026-06-25
updated_at: 2026-06-25
order: 3
---

body content`;

    const story = parseStory(original, '/tmp/x.md');
    const serialized = serializeStory(story);
    const reparsed = parseStory(serialized, '/tmp/x.md');

    expect(reparsed.storyId).toBe(story.storyId);
    expect(reparsed.title).toBe(story.title);
    expect(reparsed.status).toBe(story.status);
    expect(reparsed.phase).toBe(story.phase);
    expect(reparsed.epic).toBe(story.epic);
    expect(reparsed.order).toBe(story.order);
    expect(reparsed.body.trim()).toBe(story.body.trim());
  });
});