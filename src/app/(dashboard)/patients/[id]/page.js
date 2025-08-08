"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Heart,
  Activity,
  Pill,
  FileText,
  Edit,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { getInitials, calculateAge, getStatusColor } from "@/lib/utils";

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params.id;
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`/api/patients/${patientId}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError("Patient not found");
          } else {
            throw new Error("Failed to fetch patient");
          }
          return;
        }
        const data = await response.json();
        setPatient(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Patient Not Found</h1>
          <p className="text-gray-600 mt-2">The requested patient could not be found.</p>
        </div>
        <Link href="/patients">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patients
          </Button>
        </Link>
      </div>
    );
  }

  if (!patient) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <Link href="/patients">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-blue-600 text-white text-xl">
                {getInitials(`${patient.firstName} ${patient.lastName}`)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {patient.firstName} {patient.lastName}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getStatusColor(patient.status)}>
                  {patient.status}
                </Badge>
                <span className="text-gray-600">
                  {calculateAge(patient.dateOfBirth)} years old
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <Link href={`/patients/${patient.id}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Patient
          </Button>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{patient.email || 'No email provided'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{new Date(patient.dateOfBirth).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>{patient.gender}</span>
                </div>
                {patient.address && (
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span>{patient.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Medical Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-600" />
                <span>Medical Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Blood Type</h4>
                <p className="text-gray-600">{patient.bloodType || 'Not specified'}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Allergies</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {patient.allergies && patient.allergies.length > 0 ? 
                    patient.allergies.map((allergy, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {allergy}
                      </Badge>
                    )) : 
                    <span className="text-gray-600">No known allergies</span>
                  }
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Emergency Contact</h4>
                <p className="text-gray-600">{patient.emergencyContact || 'Not provided'}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Current Medications */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Pill className="h-5 w-5 text-green-600" />
                <span>Current Medications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {patient.currentMedications && patient.currentMedications.length > 0 ? 
                  patient.currentMedications.map((medication, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                      {medication}
                    </div>
                  )) : 
                  <p className="text-gray-600">No current medications</p>
                }
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Medical History & Chronic Conditions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <span>Medical History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {patient.medicalHistory || 'No medical history recorded'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-orange-600" />
                <span>Chronic Conditions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {patient.chronicConditions && patient.chronicConditions.length > 0 ? 
                  patient.chronicConditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="mr-2">
                      {condition}
                    </Badge>
                  )) : 
                  <p className="text-gray-600">No chronic conditions</p>
                }
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
