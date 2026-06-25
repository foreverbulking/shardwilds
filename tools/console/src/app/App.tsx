import { TabNav } from './TabNav';
import { ErrorBoundary } from './ErrorBoundary';
import { useActiveTab } from './useActiveTab';

function KanbanPlaceholder() {
  return <div className="p-6 text-muted-foreground">Kanban tab (placeholder)</div>;
}

function ArchitecturePlaceholder() {
  return <div className="p-6 text-muted-foreground">Architecture tab (placeholder)</div>;
}

function ApiRunnerPlaceholder() {
  return <div className="p-6 text-muted-foreground">API Runner tab (placeholder)</div>;
}

export default function App() {
  const activeTab = useActiveTab((state) => state.activeTab);

  return (
    <div className="h-full flex flex-col">
      <TabNav />
      <main className="flex-1 overflow-auto">
        <ErrorBoundary>
          {activeTab === 'kanban' && <KanbanPlaceholder />}
          {activeTab === 'architecture' && <ArchitecturePlaceholder />}
          {activeTab === 'api-runner' && <ApiRunnerPlaceholder />}
        </ErrorBoundary>
      </main>
    </div>
  );
}