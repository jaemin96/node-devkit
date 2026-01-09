/**
 * Loop Guard Provider 컴포넌트
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  loopDetector,
  LoopDetectionConfig,
  LoopDetectionResult,
} from "../core/detector";
import { loopAnalyzer, LoopAnalysis } from "../core/analyzer";

interface LoopGuardContextValue {
  /** 현재 감지된 루프 목록 */
  detectedLoops: LoopAnalysis[];
  /** 루프 감지 설정 */
  config: LoopDetectionConfig;
  /** 설정 업데이트 */
  updateConfig: (config: Partial<LoopDetectionConfig>) => void;
  /** 특정 루프 무시 */
  dismissLoop: (index: number) => void;
  /** 모든 루프 무시 */
  dismissAllLoops: () => void;
  /** 감지 초기화 */
  reset: (componentName?: string) => void;
}

const LoopGuardContext = createContext<LoopGuardContextValue | null>(null);

export interface LoopGuardProviderProps {
  children: ReactNode;
  /** 초기 설정 */
  config?: Partial<LoopDetectionConfig>;
  /** 루프 감지 시 자동으로 에러를 throw할지 여부 */
  throwOnLoop?: boolean;
  /** 개발 모드에서만 활성화 */
  devOnly?: boolean;
}

export function LoopGuardProvider({
  children,
  config,
  throwOnLoop = false,
  devOnly = true,
}: LoopGuardProviderProps) {
  const [detectedLoops, setDetectedLoops] = useState<LoopAnalysis[]>([]);
  const [currentConfig, setCurrentConfig] = useState<LoopDetectionConfig>(
    () => {
      const defaultConfig = loopDetector.getConfig();
      return { ...defaultConfig, ...config };
    }
  );

  // 개발 모드 체크
  const isEnabled = devOnly ? process.env.NODE_ENV === "development" : true;

  useEffect(() => {
    if (!isEnabled) {
      loopDetector.setEnabled(false);
      return;
    }

    // 초기 설정 적용
    loopDetector.configure(currentConfig);

    // 루프 감지 리스너 등록
    const unsubscribe = loopDetector.onLoopDetected(
      (result: LoopDetectionResult) => {
        const analysis = loopAnalyzer.analyze(result);

        setDetectedLoops((prev) => [...prev, analysis]);

        // 에러 throw 옵션
        if (throwOnLoop) {
          throw new Error(
            `[LoopGuard] 무한루프 감지: ${result.componentName} (${result.type})`
          );
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [isEnabled, currentConfig, throwOnLoop]);

  const updateConfig = (newConfig: Partial<LoopDetectionConfig>) => {
    setCurrentConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      loopDetector.configure(updated);
      return updated;
    });
  };

  const dismissLoop = (index: number) => {
    setDetectedLoops((prev) => prev.filter((_, i) => i !== index));
  };

  const dismissAllLoops = () => {
    setDetectedLoops([]);
  };

  const reset = (componentName?: string) => {
    loopDetector.reset(componentName);
    setDetectedLoops([]);
  };

  const value: LoopGuardContextValue = {
    detectedLoops,
    config: currentConfig,
    updateConfig,
    dismissLoop,
    dismissAllLoops,
    reset,
  };

  if (!isEnabled) {
    return <>{children}</>;
  }

  return (
    <LoopGuardContext.Provider value={value}>
      {children}
    </LoopGuardContext.Provider>
  );
}

/**
 * Loop Guard Context Hook
 */
export function useLoopGuardContext(): LoopGuardContextValue {
  const context = useContext(LoopGuardContext);

  if (!context) {
    throw new Error(
      "useLoopGuardContext must be used within LoopGuardProvider"
    );
  }

  return context;
}
