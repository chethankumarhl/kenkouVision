"use client";

import { Suspense } from "react";
import MedicationInfo from "@/components/ai/MedicationInfo";
import { LoadingSkeleton } from "@/components/ui/loading";

export default function MedicationInfoPage() {
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<LoadingSkeleton className="h-96" />}>
        <MedicationInfo />
      </Suspense>
    </div>
  );
}
