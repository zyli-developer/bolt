import React, { useState, useContext } from 'react';
import { ArrowLeftOutlined, ArrowRightOutlined, PlusOutlined } from '@ant-design/icons';
import AnnotationModal from '../annotations/AnnotationModal';
import annotationService from '../../services/annotationService';
import { message as messageApi } from 'antd';
import { OptimizationContext } from '../../contexts/OptimizationContext';

// 引用类型定义
const QUOTE_TYPES = {
  TEXT: 'text',
  VIEWPOINT: 'viewpoint',
};

const ChatMessage = ({ message }) => {
  const isUser = message.sender === "user";
  const [isAnnotationModalVisible, setIsAnnotationModalVisible] = useState(false);
  
  // 使用全局的OptimizationContext
  const { 
    isOptimizationMode,
    currentOptimizationStep,
    addComment
  } = useContext(OptimizationContext);

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
    setIsAnnotationModalVisible(true);
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

  // 提取纯文本消息内容用于初始化注释内容
  const plainMessageContent = extractPlainTextContent(message.text);

  return (
    <div className={`message-container ${isUser ? "message-right" : "message-left"}`}>
      <div className={`message-bubble ${isUser ? "message-user" : "message-other"} ${message.pending ? 'pending' : ''} ${message.error ? 'error' : ''}`} style={{ position: 'relative' }}>
        {/* 仅在优化模式下且消息不是用户发送的时候显示操作按钮 */}
        {!isUser && isOptimizationMode && (
          <div className="message-controls">
            <span className="message-control-btn" onClick={() => console.log('返回')}>
              <ArrowLeftOutlined />
            </span>
            <span className="message-control-btn" onClick={() => console.log('前进')}>
              <ArrowRightOutlined />
            </span>
            <span className="message-control-btn primary" onClick={handleAddAnnotation}>
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
      <div className="message-time">{message.timestamp}</div>

      {/* 添加观点模态框 */}
      <AnnotationModal
        visible={isAnnotationModalVisible}
        onClose={() => setIsAnnotationModalVisible(false)}
        onSave={handleSaveAnnotation}
        selectedText={plainMessageContent} // 使用处理后的纯文本作为选中文本
        initialContent={plainMessageContent} // 将纯文本作为初始注释内容
      />
    </div>
  )
}

export default ChatMessage
