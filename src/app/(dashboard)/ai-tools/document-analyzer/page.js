"use client";

import { Suspense } from "react";
import DocumentAnalyzer from "@/components/ai/DocumentAnalyzer";
import { LoadingSkeleton } from "@/components/ui/loading";

export default function DocumentAnalyzerPage() {
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<LoadingSkeleton className="h-96" />}>
        <DocumentAnalyzer />
      </Suspense>
    </div>
  );
}
