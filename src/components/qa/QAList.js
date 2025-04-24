import React from 'react';
import { List, Avatar, Tag, Typography, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';

const { Title } = Typography;

const QAList = ({ data = [] }) => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={4} style={{ marginBottom: '24px' }}>问答列表</Title>
      <List
        itemLayout="vertical"
        dataSource={data}
        renderItem={item => (
          <List.Item
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              marginBottom: '16px',
              padding: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            actions={[
              <Button type="link" icon={<RightOutlined />}>查看详情</Button>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.author.avatar}>{item.author.name[0]}</Avatar>}
              title={
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '16px', fontWeight: 500 }}>{item.title}</span>
                  <Tag color={item.status === 'resolved' ? 'success' : 'processing'}>
                    {item.status === 'resolved' ? '已解决' : '进行中'}
                  </Tag>
                </div>
              }
              description={
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#666',
                  marginTop: '8px'
                }}>
                  <span>{item.author.name} · {item.author.department}</span>
                  <span>{item.createTime}</span>
                </div>
              }
            />
            <div style={{ 
              fontSize: '14px',
              color: '#333',
              marginTop: '12px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {item.content}
            </div>
            <div style={{ 
              marginTop: '12px',
              display: 'flex',
              gap: '8px'
            }}>
              {item.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default QAList; 