import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import geminiService from "@/lib/gemini";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { medicationName } = await request.json();

    if (!medicationName || medicationName.trim().length < 2) {
      return NextResponse.json(
        { error: "Please provide medication name" },
        { status: 400 }
      );
    }

    // Get medication info using Gemini AI
    const medicationInfo = await geminiService.getMedicationInfo(medicationName);

    // Save analysis to database
    const aiAnalysis = await prisma.aiAnalysis.create({
      data: {
        type: "MEDICATION_INFO",
        input: medicationName,
        output: medicationInfo,
        confidence: 8,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      id: aiAnalysis.id,
      medicationInfo,
      timestamp: aiAnalysis.createdAt,
    });
  } catch (error) {
    console.error("Medication info error:", error);
    return NextResponse.json(
      { error: "Failed to get medication information. Please try again." },
      { status: 500 }
    );
  }
}
