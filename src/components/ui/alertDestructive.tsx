import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';

type Props = React.PropsWithChildren;

export function AlertDestructive({ children }: Props) {
  return (
    <Alert className="m-4" variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
