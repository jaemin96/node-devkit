import { useState, useEffect } from "react";
import { loopDetector, renderMonitor } from "@devkit/react-loop-guard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface InfiniteLoopTestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * 무한루프 테스트용 모달
 * 모달이 열리면 의도적으로 useEffect 무한루프에 돌입합니다.
 */
export function InfiniteLoopTestModal({
  open,
  onOpenChange,
}: InfiniteLoopTestModalProps) {
  const [count, setCount] = useState(0);
  const [data, setData] = useState({ value: 0 });

  // 무한루프 생성: 의존성 배열에 객체가 있고, 이펙트 내부에서 그 객체를 갱신
  useEffect(() => {
    if (!open) return;

    // 무한루프가 차단되었는지 확인
    const isBlocked = loopDetector.isLoopBlocked("InfiniteLoopTestModal", "infinite-loop");

    if (isBlocked) {
      // 루프가 차단되었으면 더 이상 실행하지 않음
      console.log(`%c[LoopGuard] ⛔ 무한루프가 차단되어 더 이상 실행되지 않습니다.`, 'color: #dc2626; font-weight: bold;');
      return;
    }

    // 이펙트 실행 로그
    console.log(`%c[LoopGuard] 🔄 useEffect 실행 중... (${count}회)`, 'color: #ea580c;');

    // 이펙트 실행 기록
    renderMonitor.recordEffect("InfiniteLoopTestModal", "infinite-loop", [data, open, count]);

    // 루프 감지 체크
    const result = loopDetector.checkEffectLoop("InfiniteLoopTestModal", "infinite-loop");

    if (result) {
      // 루프가 감지되면 차단 로그 출력
      console.log(`%c[LoopGuard] 🚨 무한루프 감지! 루프를 중단합니다.`, 'color: #dc2626; font-weight: bold; font-size: 14px;');
      console.log(`%c- 컴포넌트: ${result.componentName}`, 'color: #dc2626;');
      console.log(`%c- 실행 횟수: ${result.executionCount}회 (${result.timeWindowMs}ms 내)`, 'color: #dc2626;');
      return;
    }

    // 매번 새로운 객체를 생성하므로 무한루프 발생
    setData({ value: count + 1 });
    setCount((prev) => prev + 1);
  }, [data, open, count]); // data가 매번 새로운 참조라서 무한루프

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!open) {
      setCount(0);
      setData({ value: 0 });
      loopDetector.reset("InfiniteLoopTestModal");
      console.log(`%c[LoopGuard] ✅ 모달이 닫혀 상태를 초기화했습니다.`, 'color: #16a34a;');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>무한루프 테스트</DialogTitle>
          <DialogDescription>
            이 모달이 열리면 useEffect 무한루프가 발생합니다.
            <br />
            Loop Guard가 이를 감지하고 경고를 표시합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-900">
              현재 실행 횟수: {count}
            </p>
            <p className="mt-1 text-xs text-red-700">
              data.value: {data.value}
            </p>
            <p className="mt-2 text-xs text-red-600">
              이 숫자가 빠르게 증가하면 무한루프가 발생한 것입니다.
            </p>
          </div>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-xs font-medium text-yellow-900">
              무한루프 원인:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-yellow-800">
              <li>useEffect 의존성 배열에 객체(data)가 있음</li>
              <li>이펙트 내부에서 setData로 새 객체 생성</li>
              <li>새 객체는 다른 참조라서 다시 이펙트 실행</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
