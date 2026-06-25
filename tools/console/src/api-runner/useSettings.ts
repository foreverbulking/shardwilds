import { create } from 'zustand';
import { readLocal, writeLocal } from '../lib/storage';

interface SettingsState {
  baseUrl: string;
  dbName: string;
  setBaseUrl: (value: string) => void;
  setDbName: (value: string) => void;
}

const STORAGE_KEY = 'shardwilds-console:settings';

interface Persisted {
  baseUrl: string;
  dbName: string;
}

export const useSettings = create<SettingsState>((set) => {
  const persisted = readLocal<Persisted>(STORAGE_KEY, {
    baseUrl: 'http://localhost:3000',
    dbName: 'shardwilds',
  });
  return {
    baseUrl: persisted.baseUrl,
    dbName: persisted.dbName,
    setBaseUrl: (value) => {
      set((state) => {
        const next = { baseUrl: value, dbName: state.dbName };
        writeLocal(STORAGE_KEY, next);
        return next;
      });
    },
    setDbName: (value) => {
      set((state) => {
        const next = { baseUrl: state.baseUrl, dbName: value };
        writeLocal(STORAGE_KEY, next);
        return next;
      });
    },
  };
});