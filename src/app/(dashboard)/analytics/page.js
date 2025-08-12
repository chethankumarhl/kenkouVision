"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Clock,
  Brain,
  Heart,
  AlertTriangle,
  CheckCircle,
  Calendar,
  UserCheck
} from "lucide-react";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/patients');
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      
      const data = await response.json();
      
      // Calculate additional derived stats
      const activePatients = data.stats.totalPatients - data.stats.dischargedPatients;
      const criticalRate = data.stats.totalPatients > 0 
        ? ((data.stats.criticalPatients / data.stats.totalPatients) * 100).toFixed(1)
        : 0;
      const stableRate = data.stats.totalPatients > 0 
        ? ((data.stats.stablePatients / data.stats.totalPatients) * 100).toFixed(1)
        : 0;

      // Process monthly growth data for trend calculation
      const growthTrend = data.charts.monthlyGrowth.length > 1 
        ? ((data.charts.monthlyGrowth[data.charts.monthlyGrowth.length - 1].count - 
           data.charts.monthlyGrowth[data.charts.monthlyGrowth.length - 2].count) / 
           data.charts.monthlyGrowth[data.charts.monthlyGrowth.length - 2].count * 100).toFixed(1)
        : 0;

      setAnalytics({
        ...data,
        derived: {
          activePatients,
          criticalRate,
          stableRate,
          growthTrend
        }
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color, progress, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`p-2 rounded-lg ${color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-600">{title}</h3>
              </div>
              <div className="flex items-baseline space-x-2">
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                {trend && (
                  <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trend >= 0 ? '+' : ''}{trend}%
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
          </div>
          {progress !== undefined && (
            <div className="mt-3">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">{progress}%</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Real-time system analytics and patient insights</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Real-time system analytics and patient insights</p>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <p>Error loading analytics: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Real-time system analytics and patient insights</p>
      </motion.div>

      {/* Main Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <StatCard
          title="Total Patients"
          value={analytics.stats.totalPatients}
          subtitle="All registered patients"
          icon={Users}
          color="bg-blue-500"
          trend={parseFloat(analytics.derived.growthTrend)}
        />
        <StatCard
          title="Active Patients"
          value={analytics.derived.activePatients}
          subtitle="Currently under care"
          icon={Activity}
          color="bg-green-500"
        />
        <StatCard
          title="Critical Patients"
          value={analytics.stats.criticalPatients}
          subtitle={`${analytics.derived.criticalRate}% of total`}
          icon={AlertTriangle}
          color="bg-red-500"
          progress={parseFloat(analytics.derived.criticalRate)}
        />
        <StatCard
          title="Stable Patients"
          value={analytics.stats.stablePatients}
          subtitle={`${analytics.derived.stableRate}% of total`}
          icon={CheckCircle}
          color="bg-emerald-500"
          progress={parseFloat(analytics.derived.stableRate)}
        />
        <StatCard
          title="Today's Appointments"
          value={analytics.stats.todayAppointments}
          subtitle="Scheduled for today"
          icon={Calendar}
          color="bg-purple-500"
        />
        <StatCard
          title="Discharged Patients"
          value={analytics.stats.dischargedPatients}
          subtitle="Successfully treated"
          icon={UserCheck}
          color="bg-indigo-500"
        />
      </motion.div>

      {/* Patient Status Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Patient Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.charts.statusDistribution.map((status, index) => (
                <motion.div
                  key={status.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{status.name}</h4>
                    <p className="text-sm text-gray-600">{status.value} patients</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24">
                      <Progress 
                        value={analytics.stats.totalPatients > 0 ? (status.value / analytics.stats.totalPatients) * 100 : 0} 
                        className="h-2" 
                      />
                    </div>
                    <Badge 
                      className={
                        status.name === 'Critical' ? 'bg-red-100 text-red-800' :
                        status.name === 'Stable' ? 'bg-green-100 text-green-800' :
                        status.name === 'Discharged' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }
                    >
                      {analytics.stats.totalPatients > 0 
                        ? Math.round((status.value / analytics.stats.totalPatients) * 100)
                        : 0
                      }%
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Patients */}
      {analytics.recentPatients && analytics.recentPatients.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.recentPatients.map((patient, index) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {patient.gender} • Age: {patient.dateOfBirth ? 
                          Math.floor((new Date() - new Date(patient.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000)) 
                          : 'N/A'} • 
                        Registered on {new Date(patient.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      className={
                        patient.status === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                        patient.status === 'STABLE' ? 'bg-green-100 text-green-800' :
                        patient.status === 'DISCHARGED' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {patient.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Monthly Growth Trend */}
      {analytics.charts.monthlyGrowth && analytics.charts.monthlyGrowth.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Monthly Patient Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.charts.monthlyGrowth.map((month, index) => (
                  <motion.div
                    key={month.month}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {new Date(month.month).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </h4>
                      <p className="text-sm text-gray-600">{month.count} new registrations</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24">
                        <Progress 
                          value={Math.max(...analytics.charts.monthlyGrowth.map(m => m.count)) > 0 
                            ? (month.count / Math.max(...analytics.charts.monthlyGrowth.map(m => m.count))) * 100 
                            : 0
                          } 
                          className="h-2" 
                        />
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {month.count}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* System Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Database connected</p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {analytics.derived.growthTrend >= 0 ? 'Growth trending up' : 'Monitoring growth'}
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <Activity className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {analytics.derived.activePatients} patients under care
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}