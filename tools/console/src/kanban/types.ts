export type Status = 'todo' | 'in-progress' | 'review' | 'done';
export type ColumnId = Status;

export interface Story {
  storyId: string;
  title: string;
  status: Status;
  phase: string;
  epic: string;
  createdAt: string;
  updatedAt: string;
  order: number;
  body: string;
  filePath: string;
}

export interface StoryInput {
  storyId: string;
  title: string;
  status: Status;
  phase: string;
  epic: string;
  body: string;
  order: number;
}