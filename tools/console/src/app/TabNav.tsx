import { cn } from '../lib/cn';
import { useActiveTab, type TabId } from './useActiveTab';

const TABS: { id: TabId; label: string }[] = [
  { id: 'kanban', label: 'Kanban' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'api-runner', label: 'API Runner' },
];

export function TabNav() {
  const activeTab = useActiveTab((state) => state.activeTab);
  const setActiveTab = useActiveTab((state) => state.setActiveTab);

  return (
    <nav className="flex border-b border-border bg-card">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            'px-6 py-3 text-sm font-medium transition-colors',
            activeTab === tab.id
              ? 'border-b-2 border-primary text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}