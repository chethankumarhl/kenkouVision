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

    const { imageDescription, patientInfo, patientId } = await request.json();

    if (!imageDescription || imageDescription.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide image description" },
        { status: 400 }
      );
    }

    // Generate radiology report using Gemini AI
    const report = await geminiService.generateRadiologyReport(imageDescription, patientInfo);

    // Save analysis to database
    const aiAnalysis = await prisma.aiAnalysis.create({
      data: {
        type: "RADIOLOGY_REPORT",
        input: imageDescription,
        output: report,
        confidence: 8,
        patientId: patientId || null,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      id: aiAnalysis.id,
      report,
      timestamp: aiAnalysis.createdAt,
    });
  } catch (error) {
    console.error("Radiology report error:", error);
    return NextResponse.json(
      { error: "Failed to generate radiology report. Please try again." },
      { status: 500 }
    );
  }
}
