import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get basic stats
    const [
      totalPatients,
      criticalPatients,
      stablePatients,
      dischargedPatients,
      todayAppointments,
      recentPatients
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.patient.count({ where: { status: 'CRITICAL' } }),
      prisma.patient.count({ where: { status: 'STABLE' } }),
      prisma.patient.count({ where: { status: 'DISCHARGED' } }),
      prisma.appointment.count({
        where: {
          startTime: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      }),
      prisma.patient.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          doctor: { select: { name: true } }
        }
      })
    ]);

    // Get status distribution for charts
    const statusDistribution = [
      { name: 'Active', value: totalPatients - criticalPatients - stablePatients - dischargedPatients },
      { name: 'Critical', value: criticalPatients },
      { name: 'Stable', value: stablePatients },
      { name: 'Discharged', value: dischargedPatients }
    ];

    // Get monthly patient growth
    const monthlyGrowth = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*)::int as count
      FROM patients 
      WHERE "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month
    `;

    return NextResponse.json({
      stats: {
        totalPatients,
        criticalPatients,
        stablePatients,
        dischargedPatients,
        todayAppointments
      },
      charts: {
        statusDistribution,
        monthlyGrowth
      },
      recentPatients
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
