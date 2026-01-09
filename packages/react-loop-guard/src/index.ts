/**
 * @repo/react-loop-guard
 * React useEffect 무한루프 감지 및 차단 라이브러리
 */

// Core
export { renderMonitor } from './core/monitor';
export type { RenderRecord, EffectRecord } from './core/monitor';

export { loopDetector } from './core/detector';
export type { LoopDetectionConfig, LoopDetectionResult } from './core/detector';

export { loopAnalyzer } from './core/analyzer';
export type { LoopAnalysis, DependencyChange } from './core/analyzer';

// Components
export { LoopGuardProvider, useLoopGuardContext } from './components/LoopGuardProvider';
export type { LoopGuardProviderProps } from './components/LoopGuardProvider';

export { LoopAlert } from './components/LoopAlert';
export type { LoopAlertProps } from './components/LoopAlert';

// Hooks
export { useLoopGuard, useRenderGuard, useGuardedEffect } from './hooks/useLoopGuard';
export type { UseLoopGuardOptions } from './hooks/useLoopGuard';
