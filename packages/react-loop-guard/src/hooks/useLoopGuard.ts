/**
 * useLoopGuard Hook
 * 컴포넌트에서 렌더링 및 이펙트 루프를 추적하는 Hook
 */

import { useEffect, useRef } from 'react';
import { renderMonitor } from '../core/monitor';
import { loopDetector } from '../core/detector';

export interface UseLoopGuardOptions {
  /** 컴포넌트 이름 (디버깅용) */
  componentName?: string;
  /** 렌더링 추적 활성화 */
  trackRender?: boolean;
  /** 이펙트 추적 활성화 */
  trackEffect?: boolean;
  /** 이펙트 ID (여러 useLoopGuard를 사용할 경우 구분용) */
  effectId?: string;
  /** 추적할 의존성 배열 */
  dependencies?: any[];
}

/**
 * 렌더링 및 이펙트 무한루프를 추적하는 Hook
 */
export function useLoopGuard(options: UseLoopGuardOptions = {}) {
  const {
    componentName = 'Anonymous',
    trackRender = true,
    trackEffect = true,
    effectId = 'default',
    dependencies = [],
  } = options;

  const renderCountRef = useRef(0);
  const effectCountRef = useRef(0);

  // 렌더링 추적
  if (trackRender) {
    renderCountRef.current += 1;
    renderMonitor.recordRender(componentName);

    // 렌더 루프 감지 (렌더링 중에는 비동기로 체크)
    if (renderCountRef.current > 5) {
      // 최소 5회 이상 렌더링된 후부터 체크
      Promise.resolve().then(() => {
        loopDetector.checkRenderLoop(componentName);
      });
    }
  }

  // 이펙트 추적
  useEffect(() => {
    if (trackEffect) {
      effectCountRef.current += 1;
      renderMonitor.recordEffect(componentName, effectId, dependencies);

      // 이펙트 루프 감지
      if (effectCountRef.current > 5) {
        // 최소 5회 이상 실행된 후부터 체크
        loopDetector.checkEffectLoop(componentName, effectId);
      }
    }
  }, dependencies);

  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      // 컴포넌트가 언마운트될 때 해당 컴포넌트의 기록 초기화
      renderMonitor.clear(componentName);
    };
  }, [componentName]);
}

/**
 * 렌더링만 추적하는 간단한 Hook
 */
export function useRenderGuard(componentName: string = 'Anonymous') {
  useLoopGuard({
    componentName,
    trackRender: true,
    trackEffect: false,
  });
}

/**
 * useEffect 무한루프를 추적하는 Hook
 * 일반 useEffect처럼 사용하되, 무한루프를 자동으로 감지합니다.
 */
export function useGuardedEffect(
  effect: React.EffectCallback,
  deps: React.DependencyList,
  componentName: string = 'Anonymous',
  effectId: string = 'default'
) {
  // 이펙트 실행 전에 추적
  useEffect(() => {
    renderMonitor.recordEffect(componentName, effectId, [...deps]);
    loopDetector.checkEffectLoop(componentName, effectId);
  }, deps);

  // 실제 이펙트 실행
  useEffect(effect, deps);
}
