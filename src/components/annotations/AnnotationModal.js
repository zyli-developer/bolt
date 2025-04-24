import React, { useState } from 'react';
import { Modal, Input, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const AnnotationModal = ({ visible, onClose, onSave, selectedText }) => {
  const [content, setContent] = useState('');
  const [fileList, setFileList] = useState([]);

  const handleSave = () => {
    if (!content.trim()) {
      message.error('请输入注释内容');
      return;
    }

    onSave({
      content,
      attachments: fileList,
      selectedText
    });
    
    // 重置表单
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
        <div style={{ marginBottom: 8, color: '#666' }}>选中文本：</div>
        <div style={{ 
          padding: 8,
          background: '#f5f5f5',
          borderRadius: 4,
          fontSize: 14
        }}>{selectedText}</div>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8 }}>注释内容：</div>
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