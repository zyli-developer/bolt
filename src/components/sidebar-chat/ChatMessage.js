import React, { useState, useContext, useRef, useEffect } from 'react';
import { ArrowLeftOutlined, ArrowRightOutlined, PlusOutlined, MessageOutlined, UnorderedListOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import AnnotationModal from '../annotations/AnnotationModal';
import annotationService from '../../services/annotationService';
import { message as messageApi } from 'antd';
import { OptimizationContext, OPTIMIZATION_STEP_CHANGE_EVENT } from '../../contexts/OptimizationContext';
import { useChatContext } from '../../contexts/ChatContext';
import TextContextMenu from '../context/TextContextMenu';
import { extractSessionData } from '../../lib/tim/message';
import { CUSTOM_MESSAGE_TYPE } from '../../lib/tim/constants';
import '../../styles/components/sidebar-chat/ChatMessage.css'; // 导入样式文件
import useTextHighlight from '../../hooks/useTextHighlight';

// 引用类型定义
const QUOTE_TYPES = {
  TEXT: 'text',
  VIEWPOINT: 'viewpoint',
};

const ChatMessage = ({ message }) => {
  const { 
    currentSession, 
    sessionHistory, 
    expandedSessions, 
    toggleSessionExpand,
    endCurrentSession
  } = useChatContext();
  
  const isUser = message.sender === "user";
  const [isAnnotationModalVisible, setIsAnnotationModalVisible] = useState(false);
  console.log('[ChatMessage] useState 初始化', { isAnnotationModalVisible });
  const [contextMenu, setContextMenu] = useState(null);
  const [initialContentForModal, setInitialContentForModal] = useState('');
  const [isMultiSelectActive, setIsMultiSelectActive] = useState(false);
  const [isMultiSelectTempMode, setIsMultiSelectTempMode] = useState(false);
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [selectionRanges, setSelectionRanges] = useState([]);
  const [discussModalVisible, setDiscussModalVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const messageRef = useRef(null);
  
  // 使用全局的OptimizationContext
  const { 
    isOptimizationMode,
    currentOptimizationStep,
    addComment
  } = useContext(OptimizationContext);
  
  // 本地状态跟踪当前优化步骤
  const [localOptimizationStep, setLocalOptimizationStep] = useState(currentOptimizationStep);
  const [localOptimizationMode, setLocalOptimizationMode] = useState(isOptimizationMode);
  
  // 受控高亮 hook，id 用 message.id
  const { highlightMap, addHighlight, clearHighlights, renderHighlightedText } = useTextHighlight();
  const textRef = useRef();
  
  // 监听步骤变更事件
  useEffect(() => {
    console.log('[ChatMessage] useEffect 监听步骤变更事件');
    const handleStepChange = (event) => {
      const { step, isOptimizationMode } = event.detail;
      console.log(`收到步骤变更事件，步骤: ${step}, 优化模式: ${isOptimizationMode}`);
      setLocalOptimizationStep(step);
      setLocalOptimizationMode(isOptimizationMode);
    };
    
    // 监听全局步骤变更事件
    window.addEventListener(OPTIMIZATION_STEP_CHANGE_EVENT, handleStepChange);
    
    // 卸载时移除监听
    return () => {
      window.removeEventListener(OPTIMIZATION_STEP_CHANGE_EVENT, handleStepChange);
    };
  }, []);
  
  // 当全局步骤变更时，同步到本地状态
  useEffect(() => {
    console.log('[ChatMessage] useEffect 同步全局步骤到本地', { currentOptimizationStep, isOptimizationMode });
    setLocalOptimizationStep(currentOptimizationStep);
    setLocalOptimizationMode(isOptimizationMode);
  }, [currentOptimizationStep, isOptimizationMode]);
  
  // 检查当前消息是否是Session分割线
  const isSessionDivider = () => {
    // 检查消息对象中的类型标记
    if (message.type === 'custom' && message.sessionData) {
      return true;
    }
    
    // 检查消息的cloudCustomData
    if (message.cloudCustomData) {
      try {
        const cloudData = JSON.parse(message.cloudCustomData);
        if (cloudData.sessionType && (
          cloudData.sessionType === CUSTOM_MESSAGE_TYPE.SESSION_START ||
          cloudData.sessionType === CUSTOM_MESSAGE_TYPE.SESSION_END
        )) {
          return true;
        }
      } catch (e) {
        console.error('解析cloudCustomData失败', e);
      }
    }
    
    // 从消息中提取sessionData
    const sessionData = extractSessionData(message);
    return sessionData && (
      sessionData.sessionType === CUSTOM_MESSAGE_TYPE.SESSION_START || 
      sessionData.sessionType === CUSTOM_MESSAGE_TYPE.SESSION_END
    );
  };
  
  // 获取Session信息
  const getSessionInfo = () => {
    if (!isSessionDivider()) return null;
    
    // 如果消息对象中已有sessionData，直接使用
    if (message.sessionData) {
      return {
        id: message.sessionData.sessionId,
        type: message.sessionData.sessionType,
        quoteContent: message.sessionData.quoteContent
      };
    }
    
    // 从cloudCustomData中提取
    if (message.cloudCustomData) {
      try {
        const cloudData = JSON.parse(message.cloudCustomData);
        if (cloudData.sessionType) {
          return {
            id: cloudData.sessionId,
            type: cloudData.sessionType,
            quoteContent: cloudData.quoteContent
          };
        }
      } catch (e) {
        console.error('解析sessionInfo失败', e);
      }
    }
    
    // 使用extractSessionData提取
    const sessionData = extractSessionData(message);
    if (!sessionData) return null;
    
    return {
      id: sessionData.sessionId,
      type: sessionData.sessionType,
      quoteContent: sessionData.quoteContent
    };
  };
  
  // 检查会话是否展开
  const isSessionExpanded = () => {
    const sessionInfo = getSessionInfo();
    if (!sessionInfo) return true;
    
    return expandedSessions[sessionInfo.id] !== false; // 默认展开
  };
  
  // 处理会话展开/折叠
  const handleToggleExpand = () => {
    const sessionInfo = getSessionInfo();
    if (!sessionInfo) return;
    
    const sessionId = sessionInfo.id;
    const currentExpandedState = expandedSessions[sessionId] !== false;
    
    console.log(`切换会话${sessionId}的展开状态: ${currentExpandedState ? '展开→折叠' : '折叠→展开'}`);
    
    // 调用context中的函数切换会话展开状态
    toggleSessionExpand(sessionId);
  };
  
  // 处理会话关闭
  const handleCloseSession = () => {
    if (currentSession) {
      endCurrentSession();
    }
  };

  // 处理右键菜单
  const handleContextMenu = (e) => {
    console.log('[ChatMessage] handleContextMenu', e);
    if(!isOptimizationMode) return;
    e.preventDefault();
    
    // 获取选中的文本
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    const isModifierKeyPressed = e.ctrlKey || e.metaKey; // 检测Ctrl/Command键
    
    // 如果有选中文本，处理连续选择
    if (selectedText) {
      // 创建选择的范围信息
      const range = selection.getRangeAt(0);
      const newSelectionRange = {
        range: range.cloneRange(),
        text: selectedText
      };
      
      // 检查此文本是否已被高亮，避免重复选择
      const hasHighlight = range.commonAncestorContainer.closest?.('.text-highlight-selection');
      if (hasHighlight) {
        // 如果已经是高亮元素，仅显示右键菜单，不进行其他处理
        setContextMenu({
          x: e.clientX,
          y: e.clientY
        });
        return;
      }
      
      // 连续选择模式处理
      if (isMultiSelectActive || isMultiSelectTempMode || isModifierKeyPressed) {
        // 检查文本是否已存在于选择列表中
        if (!selectedTexts.includes(selectedText)) {
          // 添加到已选择的文本列表
          setSelectedTexts(prev => [...prev, selectedText]);
          setSelectionRanges(prev => [...prev, newSelectionRange]);
          
          // 应用高亮样式，保持选中状态
          applyHighlightToSelection(range, selectedText);
        }
      } else {
        // 普通选择，清除之前的选择
        clearAllHighlights();
        setSelectedTexts([selectedText]);
        setSelectionRanges([newSelectionRange]);
        
        // 对第一次选中的文本也应用高亮
        applyHighlightToSelection(range, selectedText);
      }
      
      // 设置当前选中的文本
      setSelectedText(selectedText);
    }
    
    // 显示右键菜单
    setContextMenu({
      x: e.clientX,
      y: e.clientY
    });
  };

  // 应用高亮样式到选中文本
  const applyHighlightToSelection = (ranges, text) => {
    console.log('[ChatMessage] applyHighlightToSelection', { ranges, text });
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
  
    const range = selection.getRangeAt(0);
  
    // 只允许高亮同一个文本节点中的选区
    if (
      range.startContainer.nodeType !== Node.TEXT_NODE ||
      range.endContainer.nodeType !== Node.TEXT_NODE ||
      range.startContainer !== range.endContainer
    ) {
      console.warn('仅支持同一文本节点内的高亮');
      return;
    }
  
    // 检查是否已经被高亮
    if (
      range.startContainer.parentNode.closest('.text-highlight-selection')
    ) {
      console.warn('该文本已被高亮，跳过处理');
      return;
    }
  
    const textNode = range.startContainer;
    const fullText = textNode.textContent;
    const start = range.startOffset;
    const end = range.endOffset;
  
    if (start === end) {
      console.warn('未选中任何文本，不处理');
      return;
    }
  
    const before = fullText.slice(0, start);
    const selected = fullText.slice(start, end);
    const after = fullText.slice(end);
  
    // 创建高亮 span 元素
    const highlightEl = document.createElement('span');
    highlightEl.className = 'text-highlight-selection';
    highlightEl.textContent = selected;
  
    const parent = textNode.parentNode;
  
    // 替换原始文本节点为三个部分
    const frag = document.createDocumentFragment();
    if (before) frag.appendChild(document.createTextNode(before));
    frag.appendChild(highlightEl);
    if (after) frag.appendChild(document.createTextNode(after));
  
    parent.replaceChild(frag, textNode);
  
    // 清除原选区，防止光标跳动
    selection.removeAllRanges();
  };
  
  // 清除所有高亮
  const clearAllHighlights = () => {
    console.log('[ChatMessage] clearAllHighlights');
      // 清除所有高亮元素
      const highlights = document.querySelectorAll('.text-highlight-selection');
      highlights.forEach(el => {
        const parent = el.parentNode;
        if (parent) {
          // 将高亮元素替换为其文本内容
          const textNode = document.createTextNode(el.textContent);
          parent.replaceChild(textNode, el);
          parent.normalize(); // 合并相邻的文本节点
        }
      });
      
      // 重置选择状态
      setSelectedTexts([]);
      setSelectionRanges([]);
  };

  // 处理引用消息
  const handleQuoteMessage = () => {
    console.log('[ChatMessage] handleQuoteMessage');
    // 如果是多选模式，使用所有选择的文本
    let contentToQuote = '';
    
    if (isMultiSelectActive && selectedTexts.length > 0) {
      contentToQuote = selectedTexts.join('\n\n');
    } else {
      // 使用单个选择或消息内容
      contentToQuote = selectedTexts[0] || extractPlainTextContent(message.text);
    }
    
    // 通过自定义事件设置引用内容
    const event = new CustomEvent('chat-set-quote-content', {
      detail: {
        quoteContent: contentToQuote,
        quoteType: QUOTE_TYPES.TEXT,
        quoteId: `quote-${Date.now()}`
      }
    });
    
    document.dispatchEvent(event);
    
    // 关闭右键菜单并清除高亮
    setContextMenu(null);
    clearAllHighlights();
  };

  // 处理讨论
  const handleDiscuss = () => {
    console.log('[ChatMessage] handleDiscuss');
    // 设置讨论内容并显示讨论对话框
    setDiscussModalVisible(true);
    
    // 关闭右键菜单
    setContextMenu(null);
    
    // 讨论后关闭连续选择模式和临时多选模式
    setIsMultiSelectActive(false);
    setIsMultiSelectTempMode(false);
    // 在这里我们不清除高亮，因为用户可能还需要看到讨论内容
  };

  // 处理右键菜单项点击
  const handleContextMenuAction = (action) => {
    console.log('[ChatMessage] handleContextMenuAction', action);
    switch (action) {
      case 'discuss':
        handleDiscuss();
        break;
      case 'annotate':
        handleAddAnnotation();
        break;
      case 'select':
        // 切换连续选择模式
        setIsMultiSelectActive(!isMultiSelectActive);
        
        // 关闭右键菜单
        setContextMenu(null);
        
        // 只有在关闭连续选择模式时才清除高亮
        if (isMultiSelectActive) {
          // 关闭连续选择模式时清除所有高亮
          clearAllHighlights();
        }
        // 如果是开启连续选择模式，且右键菜单是因为选中文本出现的，保留该文本高亮
        else if (selectedText) {
          // 当前选中文本已经加入了selectedTexts中，不需要额外操作
          // 关闭右键菜单后文本会保持高亮状态
        }
        break;
      default:
        break;
    }
  };

  // 提取纯文本内容，去除引用部分
  const extractPlainTextContent = (content) => {
    console.log('[ChatMessage] extractPlainTextContent', content);
    if (!content) return '';
    
    // 移除所有引用标记
    let plainText = content.replace(/【引用:(.*?)】(.*?)【\/引用】/gs, '');
    
    // 移除旧格式引用
    plainText = plainText.replace(/【引用】(.*?)【\/引用】\n/s, '');
    
    // 移除前导空格和换行符
    plainText = plainText.trim();
    
    return plainText;
  };

  // 处理添加观点
  const handleAddAnnotation = () => {
    console.log('[ChatMessage] handleAddAnnotation');
    // 每次打开modal前，重新计算提取纯文本内容
    let contentForModal = '';
    
    if ((isMultiSelectActive || isMultiSelectTempMode) && selectedTexts.length > 0) {
      // 使用Set对选中文本进行去重，并以换行分隔
      contentForModal = Array.from(new Set(selectedTexts)).join('\n\n');
      console.log("连续选择的文本内容:", contentForModal);
    } else {
      console.log("message.text", message.text);
      contentForModal = selectedText || selectedTexts[0] || extractPlainTextContent(message.text);
    }
    
    // 确保设置内容后再显示模态框
    setInitialContentForModal(contentForModal);
    setTimeout(() => {
    setIsAnnotationModalVisible(true);
    }, 10);
    
    // 添加观点后关闭连续选择模式和临时多选模式
    setIsMultiSelectActive(false);
    setIsMultiSelectTempMode(false);
    // 关闭右键菜单
    setContextMenu(null);
    // 不立即清除高亮，等用户完成添加观点后再清除
  };

  // 保存观点
  const handleSaveAnnotation = async (data) => {
    console.log('[ChatMessage] handleSaveAnnotation', data);
    try {
      // 使用localOptimizationStep确保使用最新的步骤值
      const stepValue = localOptimizationStep || 'result';
      // 创建新的注释对象
      const newAnnotation = {
        ...data,
        step: stepValue, // 使用当前本地步骤
        messageId: message.id,
        timestamp: new Date().toISOString()
      };
      console.log('[ChatMessage] newAnnotation', newAnnotation);
      // 先调用后端服务持久化
      const savedAnnotation = await annotationService.addAnnotation(newAnnotation);
      // 使用addComment函数添加注释，确保注释立即显示在列表中
      addComment({
        ...savedAnnotation
      });
      messageApi.success('观点已添加');
      setIsAnnotationModalVisible(false);
      // 清除高亮
      clearAllHighlights();
    } catch (error) {
      console.error('保存观点失败:', error);
      messageApi.error('添加观点失败，请重试');
    }
  };

  // 格式化消息内容，处理引用部分
  const formatMessageContent = (content) => {
    if (!content) return null;
    
    // 使用正则表达式匹配所有引用内容
    const quotes = [];
    let mainText = content;
    
    // 匹配所有引用标记
    const quoteRegex = /【引用:(.*?)】(.*?)【\/引用】/gs;
    let match;
    
    while ((match = quoteRegex.exec(content)) !== null) {
      const [fullMatch, quoteType, quoteText] = match;
      quotes.push({ type: quoteType, content: quoteText });
      mainText = mainText.replace(fullMatch, '');
    }
    
    // 如果没有匹配到新格式的引用，尝试匹配旧格式
    if (quotes.length === 0) {
      const oldQuoteMatch = content.match(/【引用】(.*?)【\/引用】\n(.*)/s);
      if (oldQuoteMatch) {
        const [_, quotedText, textContent] = oldQuoteMatch;
        quotes.push({ type: QUOTE_TYPES.TEXT, content: quotedText });
        mainText = textContent;
      }
    }
    
    // 移除前导换行符
    mainText = mainText.replace(/^\n+/, '');
    
    if (quotes.length > 0) {
      return (
        <>
          {quotes.map((quote, index) => (
            <div className="message-quote" key={`quote-${index}`}>
              <div className="message-quote-bar"></div>
              <div className="message-quote-content">
                <div className="message-quote-text">{quote.content}</div>
                <div className="message-quote-label">{getQuoteLabelText(quote.type)}</div>
              </div>
            </div>
          ))}
          <div>{mainText}</div>
        </>
      );
    }
    
    return content;
  };

  // 根据引用类型获取显示的标签文字
  const getQuoteLabelText = (type) => {
    switch(type) {
      case QUOTE_TYPES.VIEWPOINT:
        return '观点';
      case QUOTE_TYPES.TEXT:
        return '文本';
      default:
        return '引用';
    }
  }

  // 渲染Session分割线
  const renderSessionDivider = () => {
    const sessionInfo = getSessionInfo();
    if (!sessionInfo) return null;
    
    const isStart = sessionInfo.type === CUSTOM_MESSAGE_TYPE.SESSION_START;
    const isExpanded = isSessionExpanded();
    const sessionId = sessionInfo.id;
    
    // 获取当前会话的引用内容和信息
    const quoteContent = sessionInfo.quoteContent || '无引用内容';
    const sessionType = isStart ? '开始' : '结束';
    
    return (
      <div 
        className={`session-divider ${isStart ? 'session-start' : 'session-end'} ${!isExpanded ? 'session-collapsed' : ''}`} 
        data-session-id={sessionId}
        onClick={handleToggleExpand}
      >
        <div className="session-divider-line">
          <span className="divider-text">{isExpanded ? "引用会话收起" : "引用会话展开"}</span>
        </div>
      </div>
    );
  };
  
  // 判断消息是否属于指定的会话
  const belongsToSession = (sessionId) => {
    if (!message || !sessionId) return false;
    
    // 如果消息本身包含sessionId信息，直接比较
    if (message.sessionData && message.sessionData.sessionId === sessionId) {
      return true;
    }
    
    // 如果消息包含cloudCustomData，解析并检查
    if (message.cloudCustomData) {
      try {
        const cloudData = JSON.parse(message.cloudCustomData);
        if (cloudData.sessionId === sessionId) {
          return true;
        }
      } catch (e) {}
    }
    
    // 获取消息时间（优先使用time字段，其次是timestamp的解析值）
    const messageTimeMs = message.time 
      ? message.time * 1000  // 如果有time字段（秒），转换为毫秒
      : message.timestamp
        ? (typeof message.timestamp === 'string' 
            ? new Date(message.timestamp).getTime()
            : message.timestamp)
        : Date.now(); // 兜底使用当前时间
    
    // 通过时间判断消息是否属于会话
    const session = sessionHistory.find(s => s.id === sessionId);
    if (session) {
      return messageTimeMs >= session.startTime && 
             messageTimeMs <= (session.endTime || Date.now());
    }
    
    return false;
  };
  
  // 在处于会话中且消息是普通消息时，检查是否应该显示
  const shouldRenderMessage = () => {
    // 如果是Session分割线则始终显示
    if (isSessionDivider()) {
      return true;
    }
    
    // 查找当前消息所属的会话ID
    let messageSessionId = null;
    
    // 如果消息上没有明确的sessionId，检查消息在DOM中的位置来确定会话
    if (messageRef.current) {
      // 获取所有会话分割线
      const allDividers = document.querySelectorAll('.session-divider');
      if (allDividers.length < 2) {
        return true; // 如果没有找到足够的分割线，默认显示
      }
      
      // 根据DOM位置确定当前消息所处的会话
      const messageElement = messageRef.current;
      
      // 将分割线转为数组，并根据DOM位置排序
      const dividersArray = Array.from(allDividers);
      
      // 查找当前消息的位置
      const messageBoundingRect = messageElement.getBoundingClientRect();
      const messageTop = messageBoundingRect.top;
      
      // 寻找当前消息前后的分割线
      let prevStartDivider = null;
      let nextEndDivider = null;
      
      for (let i = 0; i < dividersArray.length; i++) {
        const divider = dividersArray[i];
        const dividerRect = divider.getBoundingClientRect();
        const isStartDivider = divider.classList.contains('session-start');
        const isEndDivider = divider.classList.contains('session-end');
        const sessionId = divider.getAttribute('data-session-id');
        
        // 检查分割线相对于消息的位置
        if (dividerRect.top < messageTop) {
          // 分割线在消息上方
          if (isStartDivider) {
            prevStartDivider = { divider, sessionId };
          } else if (isEndDivider && prevStartDivider && divider.getAttribute('data-session-id') === prevStartDivider.sessionId) {
            // 如果找到对应会话的结束分割线，说明消息不在该会话内
            prevStartDivider = null;
          }
        } else if (dividerRect.top > messageTop && isEndDivider) {
          // 分割线在消息下方且是结束分割线
          if (prevStartDivider && divider.getAttribute('data-session-id') === prevStartDivider.sessionId) {
            // 找到了对应的结束分割线，说明消息在该会话内
            nextEndDivider = { divider, sessionId };
            break;
          }
        }
      }
      
      // 如果找到了开始分割线和结束分割线，消息在这个会话中
      if (prevStartDivider && nextEndDivider && prevStartDivider.sessionId === nextEndDivider.sessionId) {
        messageSessionId = prevStartDivider.sessionId;
      } else if (prevStartDivider) {
        // 即使没找到结束分割线，也可能在会话中
        // 这种情况在跨段历史记录中可能出现，即开始分割线在当前段，结束分割线在另一段
        messageSessionId = prevStartDivider.sessionId;
      } else {
        // console.log('消息不在任何会话内，或会话状态不完整(缺少开始/结束分割线)');
      }
    }
    
    // 如果找到了消息所属的会话ID，检查该会话是否应该显示
    if (messageSessionId) {
      const shouldShow = expandedSessions[messageSessionId] !== false; // 默认展开
      
      // 为支持跨段历史记录，添加额外的会话判断逻辑
      // 如果在sessionHistory中也找不到这个会话，可能是需要从服务端获取的跨段会话
      if (!shouldShow && !sessionHistory.some(s => s.id === messageSessionId)) {
        // 对于未知会话，默认显示消息，但打印警告
        console.warn(`未在会话历史中找到会话${messageSessionId}，可能是跨段会话，默认显示消息`);
        return true;
      }
      
      return shouldShow;
    }
    
    // 如果无法确定会话，默认显示消息
    return true;
  };
  

  // 检查消息是否在会话中
  const isInActiveSession = () => {
    // 根据消息ID检查是否属于当前会话
    if (currentSession && message.sessionId === currentSession.id) {
      return true;
    }
    
    // 检查消息是否在任何会话中
    const sessionId = message.sessionId || 
                     (message.sessionData && message.sessionData.sessionId) || 
                     (message.cloudCustomData && JSON.parse(message.cloudCustomData)?.sessionId);
    
    return !!sessionId;
  };

  // 鼠标松开时添加高亮
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    const anchorNode = selection.anchorNode;
    if (!anchorNode || anchorNode.nodeType !== Node.TEXT_NODE) return;
    const start = selection.anchorOffset;
    const end = selection.focusOffset;
    if (start === end) return;
    const s = Math.min(start, end);
    const e = Math.max(start, end);
    const msgHighlights = highlightMap[message.id] || [];
    if (msgHighlights.some(hl => s >= hl.start && e <= hl.end)) return;
    addHighlight(message.id, s, e);
    selection.removeAllRanges();
  };

  // 如果是分割线消息，渲染分割线
  if (isSessionDivider()) {
    return renderSessionDivider();
  }
  
  // 如果消息应该被折叠，则不渲染
  if (!shouldRenderMessage()) {
    return null;
  }

  return (
    <div className={`message-container ${isUser ? "message-right" : "message-left"} ${isMultiSelectActive ? 'multi-select-mode' : ''} ${isInActiveSession() ? 'in-session' : ''}`} ref={messageRef}>
      {/* 不再在这里渲染会话引用栏，改为在ChatArea中渲染 */}
      
      <div 
        className={`message-bubble ${isUser ? "message-user" : "message-other"} ${message.pending ? 'pending' : ''} ${message.error ? 'error' : ''} ${message.type === 'custom' ? 'custom-message' : ''}`} 
        style={{ position: 'relative' }}
        onContextMenu={handleContextMenu}
      >
        {/* 仅在优化模式下且消息不是用户发送的时候显示操作按钮 */}
        {!isUser && (isOptimizationMode || localOptimizationMode) && (
          <div className="message-controls">
            <span className="message-control-btn" onClick={() => console.log('返回')}>
              <ArrowLeftOutlined />
            </span>
            <span className="message-control-btn" onClick={() => console.log('前进')}>
              <ArrowRightOutlined />
            </span>
            <span className="message-control-btn" onClick={handleQuoteMessage} title="引用">
              <MessageOutlined />
            </span>
            <span 
              className={`message-control-btn ${isMultiSelectActive ? 'active' : ''}`} 
              onClick={() => {
                setIsMultiSelectActive(!isMultiSelectActive);
                // 关闭连续选择模式时清除高亮
                if (isMultiSelectActive) {
                  clearAllHighlights();
                }
              }} 
              title={isMultiSelectActive ? "关闭连续选择" : "连续选择"}
            >
              <UnorderedListOutlined />
            </span>
            <span className="message-control-btn primary" onClick={handleAddAnnotation} title="添加观点">
              <PlusOutlined />
            </span>
          </div>
        )}
        <div
          ref={textRef}
          onMouseUp={handleMouseUp}
          style={{ userSelect: 'text', cursor: 'text', fontSize: 16 }}
        >
          {renderHighlightedText(message.text, highlightMap[message.id] || [])}
        </div>
        {message.pending && <span className="message-status">发送中...</span>}
        {message.error && (
          <span className="message-status error" title={message.errorMessage || "发送失败"}>
            发送失败 {message.errorMessage ? `(${message.errorMessage.substring(0, 20)}${message.errorMessage.length > 20 ? '...' : ''})` : ''}
          </span>
        )}
      </div>
      
      {/* 右键菜单 */}
      {contextMenu && (
        <TextContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onAction={handleContextMenuAction}
          onClose={() => setContextMenu(null)}
          isMultiSelectActive={isMultiSelectActive}
        />
      )}
      
      <div className="message-time">{message.timestamp}</div>

      {/* 添加观点模态框 */}
      <AnnotationModal
        visible={isAnnotationModalVisible}
        onClose={() => {
          setIsAnnotationModalVisible(false);
          clearAllHighlights();
        }}
        onSave={handleSaveAnnotation}
        selectedText={initialContentForModal}
        initialContent={initialContentForModal}
        step={localOptimizationStep || 'result'}
      />
      
      {/* 讨论模态框 */}
      {discussModalVisible && (
        <div className="discuss-modal">
          <div className="discuss-modal-header">
            <h3>讨论</h3>
            <button onClick={() => {
              setDiscussModalVisible(false);
              clearAllHighlights();
            }}>关闭</button>
          </div>
          <div className="discuss-modal-content">
            <p>{isMultiSelectActive || isMultiSelectTempMode ? 
                Array.from(new Set(selectedTexts)).join('\n\n') : 
                (selectedText || extractPlainTextContent(message.text))}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
