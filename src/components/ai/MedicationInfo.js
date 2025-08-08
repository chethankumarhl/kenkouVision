"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Pill, 
  Search, 
  AlertTriangle, 
  Info,
  Clock,
  Users,
  Shield,
  Heart
} from "lucide-react";

export default function MedicationInfo() {
  const [medicationName, setMedicationName] = useState("");
  const [medicationInfo, setMedicationInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!medicationName.trim()) {
      setError("Please enter a medication name");
      return;
    }

    setLoading(true);
    setError("");
    setMedicationInfo(null);

    try {
      const response = await fetch("/api/ai/medication-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medicationName: medicationName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get medication information");
      }

      setMedicationInfo(data.medicationInfo);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-medical-orange rounded-full">
            <Pill className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Medication Information</h1>
        <p className="text-gray-600 mt-2">
          Get comprehensive information about medications, dosages, and interactions
        </p>
      </motion.div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter medication name (e.g., Aspirin, Metformin, Lisinopril)"
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-12 text-lg"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={loading || !medicationName.trim()}
                className="h-12 px-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Results Section */}
      {medicationInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Pill className="h-6 w-6 text-medical-orange" />
                <span>Medication Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{medicationInfo.medicationName}</h3>
                  {medicationInfo.genericName && medicationInfo.genericName !== "Information not available" && (
                    <p className="text-gray-600 mb-2">
                      <strong>Generic Name:</strong> {medicationInfo.genericName}
                    </p>
                  )}
                  <Badge className="bg-orange-100 text-orange-800">
                    {medicationInfo.drugClass}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Primary Uses:</h4>
                  <ul className="space-y-1">
                    {medicationInfo.uses?.map((use, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-medical-orange">•</span>
                        <span className="text-sm">{use}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dosage Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-6 w-6 text-blue-600" />
                <span>Dosage Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Adult Dosage
                  </h4>
                  <p className="text-sm text-gray-700">{medicationInfo.dosage?.adult}</p>
                </div>
                {medicationInfo.dosage?.pediatric && medicationInfo.dosage.pediatric !== "Consult prescribing information" && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium mb-2">Pediatric Dosage</h4>
                    <p className="text-sm text-gray-700">{medicationInfo.dosage.pediatric}</p>
                  </div>
                )}
                {medicationInfo.dosage?.elderly && medicationInfo.dosage.elderly !== "Consult prescribing information" && (
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium mb-2">Elderly Considerations</h4>
                    <p className="text-sm text-gray-700">{medicationInfo.dosage.elderly}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Side Effects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="h-6 w-6 text-green-600" />
                  <span>Common Side Effects</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {medicationInfo.sideEffects?.common?.map((effect, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-600">•</span>
                      <span className="text-sm">{effect}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                  <span>Serious Side Effects</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {medicationInfo.sideEffects?.serious?.map((effect, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-red-800">{effect}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Contraindications and Interactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-red-600" />
                  <span>Contraindications</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {medicationInfo.contraindications?.map((contraindication, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Shield className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{contraindication}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-6 w-6 text-purple-600" />
                  <span>Drug Interactions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {medicationInfo.interactions?.map((interaction, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-purple-600">•</span>
                      <span className="text-sm">{interaction}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Warnings */}
          {medicationInfo.warnings && medicationInfo.warnings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  <span>Important Warnings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {medicationInfo.warnings.map((warning, index) => (
                    <Alert key={index} className="border-yellow-200 bg-yellow-50">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        {warning}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Disclaimer */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> {medicationInfo.disclaimer || "This information is for educational purposes only. Always consult with your healthcare provider or pharmacist before starting, stopping, or changing any medication. Do not use this information as a substitute for professional medical advice."}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Empty State */}
      {!medicationInfo && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Pill className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Search for Medication Information
              </h3>
              <p className="text-gray-600 text-center max-w-md">
                Enter the name of any medication to get comprehensive information about uses, dosages, side effects, and interactions.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
