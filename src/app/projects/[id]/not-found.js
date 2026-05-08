import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileX, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <FileX className="h-14 w-14 text-muted-foreground mx-auto" />
        <h2 className="text-xl font-semibold">Project Not Found</h2>
        <p className="text-muted-foreground">
          This project may have been removed or doesn&apos;t exist.
        </p>
        <Button asChild variant="outline">
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>
    </div>
  );
}
