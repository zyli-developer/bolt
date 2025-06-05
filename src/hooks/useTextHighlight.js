import { useState, useCallback } from 'react';

/**
 * 通用受控高亮 Hook
 * 支持单条文本和多条文本（通过 id 区分）
 *
 * @returns {
 *   highlightMap, // { [id]: [{start, end, id}] }
 *   addHighlight(id, start, end),
 *   clearHighlights(id?),
 *   renderHighlightedText(text, highlights)
 * }
 */
export default function useTextHighlight() {
  const [highlightMap, setHighlightMap] = useState({});

  // 添加高亮区间
  const addHighlight = useCallback((id, start, end) => {
    if (start === end) return;
    setHighlightMap(prev => {
      const list = prev[id] || [];
      // 避免重复高亮
      if (list.some(hl => start >= hl.start && end <= hl.end)) return prev;
      return {
        ...prev,
        [id]: [...list, { start, end, id: Date.now() + '-' + Math.random() }]
      };
    });
  }, []);

  // 清除高亮
  const clearHighlights = useCallback((id) => {
    if (!id) {
      setHighlightMap({});
    } else {
      setHighlightMap(prev => {
        const newMap = { ...prev };
        delete newMap[id];
        return newMap;
      });
    }
  }, []);

  // 渲染高亮文本
  const renderHighlightedText = useCallback((text, highlights) => {
    if (!highlights || !highlights.length) return text;
    const sorted = [...highlights].sort((a, b) => a.start - b.start);
    const result = [];
    let lastIndex = 0;
    sorted.forEach((hl, idx) => {
      if (hl.start > lastIndex) result.push(text.slice(lastIndex, hl.start));
      result.push(
        <span key={hl.id || idx} className="text-highlight-selection">
          {text.slice(hl.start, hl.end)}
        </span>
      );
      lastIndex = hl.end;
    });
    if (lastIndex < text.length) result.push(text.slice(lastIndex));
    return result;
  }, []);

  return {
    highlightMap,
    addHighlight,
    clearHighlights,
    renderHighlightedText,
  };
} 