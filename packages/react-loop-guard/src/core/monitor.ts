/**
 * 렌더링 및 이펙트 실행을 추적하는 모니터
 */

export interface RenderRecord {
  componentName: string;
  timestamp: number;
  count: number;
}

export interface EffectRecord {
  componentName: string;
  effectId: string;
  timestamp: number;
  count: number;
  dependencies?: any[];
}

class RenderMonitor {
  private renderHistory: Map<string, RenderRecord[]> = new Map();
  private effectHistory: Map<string, EffectRecord[]> = new Map();
  private readonly HISTORY_LIMIT = 100; // 최근 100개만 유지

  /**
   * 컴포넌트 렌더링 기록
   */
  recordRender(componentName: string): void {
    const now = Date.now();
    const history = this.renderHistory.get(componentName) || [];

    const lastRecord = history[history.length - 1];
    const newRecord: RenderRecord = {
      componentName,
      timestamp: now,
      count: lastRecord ? lastRecord.count + 1 : 1,
    };

    history.push(newRecord);

    // 히스토리 제한
    if (history.length > this.HISTORY_LIMIT) {
      history.shift();
    }

    this.renderHistory.set(componentName, history);
  }

  /**
   * 이펙트 실행 기록
   */
  recordEffect(componentName: string, effectId: string, dependencies?: any[]): void {
    const now = Date.now();
    const key = `${componentName}:${effectId}`;
    const history = this.effectHistory.get(key) || [];

    const lastRecord = history[history.length - 1];
    const newRecord: EffectRecord = {
      componentName,
      effectId,
      timestamp: now,
      count: lastRecord ? lastRecord.count + 1 : 1,
      dependencies,
    };

    history.push(newRecord);

    // 히스토리 제한
    if (history.length > this.HISTORY_LIMIT) {
      history.shift();
    }

    this.effectHistory.set(key, history);
  }

  /**
   * 특정 시간 범위 내의 렌더링 횟수 조회
   */
  getRenderCount(componentName: string, timeWindowMs: number): number {
    const history = this.renderHistory.get(componentName);
    if (!history) return 0;

    const now = Date.now();
    const cutoff = now - timeWindowMs;

    return history.filter(record => record.timestamp >= cutoff).length;
  }

  /**
   * 특정 시간 범위 내의 이펙트 실행 횟수 조회
   */
  getEffectCount(componentName: string, effectId: string, timeWindowMs: number): number {
    const key = `${componentName}:${effectId}`;
    const history = this.effectHistory.get(key);
    if (!history) return 0;

    const now = Date.now();
    const cutoff = now - timeWindowMs;

    return history.filter(record => record.timestamp >= cutoff).length;
  }

  /**
   * 전체 렌더 히스토리 조회
   */
  getRenderHistory(componentName: string): RenderRecord[] {
    return this.renderHistory.get(componentName) || [];
  }

  /**
   * 전체 이펙트 히스토리 조회
   */
  getEffectHistory(componentName: string, effectId: string): EffectRecord[] {
    const key = `${componentName}:${effectId}`;
    return this.effectHistory.get(key) || [];
  }

  /**
   * 특정 컴포넌트의 기록 초기화
   */
  clear(componentName?: string): void {
    if (componentName) {
      this.renderHistory.delete(componentName);
      // 해당 컴포넌트의 모든 이펙트 기록도 삭제
      for (const key of this.effectHistory.keys()) {
        if (key.startsWith(`${componentName}:`)) {
          this.effectHistory.delete(key);
        }
      }
    } else {
      this.renderHistory.clear();
      this.effectHistory.clear();
    }
  }

  /**
   * 모든 활성 컴포넌트 목록
   */
  getActiveComponents(): string[] {
    return Array.from(this.renderHistory.keys());
  }
}

// 싱글톤 인스턴스
export const renderMonitor = new RenderMonitor();
