import React, { useState, useContext, useRef, useEffect } from 'react';
import { ArrowLeftOutlined, ArrowRightOutlined, PlusOutlined, MessageOutlined, UnorderedListOutlined } from '@ant-design/icons';
import AnnotationModal from '../annotations/AnnotationModal';
import annotationService from '../../services/annotationService';
import { message as messageApi } from 'antd';
import { OptimizationContext } from '../../contexts/OptimizationContext';
import TextContextMenu from '../context/TextContextMenu';

// 引用类型定义
const QUOTE_TYPES = {
  TEXT: 'text',
  VIEWPOINT: 'viewpoint',
};

const ChatMessage = ({ message }) => {
  const isUser = message.sender === "user";
  const [isAnnotationModalVisible, setIsAnnotationModalVisible] = useState(false);
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

  // 处理右键菜单
  const handleContextMenu = (e) => {
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
  const applyHighlightToSelection = (range, text) => {
    if (!range) return;
    
    // 创建高亮元素
    const highlightEl = document.createElement('span');
    highlightEl.className = 'text-highlight-selection';
    highlightEl.textContent = text;
    
    // 清除原有内容，插入高亮元素
    range.deleteContents();
    range.insertNode(highlightEl);
  };
  
  // 清除所有高亮
  const clearAllHighlights = () => {
    // 清除消息内的所有高亮元素
    const highlights = messageRef.current?.querySelectorAll('.text-highlight-selection') || [];
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

  // 处理点击事件关闭右键菜单
  useEffect(() => {
    const handleClickOutside = (e) => {
      // 点击其他区域关闭右键菜单
      if (contextMenu && !e.target.closest('.message-context-menu')) {
        setContextMenu(null);
      }
      
      // 检查是否点击了高亮元素
      const isClickOnHighlight = e.target.closest('.text-highlight-selection');
      if (isClickOnHighlight) {
        return; // 点击高亮文本时不清除高亮
      }
      
      // 如果不是连续选择模式，且不是临时多选模式，且不是按着Ctrl/Command，点击其他区域时清除高亮
      if (!isMultiSelectActive && !isMultiSelectTempMode && !(e.ctrlKey || e.metaKey)) {
        clearAllHighlights();
      }
    };
    
    // 监听键盘事件，处理Ctrl/Command键
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && !isMultiSelectActive) {
        // Ctrl/Command键按下，临时进入多选模式
        document.body.classList.add('multi-select-temp');
        setIsMultiSelectTempMode(true);
      }
    };
    
    const handleKeyUp = (e) => {
      if (!e.ctrlKey && !e.metaKey) {
        // Ctrl/Command键释放，如果不是永久多选模式，清除临时标记
        if (!isMultiSelectActive) {
          document.body.classList.remove('multi-select-temp');
          setIsMultiSelectTempMode(false);
        }
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [contextMenu, isMultiSelectActive, isMultiSelectTempMode]);

  // 添加自动高亮处理函数
  useEffect(() => {
    const handleAutoSelection = (event) => {
      // 只在连续选择模式下启用自动选择高亮
      if (!isMultiSelectActive && !isMultiSelectTempMode) return;
      
      // 检查事件是否发生在消息容器内
      if (!messageRef.current?.contains(event.target)) return;
      
      // 从window获取当前选区
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      
      // 如果有选中文本
      if (selectedText) {
        // 创建选择的范围信息
        const range = selection.getRangeAt(0);
        
        // 检查此文本是否已被高亮，避免重复选择
        const hasHighlight = range.commonAncestorContainer.closest?.('.text-highlight-selection');
        if (hasHighlight) return; // 如果已经是高亮元素，不再处理
        
        // 检查该文本是否已经在选中列表中，避免重复添加
        if (selectedTexts.includes(selectedText)) return;
        
        // 添加到已选择的文本列表
        setSelectedTexts(prev => [...new Set([...prev, selectedText])]);
        
        // 保存当前选中的文本
        setSelectedText(selectedText);
        
        // 应用高亮样式，保持选中状态
        applyHighlightToSelection(range, selectedText);
      }
    };
    
    // 在连续选择模式或临时多选模式下添加监听
    if (isMultiSelectActive || isMultiSelectTempMode) {
      document.addEventListener('mouseup', handleAutoSelection);
    }
    
    return () => {
      document.removeEventListener('mouseup', handleAutoSelection);
    };
  }, [isMultiSelectActive, isMultiSelectTempMode, selectedTexts]);

  // 提取纯文本内容，去除引用部分
  const extractPlainTextContent = (content) => {
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
    try {
      // 创建新的注释对象
      const newAnnotation = {
        ...data,
        step: currentOptimizationStep,
        messageId: message.id,
        timestamp: new Date().toISOString()
      };
      
      // 调用添加注释服务
      const savedAnnotation = await annotationService.addAnnotation(newAnnotation);
      
      // 使用addComment函数添加注释，确保注释立即显示在列表中
      addComment({
        id: savedAnnotation.id,
        author: savedAnnotation.author.name,
        time: savedAnnotation.time,
        text: savedAnnotation.content,
        summary: savedAnnotation.summary
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

  return (
    <div className={`message-container ${isUser ? "message-right" : "message-left"} ${isMultiSelectActive ? 'multi-select-mode' : ''}`} ref={messageRef}>
      <div 
        className={`message-bubble ${isUser ? "message-user" : "message-other"} ${message.pending ? 'pending' : ''} ${message.error ? 'error' : ''}`} 
        style={{ position: 'relative' }}
        onContextMenu={handleContextMenu}
      >
        {/* 仅在优化模式下且消息不是用户发送的时候显示操作按钮 */}
        {!isUser && isOptimizationMode && (
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
        {formatMessageContent(message.text)}
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
