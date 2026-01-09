/**
 * Loop Alert UI 컴포넌트
 */

import React, { useState } from 'react';
import { useLoopGuardContext } from './LoopGuardProvider';
import type { LoopAnalysis } from '../core/analyzer';

export interface LoopAlertProps {
  /** 알림 위치 */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  /** 최대 표시 개수 */
  maxVisible?: number;
  /** 커스텀 스타일 */
  style?: React.CSSProperties;
  /** 커스텀 클래스 */
  className?: string;
}

export function LoopAlert({
  position = 'top-right',
  maxVisible = 3,
  style,
  className = '',
}: LoopAlertProps) {
  const { detectedLoops, dismissLoop, dismissAllLoops } = useLoopGuardContext();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (detectedLoops.length === 0) {
    return null;
  }

  const visibleLoops = detectedLoops.slice(-maxVisible);

  const positionStyles: Record<string, React.CSSProperties> = {
    'top-right': { top: '1rem', right: '1rem' },
    'top-left': { top: '1rem', left: '1rem' },
    'bottom-right': { bottom: '1rem', right: '1rem' },
    'bottom-left': { bottom: '1rem', left: '1rem' },
  };

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    ...positionStyles[position],
    zIndex: 9999,
    maxWidth: '500px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    ...style,
  };

  return (
    <div style={containerStyle} className={className}>
      {visibleLoops.map((loop, visibleIndex) => {
        // 실제 배열에서의 인덱스 계산
        const actualIndex = detectedLoops.length - visibleLoops.length + visibleIndex;
        return (
          <LoopAlertItem
            key={actualIndex}
            loop={loop}
            index={visibleIndex}
            expanded={expandedIndex === visibleIndex}
            onToggle={() => setExpandedIndex(expandedIndex === visibleIndex ? null : visibleIndex)}
            onDismiss={() => dismissLoop(actualIndex)}
          />
        );
      })}

      {detectedLoops.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log('Dismiss all button clicked!');
            dismissAllLoops();
          }}
          style={{
            marginTop: '0.5rem',
            width: '100%',
            padding: '0.5rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
          }}
        >
          모두 닫기 ({detectedLoops.length}개)
        </button>
      )}
    </div>
  );
}

interface LoopAlertItemProps {
  loop: LoopAnalysis;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onDismiss: () => void;
}

function LoopAlertItem({ loop, expanded, onToggle, onDismiss }: LoopAlertItemProps) {
  const { detection, possibleCauses, suggestions } = loop;

  const alertStyle: React.CSSProperties = {
    backgroundColor: '#fef2f2',
    border: '2px solid #ef4444',
    borderRadius: '0.5rem',
    padding: '1rem',
    marginBottom: '0.75rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontSize: '0.875rem',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem',
  };

  const titleStyle: React.CSSProperties = {
    fontWeight: '600',
    color: '#991b1b',
    fontSize: '1rem',
    margin: 0,
    flex: 1,
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem',
    marginLeft: '0.5rem',
    color: '#991b1b',
    fontSize: '1.25rem',
    lineHeight: 1,
  };

  const badgeStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '0.125rem 0.5rem',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    marginRight: '0.5rem',
  };

  const sectionStyle: React.CSSProperties = {
    marginTop: '0.75rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid #fecaca',
  };

  return (
    <div style={alertStyle}>
      <div style={headerStyle}>
        <div style={{ flex: 1 }}>
          <h3 style={titleStyle}>
            무한루프 감지됨!
          </h3>
          <div style={{ marginTop: '0.25rem' }}>
            <span style={badgeStyle}>{detection.type === 'render' ? '렌더' : '이펙트'}</span>
            <span style={{ color: '#7f1d1d', fontWeight: '500' }}>
              {detection.componentName}
            </span>
          </div>
          <div style={{ marginTop: '0.25rem', color: '#991b1b', fontSize: '0.75rem' }}>
            {detection.executionCount}회 실행 ({detection.timeWindowMs}ms 내)
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            style={buttonStyle}
            title={expanded ? '접기' : '자세히'}
          >
            {expanded ? '−' : '+'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log('Dismiss button clicked!');
              onDismiss();
            }}
            style={buttonStyle}
            title="닫기"
          >
            ×
          </button>
        </div>
      </div>

      {expanded && (
        <>
          <div style={sectionStyle}>
            <strong style={{ color: '#991b1b' }}>예상 원인:</strong>
            <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', color: '#7f1d1d' }}>
              {possibleCauses.map((cause, i) => (
                <li key={i} style={{ marginBottom: '0.25rem' }}>
                  {cause}
                </li>
              ))}
            </ul>
          </div>

          <div style={sectionStyle}>
            <strong style={{ color: '#991b1b' }}>해결 방법:</strong>
            <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', color: '#7f1d1d' }}>
              {suggestions.map((suggestion, i) => (
                <li key={i} style={{ marginBottom: '0.25rem' }}>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
