/**
 * 무한루프 감지 로직
 */

import { renderMonitor } from './monitor';

export interface LoopDetectionConfig {
  /** 검사할 시간 창 (밀리초) */
  timeWindowMs: number;
  /** 시간 창 내에서 허용되는 최대 렌더/이펙트 실행 횟수 */
  maxExecutions: number;
  /** 감지 활성화 여부 */
  enabled: boolean;
}

export interface LoopDetectionResult {
  isLoop: boolean;
  componentName: string;
  type: 'render' | 'effect';
  executionCount: number;
  timeWindowMs: number;
  effectId?: string;
}

const DEFAULT_CONFIG: LoopDetectionConfig = {
  timeWindowMs: 1000, // 1초
  maxExecutions: 50, // 1초에 50회 이상 실행되면 무한루프로 간주
  enabled: true,
};

class LoopDetector {
  private config: LoopDetectionConfig = DEFAULT_CONFIG;
  private detectedLoops: Set<string> = new Set();
  private blockedLoops: Set<string> = new Set(); // 차단된 루프 목록
  private onLoopDetectedCallbacks: Array<(result: LoopDetectionResult) => void> = [];

  /**
   * 설정 업데이트
   */
  configure(config: Partial<LoopDetectionConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 현재 설정 조회
   */
  getConfig(): LoopDetectionConfig {
    return { ...this.config };
  }

  /**
   * 렌더링 무한루프 검사
   */
  checkRenderLoop(componentName: string): LoopDetectionResult | null {
    if (!this.config.enabled) return null;

    const count = renderMonitor.getRenderCount(componentName, this.config.timeWindowMs);

    if (count >= this.config.maxExecutions) {
      const loopKey = `render:${componentName}`;

      // 이미 감지된 루프는 중복 알림 방지
      if (this.detectedLoops.has(loopKey)) return null;

      const result: LoopDetectionResult = {
        isLoop: true,
        componentName,
        type: 'render',
        executionCount: count,
        timeWindowMs: this.config.timeWindowMs,
      };

      this.detectedLoops.add(loopKey);
      this.notifyLoopDetected(result);

      return result;
    }

    return null;
  }

  /**
   * 이펙트 무한루프 검사
   */
  checkEffectLoop(componentName: string, effectId: string): LoopDetectionResult | null {
    if (!this.config.enabled) return null;

    const loopKey = `effect:${componentName}:${effectId}`;

    // 이미 차단된 루프는 더 이상 실행하지 않음
    if (this.blockedLoops.has(loopKey)) {
      return null;
    }

    const count = renderMonitor.getEffectCount(componentName, effectId, this.config.timeWindowMs);

    if (count >= this.config.maxExecutions) {
      // 이미 감지된 루프는 중복 알림 방지
      if (this.detectedLoops.has(loopKey)) return null;

      const result: LoopDetectionResult = {
        isLoop: true,
        componentName,
        type: 'effect',
        executionCount: count,
        timeWindowMs: this.config.timeWindowMs,
        effectId,
      };

      this.detectedLoops.add(loopKey);
      this.blockedLoops.add(loopKey); // 루프 차단
      this.notifyLoopDetected(result);

      return result;
    }

    return null;
  }

  /**
   * 루프 감지 콜백 등록
   */
  onLoopDetected(callback: (result: LoopDetectionResult) => void): () => void {
    this.onLoopDetectedCallbacks.push(callback);

    // 구독 해제 함수 반환
    return () => {
      const index = this.onLoopDetectedCallbacks.indexOf(callback);
      if (index > -1) {
        this.onLoopDetectedCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * 감지된 루프 알림
   */
  private notifyLoopDetected(result: LoopDetectionResult): void {
    this.onLoopDetectedCallbacks.forEach(callback => {
      try {
        callback(result);
      } catch (error) {
        console.error('[LoopGuard] Error in loop detection callback:', error);
      }
    });
  }

  /**
   * 특정 컴포넌트의 감지 상태 초기화
   */
  reset(componentName?: string): void {
    if (componentName) {
      // 해당 컴포넌트 관련 감지 기록만 삭제
      for (const key of this.detectedLoops) {
        if (key.includes(componentName)) {
          this.detectedLoops.delete(key);
        }
      }
      for (const key of this.blockedLoops) {
        if (key.includes(componentName)) {
          this.blockedLoops.delete(key);
        }
      }
      renderMonitor.clear(componentName);
    } else {
      this.detectedLoops.clear();
      this.blockedLoops.clear();
      renderMonitor.clear();
    }
  }

  /**
   * 감지 활성화/비활성화
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    if (!enabled) {
      this.detectedLoops.clear();
      this.blockedLoops.clear();
    }
  }

  /**
   * 특정 루프가 차단되었는지 확인
   */
  isLoopBlocked(componentName: string, effectId?: string): boolean {
    if (effectId) {
      return this.blockedLoops.has(`effect:${componentName}:${effectId}`);
    }
    return this.blockedLoops.has(`render:${componentName}`);
  }
}

// 싱글톤 인스턴스
export const loopDetector = new LoopDetector();
