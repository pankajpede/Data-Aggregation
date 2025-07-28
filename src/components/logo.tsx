import { Target } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2" aria-label="FinSight Home">
      <Target className="h-6 w-6 text-primary" />
      <h1 className="text-xl font-bold text-foreground">FinSight</h1>
    </div>
  );
}
