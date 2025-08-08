import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        doctor: { select: { id: true, name: true, email: true, department: true } }
      }
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error("Failed to fetch patient:", error);
    return NextResponse.json({ error: "Failed to fetch patient" }, { status: 500 });
  }
}

// ✅ ADD THIS: PUT method for updating patients
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    // Check if patient exists and belongs to the current user
    const existingPatient = await prisma.patient.findUnique({
      where: { id },
      select: { id: true, doctorId: true }
    });

    if (!existingPatient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Optional: Check if user owns this patient (uncomment if needed)
    // if (existingPatient.doctorId !== session.user.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    // }

    // Update patient data
    const updatedPatient = await prisma.patient.update({
      where: { id },
      data: {
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      },
      include: {
        doctor: { select: { name: true, department: true } }
      }
    });

    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error("Failed to update patient:", error);
    return NextResponse.json(
      { error: "Failed to update patient" },
      { status: 500 }
    );
  }
}
