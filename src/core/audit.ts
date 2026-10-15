import type { AuditEvent } from "./types.js";

export interface AuditSink {
  append(event: AuditEvent): Promise<void>;
}

export class MemoryAuditSink implements AuditSink {
  readonly events: AuditEvent[] = [];

  async append(event: AuditEvent): Promise<void> {
    this.events.push(Object.freeze({ ...event }));
  }
}
