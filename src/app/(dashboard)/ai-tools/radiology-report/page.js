"use client";

import { Suspense } from "react";
import RadiologyReport from "@/components/ai/RadiologyReport";
import { LoadingSkeleton } from "@/components/ui/loading";

export default function RadiologyReportPage() {
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<LoadingSkeleton className="h-96" />}>
        <RadiologyReport />
      </Suspense>
    </div>
  );
}
