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

    const { documentText, documentType, patientId } = await request.json();

    if (!documentText || documentText.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide document content to analyze" },
        { status: 400 }
      );
    }

    // Analyze document using Gemini AI
    const analysis = await geminiService.analyzeDocument(documentText, documentType);

    // Save analysis to database
    const aiAnalysis = await prisma.aiAnalysis.create({
      data: {
        type: "DOCUMENT_ANALYSIS",
        input: documentText,
        output: analysis,
        confidence: analysis.confidence || 8,
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
    console.error("Document analyzer error:", error);
    return NextResponse.json(
      { error: "Failed to analyze document. Please try again." },
      { status: 500 }
    );
  }
}
