    // File: src/index.ts

    import app from './app';
    import { connectDB } from './config/db';
    import { config } from './config/env';

    const startServer = async (): Promise<void> => {
    try {
    // Connect to MongoDB
    await connectDB();

    // Start server
    const server = app.listen(config.PORT, () => {
    console.log(`🚀 Server running on port ${config.PORT}`);
    console.log(`📊 Environment: ${config.NODE_ENV}`);
    console.log(`🌐 Frontend URL: ${config.FRONTEND_URL}`);
    console.log(`📝 API Documentation: http://localhost:${config.PORT}/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
    
    server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
        console.error('❌ Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
    }
    };

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err: Error) => {
    console.error('❌ Unhandled Promise Rejection:', err.message);
    process.exit(1);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err: Error) => {
    console.error('❌ Uncaught Exception:', err.message);
    process.exit(1);
    });

    // Start the server
    startServer();