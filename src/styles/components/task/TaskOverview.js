import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css }) => {
  return {
    scoreSection: css`
      background: #EAF2FF;
      padding: 16px;
      border-radius: 12px;
      margin-bottom: 24px;
    `,
    scoreHeader: css`
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      cursor: pointer;
    `,
    scoreTitle: css`
      font-size: 14px;
      font-weight: 500;
    `,
    scoreIcon: css`
      margin-left: 4px;
      color: #8f9098;
    `,
    scoreContent: css`
      font-size: 14px;
      color: #8f9098;
    `,
    scoreContentRow: css`
      margin-top: 4px;
    `,
    scoreLink: css`
      color: #006FFD;
    `,
    taskInfoSection: css`
      margin-bottom: 24px;
    `,
    infoRow: css`
      display: flex;
      margin-bottom: 16px;
    `,
    infoLabel: css`
      width: 80px;
      color: #8f9098;
    `,
    infoContent: css`
      flex: 1;
    `,
    authorInfo: css`
      display: flex;
      align-items: center;
      gap: 8px;
    `,
    tagContainer: css`
      display: flex;
      flex-wrap: wrap;
    `,
    tag: css`
      border-radius: 12px;
      margin-right: 8px;
    `,
    annotationSection: css`
      margin-bottom: 24px;
    `,
    annotationHeader: css`
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      cursor: pointer;
    `,
    annotationTitle: css`
      font-size: 14px;
      font-weight: 500;
    `,
    annotationIcon: css`
      margin-left: 4px;
      color: #8f9098;
    `,
    annotationTable: css`
      margin-top: 8px;
      width: 676px;
    `,
    avatarContainer: css`
      display: flex;
      justify-content: center;
    `,
    avatarNumber: css`
      background: #006ffd;
      font-size: 12px;
    `,
    attachmentContainer: css`
      display: flex;
      gap: 8px;
      overflow: hidden;
    `,
    attachmentTag: css`
      cursor: pointer;
      white-space: nowrap;
    `,
    attachmentLink: css`
      color: #006ffd;
    `,
    modifierInfo: css`
      display: flex;
      align-items: center;
      gap: 8px;
    `,
    modifierTime: css`
      color: #8f9098;
      font-size: 12px;
    `,
    warningIcon: css`
      color: #faad14;
    `,
  };
});

export default useStyles; 