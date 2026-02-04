import logger from '@/lib/logger';

/**
 * Performance timing utility for measuring server component render times
 */
export class PerformanceTimer {
  private timings: Map<string, number> = new Map();
  private startTime: number;

  constructor(private label: string) {
    this.startTime = Date.now();
  }

  mark(label: string) {
    this.timings.set(label, Date.now() - this.startTime);
  }

  end() {
    const totalTime = Date.now() - this.startTime;
    
    if (process.env.NODE_ENV === 'development') {
      logger.debug(`[Performance] ${this.label} - Total: ${totalTime}ms`);
      this.timings.forEach((time, label) => {
        logger.debug(`  ${label}: ${time}ms`);
      });
    }
    
    return { totalTime, timings: Object.fromEntries(this.timings) };
  }
}
