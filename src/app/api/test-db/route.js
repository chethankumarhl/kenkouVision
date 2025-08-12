import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    console.log("🔗 Testing database connection...");
    
    // Test connection
    await prisma.$connect();
    console.log("✅ Database connected");
    
    // Count users
    const userCount = await prisma.user.count();
    console.log(`👥 Found ${userCount} users`);
    
    // Try to find the demo user
    const demoUser = await prisma.user.findUnique({
      where: { email: "doctor@pmdss.com" }
    });
    
    if (demoUser) {
      console.log("🎯 Demo user found:", {
        id: demoUser.id,
        email: demoUser.email,
        hasPassword: !!demoUser.password,
        role: demoUser.role
      });
      
      // Test password comparison
      const isPasswordValid = await bcrypt.compare("admin123", demoUser.password);
      console.log("🔐 Demo password test:", isPasswordValid);
    }
    
    await prisma.$disconnect();
    
    return Response.json({ 
      status: 'success',
      userCount,
      demoUserExists: !!demoUser,
      demoPasswordWorks: demoUser ? await bcrypt.compare("admin123", demoUser.password) : false,
      message: 'Database test completed'
    });
  } catch (error) {
    console.error("💥 Database test error:", error);
    
    return Response.json({ 
      status: 'error',
      message: error.message,
      code: error.code,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}