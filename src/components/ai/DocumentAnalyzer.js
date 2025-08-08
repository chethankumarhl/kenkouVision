"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  Upload, 
  Brain, 
  AlertTriangle, 
  CheckCircle,
  Eye,
  Download,
  Trash2
} from "lucide-react";

export default function DocumentAnalyzer() {
  const [documentText, setDocumentText] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      
      // Read file content
      const reader = new FileReader();
      reader.onload = (e) => {
        setDocumentText(e.target.result);
      };
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  const handleAnalyze = async () => {
    if (!documentText.trim()) {
      setError("Please provide document content to analyze");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const response = await fetch("/api/ai/document-analyzer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentText,
          documentType: documentType || "medical document",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze document");
      }

      setAnalysis(data.analysis);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearDocument = () => {
    setDocumentText("");
    setUploadedFile(null);
    setAnalysis(null);
    setError("");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-medical-purple rounded-full">
            <FileText className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Document Analyzer</h1>
        <p className="text-gray-600 mt-2">
          Upload or paste medical documents for AI-powered analysis and summarization
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-medical-purple" />
                <span>Upload Document</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-medical-purple bg-purple-50"
                    : "border-gray-300 hover:border-medical-purple"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                {isDragActive ? (
                  <p className="text-medical-purple">Drop the document here...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">
                      Drag & drop a document here, or click to select
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports: .txt, .pdf, .doc, .docx
                    </p>
                  </div>
                )}
              </div>

              {uploadedFile && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-medical-purple" />
                    <span className="text-sm font-medium">{uploadedFile.name}</span>
                    <Badge variant="outline">{uploadedFile.type}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearDocument}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Manual Input */}
          <Card>
            <CardHeader>
              <CardTitle>Or Paste Document Text</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lab report">Lab Report</SelectItem>
                    <SelectItem value="radiology report">Radiology Report</SelectItem>
                    <SelectItem value="discharge summary">Discharge Summary</SelectItem>
                    <SelectItem value="consultation note">Consultation Note</SelectItem>
                    <SelectItem value="pathology report">Pathology Report</SelectItem>
                    <SelectItem value="medical history">Medical History</SelectItem>
                    <SelectItem value="prescription">Prescription</SelectItem>
                    <SelectItem value="medical document">General Medical Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                placeholder="Paste your medical document content here..."
                value={documentText}
                onChange={(e) => setDocumentText(e.target.value)}
                rows={8}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleAnalyze}
                disabled={loading || !documentText.trim()}
                className="h-12 px-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Analyzing document...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Analyze Document
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analysis Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {analysis ? (
            <div className="space-y-4">
              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Document Summary</span>
                    <Badge variant="outline">
                      Confidence: {analysis.confidence}/10
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
                  {analysis.documentType && (
                    <div className="mt-3">
                      <Badge className="bg-purple-100 text-purple-800">
                        {analysis.documentType}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Key Findings */}
              {analysis.keyFindings && analysis.keyFindings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Key Findings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.keyFindings.map((finding, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Critical Points */}
              {analysis.criticalPoints && analysis.criticalPoints.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span>Critical Points</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.criticalPoints.map((point, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-red-800">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Recommendations */}
              {analysis.recommendations && analysis.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-medical-blue text-lg">•</span>
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Follow-up Required */}
              {analysis.followUpRequired && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Follow-up Required:</strong> This document indicates that additional medical attention or follow-up may be necessary.
                  </AlertDescription>
                </Alert>
              )}

              {/* Disclaimer */}
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This AI analysis is for informational purposes only. Please consult with healthcare professionals for proper interpretation of medical documents.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Document Analysis Ready
                </h3>
                <p className="text-gray-600 text-center">
                  Upload a document or paste content to get AI-powered analysis
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
