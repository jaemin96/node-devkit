import { useState } from "react";
import { Button } from "./components/ui/button";
import { InfiniteLoopTestModal } from "./components/InfiniteLoopTestModal";
import { LoopGuardProvider, LoopAlert } from "@devkit/react-loop-guard";

function App() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <LoopGuardProvider
      config={{
        timeWindowMs: 1000,
        maxExecutions: 50,
      }}
      devOnly={true}
    >
      <LoopAlert position="top-right" maxVisible={3} />

      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-blue-950 text-3xl font-bold mb-2">Node Devkit - Loop Guard Test</h1>
          <p className="text-gray-600 mb-8">React useEffect 무한루프 감지 및 차단 데모</p>

          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">무한루프 테스트</h2>
              <p className="text-sm text-gray-600 mb-4">
                아래 버튼을 클릭하면 의도적으로 무한루프가 발생하는 모달이 열립니다. Loop Guard가 이를
                감지하고 우측 상단에 경고를 표시합니다.
              </p>
              <Button onClick={() => setModalOpen(true)} variant="destructive" size="lg">
                무한루프 테스트 시작
              </Button>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">테스트 시나리오:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li>모달이 열리면 useEffect 무한루프 발생</li>
                <li>1초 내에 50회 이상 실행되면 Loop Guard가 감지</li>
                <li>콘솔에 상세한 에러 정보 출력</li>
                <li>우측 상단에 시각적 경고 표시</li>
                <li>예상 원인과 해결 방법 제시</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <InfiniteLoopTestModal open={modalOpen} onOpenChange={setModalOpen} />
    </LoopGuardProvider>
  );
}

export default App;
