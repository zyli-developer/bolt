import React, { useState } from 'react';
import { Modal, Input, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const AnnotationModal = ({ visible, onClose, onSave, selectedText, initialContent = '' }) => {
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState(initialContent);
  const [fileList, setFileList] = useState([]);

  const handleSave = () => {
    if (!content.trim()) {
      message.error('请输入观点内容');
      return;
    }

    onSave({
      summary,
      content,
      attachments: fileList,
      selectedText
    });
    
    // 重置表单
    setSummary('');
    setContent('');
    setFileList([]);
  };

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  return (
    <Modal
      title="添加观点"
      open={visible}
      onCancel={onClose}
      onOk={handleSave}
      okText="保存"
      cancelText="取消"
      width={520}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8, color: '#666' }}>摘要：</div>
        <Input
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="请输入摘要..."
        />
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8, color: '#666' }}>选中文本：</div>
        <div style={{ 
          padding: 8,
          background: '#f5f5f5',
          borderRadius: 4,
          fontSize: 14,
          maxHeight: '3em',
          lineHeight: '1.5em',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>{selectedText}</div>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8 }}>观点内容：</div>
        <TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="请输入您的观点..."
          rows={4}
        />
      </div>

      <div>
        <div style={{ marginBottom: 8 }}>上传附件：</div>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>选择文件</Button>
        </Upload>
      </div>
    </Modal>
  );
};

export default AnnotationModal; 