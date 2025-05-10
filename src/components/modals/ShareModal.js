import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, message, Checkbox, Space, Select, Radio, Divider, Tooltip } from 'antd';
import { CopyOutlined, LinkOutlined, QuestionCircleOutlined, LockOutlined, EyeOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons';

const { Option } = Select;

// 权限等级常量
const PERMISSION_LEVELS = {
  VIEW: 'view',
  COMMENT: 'comment',
  FULL: 'full'
};

const ShareModal = ({ visible, onCancel, taskId, taskTitle, availableModels = [] }) => {
  // 默认选择前两个模型（如果有）
  const [shareScope, setShareScope] = useState([]);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  // 添加权限设置，默认为"可查看"
  const [permission, setPermission] = useState(PERMISSION_LEVELS.VIEW);
  
  // 默认模型列表（如果未提供可用模型）
  const defaultModels = [
    { label: 'Claude 3.5', value: 'claude3.5' },
    { label: 'Claude 3.6', value: 'claude3.6' },
    { label: 'Claude 3.7', value: 'claude3.7' },
    { label: 'Agent 2', value: 'agent2' },
    { label: 'DeepSeek', value: 'deepseek' },
  ];
  
  // 使用传入的可用模型或默认模型
  const scopeOptions = availableModels.length > 0 
    ? availableModels 
    : defaultModels;
  
  // 当模态框打开时，默认选择前两个模型
  useEffect(() => {
    if (visible && scopeOptions.length > 0) {
      // 默认选择前两个模型
      setShareScope(scopeOptions.slice(0, 2).map(option => option.value));
      setCopied(false);
    }
  }, [visible, scopeOptions]);
  
  // 全选功能
  const handleSelectAll = (checked) => {
    if (checked) {
      setShareScope(scopeOptions.map(option => option.value));
    } else {
      setShareScope([]);
    }
  };
  
  // 生成分享链接
  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    const sharePath = `/tasks/${taskId}`;
    // 增加权限参数
    const shareParams = [];
    
    if (shareScope.length > 0) {
      shareParams.push(`models=${shareScope.join(',')}`);
    }
    
    if (permission) {
      shareParams.push(`perm=${permission}`);
    }
    
    const queryString = shareParams.length > 0 ? `?${shareParams.join('&')}` : '';
    const url = `${baseUrl}${sharePath}${queryString}`;
    setShareUrl(url);
    return url;
  };
  
  // 复制链接到剪贴板
  const copyShareLink = () => {
    // 生成分享链接，包含所选模型范围
    const url = generateShareLink();
    
    // 复制到剪贴板
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true);
        message.success({
          content: '分享链接已复制到剪贴板',
          icon: <CopyOutlined style={{ color: '#52c41a' }} />,
          duration: 3
        });
      })
      .catch(() => {
        message.error('复制失败，请手动复制链接');
      });
  };

  // 权限等级描述
  const permissionDescriptions = {
    [PERMISSION_LEVELS.VIEW]: '接收者只能查看任务详情，不能添加观点或修改任何内容',
    [PERMISSION_LEVELS.COMMENT]: '接收者可以查看任务详情和添加观点，但不能修改或删除其他观点',
    [PERMISSION_LEVELS.FULL]: '接收者拥有与你相同的权限，可以完全编辑任务内容和观点'
  };

  // 权限等级图标
  const permissionIcons = {
    [PERMISSION_LEVELS.VIEW]: <EyeOutlined />,
    [PERMISSION_LEVELS.COMMENT]: <EditOutlined />,
    [PERMISSION_LEVELS.FULL]: <SettingOutlined />
  };

  return (
    <Modal
      title="分享任务"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={copyShareLink}
          disabled={shareScope.length === 0}
        >
          {copied ? '已复制' : '生成并复制链接'}
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ margin: '0 0 8px 0' }}>{taskTitle || '当前任务'}</h3>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 500, marginBottom: 8, display: 'flex', alignItems: 'center' }}>
          <LockOutlined style={{ marginRight: 8 }} />
          权限设置
        </div>
        <Radio.Group 
          value={permission} 
          onChange={(e) => setPermission(e.target.value)}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Radio value={PERMISSION_LEVELS.VIEW}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 500 }}>{permissionIcons[PERMISSION_LEVELS.VIEW]} 可查看</span>
                <Tooltip title={permissionDescriptions[PERMISSION_LEVELS.VIEW]}>
                  <QuestionCircleOutlined style={{ marginLeft: 8, color: '#999' }} />
                </Tooltip>
              </div>
            </Radio>
            <Radio value={PERMISSION_LEVELS.COMMENT}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 500 }}>{permissionIcons[PERMISSION_LEVELS.COMMENT]} 可添加观点</span>
                <Tooltip title={permissionDescriptions[PERMISSION_LEVELS.COMMENT]}>
                  <QuestionCircleOutlined style={{ marginLeft: 8, color: '#999' }} />
                </Tooltip>
              </div>
            </Radio>
            <Radio value={PERMISSION_LEVELS.FULL}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 500 }}>{permissionIcons[PERMISSION_LEVELS.FULL]} 所有权限</span>
                <Tooltip title={permissionDescriptions[PERMISSION_LEVELS.FULL]}>
                  <QuestionCircleOutlined style={{ marginLeft: 8, color: '#999' }} />
                </Tooltip>
              </div>
            </Radio>
          </Space>
        </Radio.Group>
      </div>

      <Divider style={{ margin: '16px 0' }} />
      
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 500, marginBottom: 8 }}>选择要分享的模型评估结果：</div>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Checkbox 
            onChange={(e) => handleSelectAll(e.target.checked)}
            checked={shareScope.length === scopeOptions.length && scopeOptions.length > 0}
            disabled={scopeOptions.length === 0}
          >
            全选
          </Checkbox>
          
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder={scopeOptions.length > 0 ? "请选择要分享的模型" : "暂无可分享的模型"}
            value={shareScope}
            onChange={setShareScope}
            optionLabelProp="label"
            disabled={scopeOptions.length === 0}
          >
            {scopeOptions.map(option => (
              <Option key={option.value} value={option.value} label={option.label}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Space>
      </div>
      
      <div style={{ marginTop: 24 }}>
        <Input
          prefix={<LinkOutlined style={{ color: '#bfbfbf' }} />}
          addonAfter={
            <CopyOutlined 
              onClick={shareScope.length > 0 ? copyShareLink : undefined} 
              style={{ 
                cursor: shareScope.length > 0 ? 'pointer' : 'not-allowed',
                color: shareScope.length > 0 ? '#1890ff' : '#bfbfbf'
              }} 
            />
          }
          value={shareScope.length > 0 ? (shareUrl || "链接将在确认后生成并复制") : "请先选择要分享的模型"}
          readOnly
        />
        <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
          链接有效期为7天，或访问次数超过100次后将失效。接收者需要有网络账号才能查看。
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal; 