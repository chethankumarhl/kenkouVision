"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Brain,
  BarChart3,
  Settings,
  Stethoscope,
  FileText,
  MessageSquare,
  Pill,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Patients",
    href: "/patients",
    icon: Users,
  },
  {
    name: "Appointments",
    href: "/appointments",
    icon: Calendar,
  },
  {
    name: "AI Tools",
    href: "/ai-tools",
    icon: Brain,
    children: [
      { name: "Symptom Checker", href: "/ai-tools/symptom-checker", icon: Stethoscope },
      { name: "Document Analyzer", href: "/ai-tools/document-analyzer", icon: FileText },
      { name: "Radiology Report", href: "/ai-tools/radiology-report", icon: Activity },
      { name: "Medication Info", href: "/ai-tools/medication-info", icon: Pill },
    ],
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200 px-3 py-4">
      <div className="flex items-center px-4 py-2 mb-8">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Stethoscope className="h-7 w-10 text-white" />
        </div>
        <span className="ml-3 text-xl font-bold text-gray-900">Kenkou-Vision 健康-視覚</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navigation.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <SidebarItem item={item} pathname={pathname} />
          </motion.div>
        ))}
      </nav>
    </div>
  );
}

function SidebarItem({ item, pathname }) {
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <div
          className={cn(
            "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
            isActive
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          <item.icon className="mr-3 h-5 w-5" />
          {item.name}
        </div>
        <div className="ml-6 space-y-1">
          {item.children.map((child) => (
            <Link
              key={child.name}
              href={child.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                pathname === child.href
                  ? "bg-blue-100 text-blue-600 border-l-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <child.icon className="mr-3 h-4 w-4" />
              {child.name}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
        isActive
          ? "bg-blue-600 text-white"
          : "text-gray-700 hover:bg-gray-100"
      )}
    >
      <item.icon className="mr-3 h-5 w-5" />
      {item.name}
    </Link>
  );
}
