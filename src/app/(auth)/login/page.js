"use client";

import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-blue/10 to-medical-purple/10">
      <Suspense fallback={
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-medical-blue"></div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
