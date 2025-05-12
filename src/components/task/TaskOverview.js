import React, { useState } from 'react';
import { Avatar, Tag, Table, CaretDownOutlined, CaretRightOutlined } from 'antd';
import useStyles from '../../styles/components/task/TaskOverview';

const TaskOverview = ({ task, annotationData }) => {
  const { styles } = useStyles();
  const [isScoreExpanded, setIsScoreExpanded] = useState(false);
  const [isAnnotationExpanded, setIsAnnotationExpanded] = useState(true);

  // 注释表格列定义
  const annotationColumns = [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no',
      width: 50,
      render: (text) => (
        <div className={styles.avatarContainer}>
          <Avatar size={24} className={styles.avatarNumber}>{text}</Avatar>
        </div>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 100,
      ellipsis: true,
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: 200,
      ellipsis: true,
      render: (text) => (
        <div title={text}>
          <a href="#" className={styles.attachmentLink}>{text}</a>
        </div>
      ),
    },
    {
      title: '附件',
      dataIndex: 'attachments',
      key: 'attachments',
      width: 140,
      ellipsis: true,
      render: (attachments) => (
        <div className={styles.attachmentContainer}>
          {attachments.map((file, index) => (
            <Tag key={index} className={styles.attachmentTag}>
              <a href={file.url} className={styles.attachmentLink}>{file.name}</a>
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: '最近修改',
      dataIndex: 'lastModifiedBy',
      key: 'lastModifiedBy',
      width: 100,
      render: (modifier) => (
        <div className={styles.modifierInfo}>
          <Avatar size={24}>{modifier.avatar}</Avatar>
          <span>{modifier.name}</span>
        </div>
      ),
    },
    {
      title: '修改时间',
      dataIndex: 'modifiedTime',
      key: 'modifiedTime',
      width: 86,
      align: 'right',
      render: (time) => (
        <div className={styles.modifierTime}>
          <div>{time.hour}</div>
          <div>{time.date}</div>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* 积分说明区域 */}
      <div className={styles.scoreSection}>
        <div 
          className={styles.scoreHeader}
          onClick={() => setIsScoreExpanded(!isScoreExpanded)}
        >
          <span className={styles.scoreTitle}>积分消耗说明</span>
          {isScoreExpanded ? 
            <CaretDownOutlined className={styles.scoreIcon} /> :
            <CaretRightOutlined className={styles.scoreIcon} />
          }
        </div>
        {isScoreExpanded && (
          <div className={styles.scoreContent}>
            <div>根据此任务的配置，预计每次测试消耗XXX积分*。</div>
            <div className={styles.scoreContentRow}>
              <span>*根据配置参数动态计算，</span>
              <a href="#" className={styles.scoreLink}>了解计算规则&gt;&gt;</a>
            </div>
          </div>
        )}
      </div>

      {/* 任务信息区域 */}
      <div className={styles.taskInfoSection}>
        <div className={styles.infoRow}>
          <div className={styles.infoLabel}>任务名称</div>
          <div className={styles.infoContent}>{task.title}</div>
        </div>
        <div className={styles.infoRow}>
          <div className={styles.infoLabel}>创建人</div>
          <div className={styles.authorInfo}>
            <Avatar size={24}>{task.author?.name?.charAt(0)}</Avatar>
            <span>{task.author?.name}</span>
          </div>
        </div>
        <div className={styles.infoRow}>
          <div className={styles.infoLabel}>描述</div>
          <div className={styles.infoContent}>{task.description}</div>
        </div>
        <div className={styles.infoRow}>
          <div className={styles.infoLabel}>关键词</div>
          <div className={styles.tagContainer}>
            {task.tags.map((tag, index) => (
              <Tag key={index} className={styles.tag}>{tag}</Tag>
            ))}
          </div>
        </div>
      </div>

      {/* 注释表格区域 */}
      <div className={styles.annotationSection}>
        <div 
          className={styles.annotationHeader}
          onClick={() => setIsAnnotationExpanded(!isAnnotationExpanded)}
        >
          <span className={styles.annotationTitle}>注释</span>
          {isAnnotationExpanded ? 
            <CaretDownOutlined className={styles.annotationIcon} /> :
            <CaretRightOutlined className={styles.annotationIcon} />
          }
        </div>
        
        {isAnnotationExpanded && (
          <Table
            columns={annotationColumns}
            dataSource={annotationData}
            pagination={false}
            size="small"
            className={styles.annotationTable}
            scroll={{ x: 676 }}
          />
        )}
      </div>
    </>
  );
};

export default TaskOverview; 