import React from 'react';
import { Avatar } from 'antd';
import { createStyles } from 'antd-style';

/**
 * 评论列表样式
 */
const useStyles = createStyles(({ css, token }) => {
  return {
    commentsList: css`
      padding: 8px;
      background: ${token.colorBgContainer};
      border-radius: ${token.borderRadiusSM}px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    `,
    commentsHeader: css`
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
      color: ${token.colorText};
    `,
    commentsContent: css`
      max-height: 500px;
      overflow-y: auto;
    `,
    commentItem: css`
      margin-bottom: 8px;
      padding: 8px;
      background: ${token.colorBgElevated};
      border-radius: 4px;
    `,
    commentHeader: css`
      display: flex;
      align-items: center;
      margin-bottom: 4px;
    `,
    commenterAvatar: css`
      background-color: ${token.colorPrimary};
    `,
    commenterName: css`
      margin-left: 4px;
      font-size: 12px;
      font-weight: bold;
    `,
    commentTime: css`
      margin-left: 8px;
      font-size: 11px;
      color: ${token.colorTextSecondary};
    `,
    commentText: css`
      font-size: 12px;
      margin: 0;
      line-height: 1.4;
      color: ${token.colorText};
    `,
  };
});

/**
 * 注释列表组件
 * @param {Object} props - 组件属性
 * @param {Array} props.comments - 评论数据
 * @returns {ReactElement|null} 注释列表组件或null
 */
const CommentsList = ({ comments = [] }) => {
  const styles = useStyles();
  
  if (!comments || comments.length === 0) return null;
  
  return (
    <div className={styles.commentsList}>
      <div className={styles.commentsHeader}>
        注释列表
      </div>
      <div className={styles.commentsContent}>
        {comments.map((comment, index) => (
          <div key={index} className={styles.commentItem}>
            <div className={styles.commentHeader}>
              <Avatar size={20} className={styles.commenterAvatar}>
                {comment.author?.charAt(0)}
              </Avatar>
              <span className={styles.commenterName}>
                {comment.author}
              </span>
              <span className={styles.commentTime}>
                {comment.time}
              </span>
            </div>
            <p className={styles.commentText}>
              {comment.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsList; 