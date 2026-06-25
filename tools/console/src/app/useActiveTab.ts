import { create } from 'zustand';
import { readLocal, writeLocal } from '../lib/storage';

export type TabId = 'kanban' | 'architecture' | 'api-runner';

interface ActiveTabState {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

const STORAGE_KEY = 'shardwilds-console:active-tab';

export const useActiveTab = create<ActiveTabState>((set) => ({
  activeTab: readLocal<TabId>(STORAGE_KEY, 'kanban'),
  setActiveTab: (tab) => {
    writeLocal(STORAGE_KEY, tab);
    set({ activeTab: tab });
  },
}));