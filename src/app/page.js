"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    
    if (session) {
      redirect("/dashboard");
    } else {
      redirect("/login");
    }
  }, [session, status]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-medical-blue"></div>
    </div>
  );
}
