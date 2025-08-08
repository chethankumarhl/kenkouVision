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

    const { symptoms, patientId, patientHistory, age, gender } = await request.json();

    if (!symptoms || symptoms.trim().length < 3) {
      return NextResponse.json(
        { error: "Please provide more detailed symptoms" },
        { status: 400 }
      );
    }

    // Analyze symptoms using Gemini AI
    const analysis = await geminiService.analyzeSymptoms(
      symptoms,
      patientHistory,
      age,
      gender
    );

    // Save analysis to database
    const aiAnalysis = await prisma.aiAnalysis.create({
      data: {
        type: "SYMPTOM_CHECK",
        input: symptoms,
        output: analysis,
        confidence: analysis.confidence || 7,
        patientId: patientId || null,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      id: aiAnalysis.id,
      analysis,
      timestamp: aiAnalysis.createdAt,
    });
  } catch (error) {
    console.error("Symptom checker error:", error);
    return NextResponse.json(
      { error: "Failed to analyze symptoms. Please try again." },
      { status: 500 }
    );
  }
}
