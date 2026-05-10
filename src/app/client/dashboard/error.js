'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function Error({ error, reset }) {
  return (
    <div className="w-full mx-auto px-4 md:px-8 py-20 max-w-7xl">
      <Card className="max-w-md mx-auto text-center border-destructive">
        <CardContent className="pt-6 space-y-4">
          <AlertTriangle className="h-10 w-10 text-destructive mx-auto" />
          <h2 className="text-xl font-bold">Something went wrong</h2>
          <p className="text-sm text-muted-foreground">
            {error?.message || 'An unexpected error occurred loading your dashboard.'}
          </p>
          <Button onClick={reset} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
