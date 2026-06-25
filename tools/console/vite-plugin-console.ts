import type { Plugin } from 'vite';

export default function consolePlugin(): Plugin {
  return {
    name: 'shardwilds-console',
    configureServer() {
      // populated in Task 4
    },
  };
}