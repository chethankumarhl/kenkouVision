import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔍 Authorize function called with:", { 
          email: credentials?.email,
          hasPassword: !!credentials?.password 
        });

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          throw new Error("Missing email or password");
        }

        try {
          console.log("🔗 Attempting database connection...");
          
          // Test database connection first
          await prisma.$connect();
          console.log("✅ Database connected successfully");
          
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });

          console.log("👤 User lookup result:", { 
            found: !!user, 
            email: credentials.email,
            userId: user?.id 
          });

          if (!user) {
            console.log("❌ No user found with email:", credentials.email);
            throw new Error("Invalid credentials");
          }

          console.log("🔐 Comparing passwords...");
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log("🔐 Password validation result:", isPasswordValid);

          if (!isPasswordValid) {
            console.log("❌ Invalid password for user:", credentials.email);
            throw new Error("Invalid credentials");
          }

          console.log("✅ Authentication successful for:", credentials.email);
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            department: user.department,
          };
        } catch (error) {
          console.error("💥 Auth error details:", {
            message: error.message,
            code: error.code,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
          });
          
          // Don't throw the original error, throw a generic one for security
          throw new Error("Authentication failed");
        } finally {
          await prisma.$disconnect();
          console.log("🔌 Database disconnected");
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("🎫 JWT callback:", { hasUser: !!user, tokenSub: token.sub });
      if (user) {
        token.role = user.role;
        token.department = user.department;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("📋 Session callback:", { tokenSub: token.sub });
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.department = token.department;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, metadata) {
      console.error("🚨 NextAuth Error:", code, metadata);
    },
    warn(code) {
      console.warn("⚠️ NextAuth Warning:", code);
    },
    debug(code, metadata) {
      console.log("🔍 NextAuth Debug:", code, metadata);
    }
  },
};