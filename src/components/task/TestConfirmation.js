import React, { useState, useEffect } from 'react';
import { Progress, Card, List, Typography, Space, Alert, Button, Timeline, Tag, Avatar, Table } from 'antd';
import { CheckCircleOutlined, InfoCircleOutlined, ArrowLeftOutlined, CaretDownOutlined, CaretRightOutlined, SyncOutlined } from '@ant-design/icons';
import MainContentLayout from '../layout/MainContentLayout';
import * as qaService from '../../services/qaService';
import * as sceneService from '../../services/sceneService';
import * as templateService from '../../services/templateService';
import useStyles from '../../styles/components/task/TestConfirmation';
import TaskOverview from './TaskOverview';

const { Title, Text } = Typography;

const TestConfirmation = ({ 
  isTesting, 
  testProgress, 
  task, 
  isTaskStarted,
  TimelineIcon,
  onPrevious,
  onStartTest,
  currentStep = 4,
  QASection,
  SceneSection,
  TemplateSection,
  annotationColumns,
  annotationData
}) => {
  const { styles } = useStyles();
  
  // 左侧Timeline使用的状态，与步骤导航不同
  const [activeSection, setActiveSection] = useState('overview');
  const [isScoreExpanded, setIsScoreExpanded] = useState(false);
  const [isAnnotationExpanded, setIsAnnotationExpanded] = useState(true);
  
  // 从各服务中获取的数据
  const [qaContent, setQAContent] = useState([]);
  const [sceneContent, setSceneContent] = useState([]);
  const [templateContent, setTemplateContent] = useState([]);
  const [loading, setLoading] = useState(true);

  // 从各服务中获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 获取QA数据
        const qaData = await qaService.getQAContent();
        setQAContent(qaData.confirmationItems || [
          "已配置问题数量：5个",
          "已添加注释数量：3个",
          "答案类型：文本"
        ]);

        // 获取场景数据
        const sceneData = await sceneService.getSceneContent();
        setSceneContent(sceneData.confirmationItems || [
          "已配置节点数量：8个",
          "连接数量：10个",
          "场景类型：对话流程图"
        ]);

        // 获取模板数据
        const templateData = await templateService.getTemplateContent();
        setTemplateContent(templateData.confirmationItems || [
          "模板类型：标准输出",
          "已定义的变量：5个",
          "已配置的条件：3个"
        ]);
      } catch (error) {
        console.error('获取数据失败:', error);
        
        // 如果API调用失败，从组件Props中提取信息
        extractInfoFromComponents();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // 从传入的组件中提取测试所需信息
  const extractInfoFromComponents = () => {
    // 提取QA信息
    if (QASection) {
      const qaItems = [
        "使用已保存的QA配置内容",
        "所有必填字段已完成",
        "所有注释已添加"
      ];
      setQAContent(qaItems);
    }
    
    // 提取场景信息
    if (SceneSection) {
      const sceneItems = [
        "使用已保存的场景配置内容",
        "所有节点已正确连接",
        "流程已完整定义"
      ];
      setSceneContent(sceneItems);
    }
    
    // 提取模板信息
    if (TemplateSection) {
      const templateItems = [
        "使用已保存的模板配置内容",
        "所有变量已定义",
        "输出格式已确认"
      ];
      setTemplateContent(templateItems);
    }
  };

  // 渲染测试进行中的UI
  const renderTestingContent = () => {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 200px)',
        width: '100%',
        background: '#f5f5f5',
        padding: 0,
        margin: 0
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Progress 
            type="circle" 
            percent={testProgress}
            strokeColor="var(--color-primary)"
            trailColor="#f3f3f3"
            width={120}
            format={percent => (
              <span style={{ fontSize: '20px', fontWeight: 'normal', color: '#000' }}>
                {percent}%
              </span>
            )}
            strokeWidth={6}
          />
          <div style={{ 
            marginTop: '20px', 
            fontSize: '14px', 
      
          }}>
            测试进行中，请稍候...
          </div>
        </div>
      </div>
    );
  };

  // 渲染确认内容
  const renderConfirmContent = () => {
    if (loading) {
      return (
        <div className={styles.loadingContainer}>
          <Progress type="circle" status="active" />
          <div className={styles.loadingText}>加载数据中...</div>
        </div>
      );
    }
    
    return (
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        <Alert
          message="开始测试前请确认以下内容"
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
        />
        
        <Card title="QA 配置确认" size="small" className={styles.section}>
          <List
            size="small"
            dataSource={qaContent}
            renderItem={item => (
              <List.Item className={styles.listItem}>
                <Space>
                  <CheckCircleOutlined className={styles.summaryIcon} />
                  <Text className={styles.summaryText}>{item}</Text>
                </Space>
              </List.Item>
            )}
          />
        </Card>

        <Card title="场景配置确认" size="small" className={styles.section}>
          <List
            size="small"
            dataSource={sceneContent}
            renderItem={item => (
              <List.Item className={styles.listItem}>
                <Space>
                  <CheckCircleOutlined className={styles.summaryIcon} />
                  <Text className={styles.summaryText}>{item}</Text>
                </Space>
              </List.Item>
            )}
          />
        </Card>

        <Card title="模板配置确认" size="small" className={styles.section}>
          <List
            size="small"
            dataSource={templateContent}
            renderItem={item => (
              <List.Item className={styles.listItem}>
                <Space>
                  <CheckCircleOutlined className={styles.summaryIcon} />
                  <Text className={styles.summaryText}>{item}</Text>
                </Space>
              </List.Item>
            )}
          />
        </Card>

        <div className={styles.testSummary}>
          <Title level={5}>测试预估</Title>
          <div className={styles.parametersGrid}>
            <div className={styles.parameterCard}>
              <div className={styles.parameterName}>预计耗时</div>
              <div className={styles.parameterValue}>约10分钟</div>
            </div>
            <div className={styles.parameterCard}>
              <div className={styles.parameterName}>预计积分消耗</div>
              <div className={styles.parameterValue}>200积分</div>
            </div>
            <div className={styles.parameterCard}>
              <div className={styles.parameterName}>测试涵盖项</div>
              <div className={styles.parameterValue}>3个维度</div>
            </div>
            <div className={styles.parameterCard}>
              <div className={styles.parameterName}>报告生成</div>
              <div className={styles.parameterValue}>测试后立即</div>
            </div>
          </div>
        </div>

        <div className={styles.testWarning}>
          <Space align="start">
            <InfoCircleOutlined style={{ color: 'var(--color-assist-1)' }} />
            <div>
              <Text strong>注意：</Text>
              <Text>开始测试后将会按照配置的参数进行评估，过程中无法暂停。请确保已正确配置所有参数。</Text>
            </div>
          </Space>
        </div>

        <div className={styles.testButton}>
          <Button 
            type="primary" 
            size="large" 
            onClick={onStartTest}
            className={styles.buttonLarge}
            style={{
              height: '48px',
              fontSize: '16px',
              fontWeight: '500',
              borderRadius: '24px',
              width: '280px',
              boxShadow: '0 2px 10px rgba(var(--color-primary-rgb), 0.2)'
            }}
            icon={<CheckCircleOutlined />}
          >
            确认无误，开始测试
          </Button>
        </div>
      </Space>
    );
  };

  // 根据activeSection渲染不同的内容
  const renderSectionContent = () => {
    // 从task中获取注释数据
    const getCommentsFromTask = (section) => {
      if (!task || !task.annotations) return [];
      // 根据不同的区域返回对应的注释
      switch(section) {
        case 'qa':
          return task.annotations.qa || [];
        case 'scene':
          return task.annotations.scenario || [];
        case 'template':
          return task.annotations.flow || [];
        case 'result':
          return task.annotations.result || [];
        default:
          return [];
      }
    };

    switch (activeSection) {
      case 'overview':
        return (
          <TaskOverview
            task={task}
            annotationData={annotationData}
            isOptimizationMode={false}
          />
        );
      case 'qa':
        return QASection ? (
          <div className={styles.section}>
            <QASection 
              isEditable={false} 
              taskId={task?.id}
              prompt={task?.prompt} 
              response={task?.response}
              comments={getCommentsFromTask('qa')} // 从task数据中获取QA注释
            />
          </div>
        ) : renderConfirmContent();
      case 'scene':
        return SceneSection ? (
          <div className={styles.section}>
            <SceneSection 
              isEditable={false} 
              taskId={task?.id}
              scenario={task?.scenario}
              comments={getCommentsFromTask('scenario')} // 从task数据中获取场景注释
            />
          </div>
        ) : renderConfirmContent();
      case 'template':
        return TemplateSection ? (
          <div className={styles.section}>
            <TemplateSection 
              isEditable={false} 
              taskId={task?.id}
              card={task}
              
              comments={getCommentsFromTask('flow')} // 从task数据中获取模板注释
            />
          </div>
        ) : renderConfirmContent();
      case 'confirm':
        return renderConfirmContent();
      default:
        return renderConfirmContent();
    }
  };

  return (
    <div className={styles.container} style={{ width: "100%" }}>
      {isTesting ? (
        // 测试进行中时，显示进度条占据整个页面
        renderTestingContent()
      ) : (
        // 非测试状态时，显示常规任务概览布局
        <div className={styles.mainContent} style={{ width: "100%" }}>
          {/* 左侧导航菜单 */}
          <div className={styles.leftMenu}>
            {/* 任务概览标题 */}
            <div className={styles.taskOverviewTitle}>
              任务概览
            </div>

            <Timeline>
              {[
                { key: 'overview', label: '概览' },
                { key: 'qa', label: 'QA' },
                { key: 'scene', label: '场景' },
                { key: 'template', label: '模板' }
              ].map((item) => (
                <Timeline.Item
                  key={item.key}
                  dot={
                    <div 
                      className={`${styles.timelineDot} ${activeSection === item.key ? styles.timelineDotActive : styles.timelineDotInactive}`}
                      onClick={() => setActiveSection(item.key)}
                    >
                      <TimelineIcon active={activeSection === item.key} />
                    </div>
                  }
                  className={styles.timelineItem}
                  color={activeSection === item.key ? 'var(--color-primary)' : 'var(--color-text-tertiary)'}
                  style={{ marginLeft: 0 }}
                >
                  <div
                    className={`${styles.timelineText} ${activeSection === item.key ? styles.timelineTextActive : styles.timelineTextInactive}`}
                    onClick={() => setActiveSection(item.key)}
                  >
                    {item.label}
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </div>

          {/* 右侧内容区域 */}
          <div className={styles.rightContent} style={{ width: "calc(100% - 110px)" }}>
            <div style={{ flex: 1, width: "100%" }}>
              {renderSectionContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestConfirmation; 