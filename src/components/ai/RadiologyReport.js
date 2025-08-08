"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Activity, 
  Brain, 
  User, 
  Calendar,
  AlertTriangle,
  FileText,
  Download,
  Printer,
} from "lucide-react";

export default function RadiologyReport() {
  const [imageDescription, setImageDescription] = useState("");
  const [patientInfo, setPatientInfo] = useState({
    age: "",
    gender: "",
    clinicalHistory: ""
  });
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!imageDescription.trim()) {
      setError("Please provide image description");
      return;
    }

    setLoading(true);
    setError("");
    setReport(null);

    try {
      const response = await fetch("/api/ai/radiology-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageDescription,
          patientInfo: {
            age: patientInfo.age ? parseInt(patientInfo.age) : null,
            gender: patientInfo.gender || null,
            clinicalHistory: patientInfo.clinicalHistory || null,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate report");
      }

      setReport(data.report);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'emergent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'routine':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const printReport = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Radiology Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; margin-bottom: 10px; }
            .content { line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>RADIOLOGY REPORT</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="section">
            <div class="section-title">EXAMINATION:</div>
            <div class="content">${report?.reportHeader?.examination || 'N/A'}</div>
          </div>
          
          <div class="section">
            <div class="section-title">INDICATION:</div>
            <div class="content">${report?.reportHeader?.indication || 'N/A'}</div>
          </div>
          
          <div class="section">
            <div class="section-title">FINDINGS:</div>
            <div class="content">${report?.findings || 'N/A'}</div>
          </div>
          
          <div class="section">
            <div class="section-title">IMPRESSION:</div>
            <div class="content">${report?.impression || 'N/A'}</div>
          </div>
          
          <div class="section">
            <div class="section-title">RECOMMENDATIONS:</div>
            <div class="content">
              ${report?.recommendations?.map(rec => `• ${rec}`).join('<br>') || 'N/A'}
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-medical-green rounded-full">
            <Activity className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Radiology Report Generator</h1>
        <p className="text-gray-600 mt-2">
          Generate professional radiology reports from image descriptions using AI
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-medical-green" />
                <span>Image Description & Patient Info</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="imageDescription">Image Description *</Label>
                <Textarea
                  id="imageDescription"
                  placeholder="Describe the radiological findings... e.g., 'Chest X-ray shows bilateral lower lobe consolidation with air bronchograms...'"
                  value={imageDescription}
                  onChange={(e) => setImageDescription(e.target.value)}
                  rows={6}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Patient Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="65"
                    value={patientInfo.age}
                    onChange={(e) => setPatientInfo({...patientInfo, age: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={patientInfo.gender} 
                    onValueChange={(value) => setPatientInfo({...patientInfo, gender: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="clinicalHistory">Clinical History</Label>
                <Textarea
                  id="clinicalHistory"
                  placeholder="Relevant clinical history, symptoms, previous conditions..."
                  value={patientInfo.clinicalHistory}
                  onChange={(e) => setPatientInfo({...patientInfo, clinicalHistory: e.target.value})}
                  rows={3}
                  className="mt-1"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleGenerate}
                disabled={loading || !imageDescription.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating report...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Generated Report */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {report ? (
            <div className="space-y-4">
              {/* Report Header */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Radiology Report</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={printReport}>
                      <Printer className="h-4 w-4 mr-1" />
                      Print
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <strong>Examination:</strong> {report.reportHeader?.examination}
                    </div>
                    <div>
                      <strong>Date:</strong> {report.reportHeader?.date}
                    </div>
                    <div>
                      <strong>Indication:</strong> {report.reportHeader?.indication}
                    </div>
                    {report.urgency && (
                      <div className="flex items-center space-x-2">
                        <strong>Priority:</strong>
                        <span className={`px-2 py-1 rounded text-sm ${getUrgencyColor(report.urgency)}`}>
                          {report.urgency}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Findings */}
              <Card>
                <CardHeader>
                  <CardTitle>Findings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {report.findings}
                  </p>
                </CardContent>
              </Card>

              {/* Impression */}
              <Card>
                <CardHeader>
                  <CardTitle>Impression</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {report.impression}
                  </p>
                </CardContent>
              </Card>

              {/* Recommendations */}
              {report.recommendations && report.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {report.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-medical-green">•</span>
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Follow-up */}
              {report.followUp && (
                <Card>
                  <CardHeader>
                    <CardTitle>Follow-up</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{report.followUp}</p>
                  </CardContent>
                </Card>
              )}

              {/* Disclaimer */}
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This AI-generated report is for educational purposes only and should be reviewed by a qualified radiologist before clinical use.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Activity className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ready to Generate Report
                </h3>
                <p className="text-gray-600 text-center">
                  Provide image description and patient information to generate a professional radiology report
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
