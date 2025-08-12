export async function GET() {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      return Response.json({
        error: "DATABASE_URL not found in environment variables"
      }, { status: 500 });
    }
    
    // Parse the URL to show details (without exposing password)
    try {
      const url = new URL(databaseUrl);
      const connectionDetails = {
        protocol: url.protocol,
        host: url.hostname,
        port: url.port,
        database: url.pathname.substring(1),
        username: url.username,
        hasPassword: !!url.password,
        searchParams: Object.fromEntries(url.searchParams)
      };
      
      return Response.json({
        status: "Environment variable found",
        details: connectionDetails,
        fullUrlLength: databaseUrl.length
      });
    } catch (error) {
      return Response.json({
        error: "Invalid DATABASE_URL format",
        message: error.message
      }, { status: 500 });
    }
  }