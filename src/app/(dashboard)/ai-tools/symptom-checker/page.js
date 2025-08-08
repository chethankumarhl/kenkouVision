"use client";

import { Suspense } from "react";
import SymptomChecker from "@/components/ai/SymptomChecker";
import { LoadingSkeleton } from "@/components/ui/loading";

export default function SymptomCheckerPage() {
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<LoadingSkeleton className="h-96" />}>
        <SymptomChecker />
      </Suspense>
    </div>
  );
}
