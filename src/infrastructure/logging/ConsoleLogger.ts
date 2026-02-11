import type { ILogger } from "../../domain/interfaces/ILogger.ts";

export class ConsoleLogger implements ILogger {
  info(message: string, data?: Record<string, unknown>): void {
    console.log(JSON.stringify({ level: "info", message, ...data, timestamp: new Date().toISOString() }));
  }

  warn(message: string, data?: Record<string, unknown>): void {
    console.warn(JSON.stringify({ level: "warn", message, ...data, timestamp: new Date().toISOString() }));
  }

  error(message: string, data?: Record<string, unknown>): void {
    console.error(JSON.stringify({ level: "error", message, ...data, timestamp: new Date().toISOString() }));
  }
}
