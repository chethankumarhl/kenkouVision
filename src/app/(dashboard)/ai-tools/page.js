"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Stethoscope, 
  FileText, 
  MessageSquare, 
  Activity,
  Zap,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";

const aiTools = [
  {
    id: "symptom-checker",
    title: "AI Symptom Checker",
    description: "Get AI-powered analysis of symptoms with possible conditions and recommendations",
    icon: Stethoscope,
    href: "/ai-tools/symptom-checker",
    color: "bg-blue-100 text-blue-600",
    status: "Active"
  },
  {
    id: "document-analyzer",
    title: "Medical Document Analyzer",
    description: "Analyze medical reports, lab results, and documents with AI insights",
    icon: FileText,
    href: "/ai-tools/document-analyzer",
    color: "bg-green-100 text-green-600",
    status: "Active"
  },
  {
    id: "radiology-report",
    title: "AI Radiology Reports",
    description: "Generate comprehensive radiology reports with AI assistance",
    icon: Activity,
    href: "/ai-tools/radiology-report",
    color: "bg-purple-100 text-purple-600",
    status: "Active"
  },
  {
    id: "medication-info",
    title: "Ask Medication Information",
    description: "Interactive Search for Medication Information",
    icon: MessageSquare,
    href: "/ai-tools/medication-info",
    color: "bg-orange-100 text-orange-600",
    status: "Active"
  }
];

export default function AIToolsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex justify-center">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
            <Brain className="h-8 w-8 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Medical Tools</h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Leverage advanced AI technology to enhance medical diagnosis, analysis, and patient care
          </p>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {aiTools.map((tool, index) => {
          const IconComponent = tool.icon;
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${tool.color}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      <Zap className="h-3 w-3 mr-1" />
                      {tool.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-blue-600 transition-colors">
                    {tool.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    {tool.description}
                  </p>
                  <Link href={tool.href}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600">
                      Launch Tool
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
      >
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">AI-Powered</h3>
            <p className="text-gray-600 mt-2">Advanced machine learning algorithms</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Real-time</h3>
            <p className="text-gray-600 mt-2">Instant analysis and results</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-4">
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Accurate</h3>
            <p className="text-gray-600 mt-2">Medical-grade precision</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Medical Disclaimer</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  These AI tools are designed to assist healthcare professionals and should not replace professional medical judgment. 
                  Always consult with qualified healthcare providers for medical decisions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
