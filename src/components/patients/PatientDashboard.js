"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  AlertTriangle, 
  Heart, 
  UserCheck, 
  Calendar,
  Search,
  Plus,
  Filter
} from "lucide-react";
import PatientList from "./PatientList";
import PatientStats from "./PatientStats";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function PatientDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/patients');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-medical-blue"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Patients",
      value: analytics?.stats?.totalPatients || 0,
      icon: Users,
      color: "bg-blue-500",
      change: "+12%"
    },
    {
      title: "Critical",
      value: analytics?.stats?.criticalPatients || 0,
      icon: AlertTriangle,
      color: "bg-red-500",
      change: "-5%"
    },
    {
      title: "Stable",
      value: analytics?.stats?.stablePatients || 0,
      icon: Heart,
      color: "bg-green-500",
      change: "+8%"
    },
    {
      title: "Today's Appointments",
      value: analytics?.stats?.todayAppointments || 0,
      icon: Calendar,
      color: "bg-purple-500",
      change: "+3"
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all patients</p>
        </div>
        <Link href="/patients/add">
          <Button className="bg-medical-blue hover:bg-medical-blue/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            whileHover={{ y: -5 }}
            className="relative"
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-sm font-medium text-green-600">
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-600 ml-2">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Patient Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search patients by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'ACTIVE', 'CRITICAL', 'STABLE', 'DISCHARGED'].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className="capitalize"
                  >
                    {status === 'all' ? 'All' : status.toLowerCase()}
                  </Button>
                ))}
              </div>
            </div>

            <PatientList 
              searchTerm={searchTerm}
              statusFilter={statusFilter}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts and Analytics */}
      <motion.div variants={itemVariants}>
        <PatientStats analytics={analytics} />
      </motion.div>
    </motion.div>
  );
}
