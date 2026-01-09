/**
 * 무한루프 원인 분석
 */

import { renderMonitor, EffectRecord } from './monitor';
import { LoopDetectionResult } from './detector';

export interface LoopAnalysis {
  /** 루프 감지 결과 */
  detection: LoopDetectionResult;
  /** 예상 원인 */
  possibleCauses: string[];
  /** 제안 사항 */
  suggestions: string[];
  /** 의존성 변경 히스토리 (effect 루프인 경우) */
  dependencyChanges?: DependencyChange[];
}

export interface DependencyChange {
  timestamp: number;
  dependencies: any[];
  changed: boolean;
}

class LoopAnalyzer {
  /**
   * 루프 분석 수행
   */
  analyze(detection: LoopDetectionResult): LoopAnalysis {
    if (detection.type === 'render') {
      return this.analyzeRenderLoop(detection);
    } else {
      return this.analyzeEffectLoop(detection);
    }
  }

  /**
   * 렌더링 루프 분석
   */
  private analyzeRenderLoop(detection: LoopDetectionResult): LoopAnalysis {
    const possibleCauses: string[] = [];
    const suggestions: string[] = [];

    // 일반적인 렌더 루프 원인들
    possibleCauses.push(
      'setState가 렌더링 중에 직접 호출되고 있을 수 있습니다.',
      '부모 컴포넌트가 빠르게 리렌더링되고 있을 수 있습니다.',
      '새로운 객체나 배열이 매 렌더마다 생성되어 props로 전달되고 있을 수 있습니다.'
    );

    suggestions.push(
      'setState 호출을 useEffect나 이벤트 핸들러 내부로 이동하세요.',
      '부모 컴포넌트에서 React.memo()를 사용하여 불필요한 리렌더링을 방지하세요.',
      'useMemo()나 useCallback()을 사용하여 객체/함수 참조를 안정화하세요.',
      '컴포넌트 외부에서 상태를 변경하는 로직이 있는지 확인하세요.'
    );

    return {
      detection,
      possibleCauses,
      suggestions,
    };
  }

  /**
   * 이펙트 루프 분석
   */
  private analyzeEffectLoop(detection: LoopDetectionResult): LoopAnalysis {
    const possibleCauses: string[] = [];
    const suggestions: string[] = [];
    let dependencyChanges: DependencyChange[] | undefined;

    // 이펙트 히스토리 조회
    if (detection.effectId) {
      const history = renderMonitor.getEffectHistory(
        detection.componentName,
        detection.effectId
      );

      // 의존성 변경 분석
      dependencyChanges = this.analyzeDependencyChanges(history);

      if (dependencyChanges.some(change => change.changed)) {
        possibleCauses.push(
          'useEffect의 의존성 배열에 포함된 값이 매번 변경되고 있습니다.',
          '이펙트 내부에서 상태를 업데이트하고, 그 상태가 의존성 배열에 포함되어 있습니다.'
        );

        suggestions.push(
          '의존성 배열의 값들이 매 렌더마다 새로 생성되지 않도록 useMemo/useCallback을 사용하세요.',
          '이펙트 내부에서 setState 호출 시 함수형 업데이트를 사용하고, 해당 상태를 의존성에서 제거하세요.',
          '불필요한 의존성이 배열에 포함되어 있지 않은지 확인하세요.'
        );
      }
    }

    possibleCauses.push(
      'useEffect 내부에서 상태를 변경하고, 그 상태가 의존성 배열에 포함되어 있을 수 있습니다.',
      '의존성 배열에 객체나 배열이 포함되어 있고, 매번 새로 생성되고 있을 수 있습니다.',
      'useEffect가 비동기 작업 후 unmount된 컴포넌트의 상태를 업데이트하려 할 수 있습니다.'
    );

    suggestions.push(
      'useEffect 내부의 setState를 함수형 업데이트로 변경하세요: setState(prev => newValue)',
      '의존성 배열의 객체/배열을 useMemo로 메모이제이션하세요.',
      '클린업 함수에서 isMounted 플래그를 사용하여 상태 업데이트를 방지하세요.',
      '정말 필요한 의존성만 배열에 포함시키세요.'
    );

    return {
      detection,
      possibleCauses,
      suggestions,
      dependencyChanges,
    };
  }

  /**
   * 의존성 변경 내역 분석
   */
  private analyzeDependencyChanges(history: EffectRecord[]): DependencyChange[] {
    const changes: DependencyChange[] = [];

    for (let i = 0; i < history.length; i++) {
      const current = history[i];
      const previous = i > 0 ? history[i - 1] : null;

      const changed = previous
        ? this.haveDependenciesChanged(previous.dependencies, current.dependencies)
        : false;

      changes.push({
        timestamp: current.timestamp,
        dependencies: current.dependencies || [],
        changed,
      });
    }

    return changes;
  }

  /**
   * 의존성 배열 비교
   */
  private haveDependenciesChanged(prev: any[] | undefined, curr: any[] | undefined): boolean {
    if (!prev || !curr) return false;
    if (prev.length !== curr.length) return true;

    for (let i = 0; i < prev.length; i++) {
      if (!Object.is(prev[i], curr[i])) {
        return true;
      }
    }

    return false;
  }
}

// 싱글톤 인스턴스
export const loopAnalyzer = new LoopAnalyzer();
