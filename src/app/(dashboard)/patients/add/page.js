"use client";

import { Suspense } from "react";
import PatientForm from "@/components/patients/PatientForm";
import { LoadingSkeleton } from "@/components/ui/loading";

export default function AddPatientPage() {
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<LoadingSkeleton className="h-96" />}>
        <PatientForm mode="create" />
      </Suspense>
    </div>
  );
}
