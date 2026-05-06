import { Card, CardContent, CardHeader } from "@shared/ui/card";
import { Skeleton } from "@shared/ui/skeleton";

export function ResearchCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-6 w-24" />
      </CardContent>
    </Card>
  );
}
