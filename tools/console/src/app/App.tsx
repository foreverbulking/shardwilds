import { TabNav } from './TabNav';
import { ErrorBoundary } from './ErrorBoundary';
import { useActiveTab } from './useActiveTab';
import { KanbanTab } from '../kanban/KanbanTab';
import { ArchitectureTab } from '../architecture/ArchitectureTab';
import { ApiRunnerTab } from '../api-runner/ApiRunnerTab';

export default function App() {
  const activeTab = useActiveTab((state) => state.activeTab);

  return (
    <div className="h-full flex flex-col">
      <TabNav />
      <main className="flex-1 overflow-auto">
        <ErrorBoundary>
          {activeTab === 'kanban' && <KanbanTab />}
          {activeTab === 'architecture' && <ArchitectureTab />}
          {activeTab === 'api-runner' && <ApiRunnerTab />}
        </ErrorBoundary>
      </main>
    </div>
  );
}