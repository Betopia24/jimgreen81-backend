import { createServer, Server } from "http";
import app from "./app";
import logger from "./utils/logger";

class AppServer {
  private port: number | string;
  private server: Server;

  constructor() {
    this.port = process.env.PORT || 5000;
    this.server = createServer(app);
    this.startServer();
    this.handleProcessEvents();
  }

  private startServer(): void {
    this.server = app.listen(this.port, () => {
      logger.info(`SERVER IS RUNNING ON PORT ${this.port}`);
    });
  }

  private handleProcessEvents(): void {
    process.on("unhandledRejection", (err) => {
      console.error(
        `Unhandled Rejection detected. Shutting down server...`,
        err,
      );
      this.shutdownServer();
    });

    process.on("uncaughtException", (err) => {
      console.error(
        `Uncaught Exception detected. Shutting down server...`,
        err,
      );
      this.shutdownServer();
    });

    // Handling the server shutdown with SIGTERM and SIGINT
    process.on("SIGTERM", () => {
      console.log("SIGTERM signal received. Shutting down gracefully...");
      this.shutdownServer();
    });

    process.on("SIGINT", () => {
      console.log("SIGINT signal received. Shutting down gracefully...");
      this.shutdownServer();
    });
  }

  private shutdownServer(): void {
    if (this.server) {
      this.server.close(() => {
        logger.info("Server closed!");
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  }
}

new AppServer();
