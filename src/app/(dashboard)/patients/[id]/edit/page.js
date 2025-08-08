"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import PatientForm from "@/components/patients/PatientForm";
import { LoadingSkeleton } from "@/components/ui/loading";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

function EditPatientContent() {
  const params = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPatient();
  }, [params.id]);

  const fetchPatient = async () => {
    try {
      const response = await fetch(`/api/patients/${params.id}`);
      if (!response.ok) {
        throw new Error("Patient not found");
      }
      const data = await response.json();
      setPatient(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton className="h-96" />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return <PatientForm initialData={patient} mode="edit" />;
}

export default function EditPatientPage() {
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<LoadingSkeleton className="h-96" />}>
        <EditPatientContent />
      </Suspense>
    </div>
  );
}
