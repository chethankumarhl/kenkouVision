"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Edit, 
  Eye, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  User
} from "lucide-react";
import { getInitials, calculateAge, getStatusColor } from "@/lib/utils";
import Link from "next/link";

export default function PatientList({ searchTerm, statusFilter }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  useEffect(() => {
    fetchPatients();
  }, [searchTerm, statusFilter, pagination.page]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        status: statusFilter,
        page: pagination.page,
        limit: 10
      });
      
      const response = await fetch(`/api/patients?${params}`);
      const data = await response.json();
      
      setPatients(data.patients);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-24 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {patients.map((patient, index) => (
          <motion.div
            key={patient.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
          >
            <PatientCard patient={patient} />
          </motion.div>
        ))}
      </AnimatePresence>

      {patients.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-3 text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

function PatientCard({ patient }) {
  const age = calculateAge(patient.dateOfBirth);
  
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-medical-blue text-white">
                  {getInitials(`${patient.firstName} ${patient.lastName}`)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {patient.firstName} {patient.lastName}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {age} years old
                  </span>
                  <span className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {patient.phone}
                  </span>
                  {patient.email && (
                    <span className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {patient.email}
                    </span>
                  )}
                </div>
                {patient.address && (
                  <p className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {patient.address}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Badge className={getStatusColor(patient.status)}>
                {patient.status}
              </Badge>
              
              <div className="flex space-x-2">
                <Link href={`/patients/${patient.id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/patients/${patient.id}/edit`}>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Medical Info */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Blood Type:</span>
              <span className="ml-2 text-gray-600">{patient.bloodType || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Appointments:</span>
              <span className="ml-2 text-gray-600">{patient._count.appointments}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Records:</span>
              <span className="ml-2 text-gray-600">{patient._count.medicalRecords}</span>
            </div>
          </div>

          {/* Allergies */}
          {patient.allergies && patient.allergies.length > 0 && (
            <div className="mt-3">
              <span className="text-sm font-medium text-gray-700">Allergies:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {patient.allergies.map((allergy, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {allergy}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
