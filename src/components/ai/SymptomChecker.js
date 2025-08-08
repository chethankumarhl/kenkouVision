"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Stethoscope, 
  Brain, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  User,
  Calendar
} from "lucide-react";

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [patientHistory, setPatientHistory] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      setError("Please describe your symptoms");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const response = await fetch("/api/ai/symptom-checker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptoms,
          patientHistory,
          age: age ? parseInt(age) : null,
          gender: gender || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze symptoms");
      }

      setAnalysis(data.analysis);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Clock className="h-4 w-4" />;
      case 'low':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Stethoscope className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-medical-blue rounded-full">
            <Brain className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">AI Symptom Checker</h1>
        <p className="text-gray-600 mt-2">
          Describe your symptoms and get AI-powered health insights
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
                <Stethoscope className="h-5 w-5 text-medical-blue" />
                <span>Symptom Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="symptoms">Describe your symptoms *</Label>
                <Textarea
                  id="symptoms"
                  placeholder="e.g., I have a headache, fever, and sore throat that started 2 days ago..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
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
                <Label htmlFor="history">Medical History (Optional)</Label>
                <Textarea
                  id="history"
                  placeholder="Previous conditions, medications, allergies..."
                  value={patientHistory}
                  onChange={(e) => setPatientHistory(e.target.value)}
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
                onClick={handleAnalyze}
                disabled={loading || !symptoms.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Analyzing symptoms...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4 " />
                    Analyze Symptoms
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {analysis ? (
            <div className="space-y-4">
              {/* Urgency Level */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {getUrgencyIcon(analysis.urgencyLevel)}
                    <div>
                      <h3 className="font-medium">Urgency Level</h3>
                      <Badge className={getUrgencyColor(analysis.urgencyLevel)}>
                        {analysis.urgencyLevel || 'Medium'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Possible Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Possible Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.possibleConditions?.map((condition, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{condition.condition}</h4>
                          <Badge variant="outline">
                            Confidence: {condition.confidence}/10
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{condition.description}</p>
                        <Badge className={getUrgencyColor(condition.urgency)} variant="outline">
                          {condition.urgency}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Actions */}
              {analysis.recommendedActions && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recommended Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.recommendedActions.map((action, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Additional Questions */}
              {analysis.additionalQuestions && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Additional Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.additionalQuestions.map((question, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-medical-blue">•</span>
                          <span>{question}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Disclaimer */}
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {analysis.disclaimer || 
                    "This AI analysis is for informational purposes only and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment."}
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Brain className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  AI Analysis Ready
                </h3>
                <p className="text-gray-600 text-center">
                  Enter your symptoms on the left to get AI-powered health insights
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
