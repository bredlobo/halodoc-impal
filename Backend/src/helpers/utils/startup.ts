/**
 * startup.ts
 *
 * All one-time tasks that must run after the server boots.
 * Import and call `runStartupTasks()` from index.ts — keep index.ts clean.
 */

import ConsultationsRepository from "@/modules/Consultations/repositories/consultations-repositories";
import ConsultationsService from "@/modules/Consultations/services/consultations-services";

export async function runStartupTasks(): Promise<void> {
  // 1. Cancel any REQUESTED consultations that expired while the server was down
  try {
    const { count } = await ConsultationsRepository.cancelExpiredConsultations();
    if (count > 0) {
      console.log(`[startup] Cleaned up ${count} expired consultation request(s).`);
    }
  } catch (err) {
    console.error("[startup] Failed to clean up expired consultations:", err);
  }

  // 2. Re-arm 30-minute session timers for any ONGOING consultations
  try {
    await ConsultationsService.recoverSessionTimers();
  } catch (err) {
    console.error("[startup] Failed to recover session timers:", err);
  }
}
