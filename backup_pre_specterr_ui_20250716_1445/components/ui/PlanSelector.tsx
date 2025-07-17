import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/userStore';
import { PlanTier } from '@/types/plans';
import { cn } from '@/lib/utils';

export function PlanSelector() {
  const { currentPlan, setPlan } = useUserStore();

  const plans: { tier: PlanTier; name: string; color: string }[] = [
    { tier: 'Basic', name: 'Basic', color: 'bg-gray-500' },
    { tier: 'Pro', name: 'Pro', color: 'bg-blue-500' },
    { tier: 'Advanced', name: 'Advanced', color: 'bg-purple-500' },
    { tier: 'Admin', name: 'Admin', color: 'bg-red-500' },
  ];

  return (
    <div className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Test Plan:</div>
      <div className="flex space-x-1">
        {plans.map(({ tier, name, color }) => (
          <Button
            key={tier}
            variant={currentPlan === tier ? "default" : "outline"}
            size="sm"
            className={cn(
              "text-xs px-2 py-1 h-6",
              currentPlan === tier && color
            )}
            onClick={() => setPlan(tier)}
          >
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
}