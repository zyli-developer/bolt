import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      display: flex;
      gap: 24px;
 
      height: calc(100vh - 300px);
      overflow: hidden;
    `,
    loadingContainer: css`
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    `,
    leftSection: css`
      flex: 1;
      background-color: #fff;
      border-radius: 8px;
      padding: 24px;
      overflow: auto;
    `,
    headerSection: css`
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `,
    headerTitle: css`
      margin: 0;
    `,
    contentText: css`
      font-size: 14px;
      line-height: 1.8;
      color: #333;
      position: relative;
      white-space: pre-wrap;
    `,
    annotatedText: css`
      background-color: #E6F7FF;
      position: relative;
    `,
    annotationMarker: css`
      position: absolute;
      top: -12px;
      right: -12px;
      background: #1890ff;
      color: #fff;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    `,
    rightSection: css`
      width: 320px;
      background-color: #fff;
      border-radius: 8px;
      overflow: auto;
    `,
    annotationTitle: css`
      margin-bottom: 16px;
    `,
    annotationList: css`
      gap: 4px;
    `,
    annotationPanel: css`
      margin-bottom: 4px;
    `,
    annotationPanelHeader: css`
      padding: 8px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `,
    annotationPanelExpanded: css`
      background-color: #E6F7FF;
    `,
    annotationPanelCollapsed: css`
      background-color: #f8f9fa;
    `,
    annotationPanelLeft: css`
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
    `,
    annotationInfo: css`
      flex: 1;
    `,
    annotationText: css`
      font-size: 14px;
      color: #333;
      word-break: break-all;
    `,
    annotationMeta: css`
      font-size: 12px;
      color: #8f9098;
      margin-top: 4px;
    `,
    annotationPanelContent: css`
      padding: 8px;
    `,
    annotationContent: css`
      margin-bottom: 8px;
    `,
    annotationMetaInfo: css`
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: #8c8c8c;
      font-size: 12px;
    `,
    annotationAttachments: css`
      margin-top: 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    `,
    attachmentTag: css`
      margin-right: 4px;
    `,
    annotationActions: css`
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 12px;
    `,
    annotationPanelIcon: css`
      display: flex;
      align-items: center;
    `,
  };
});

export default useStyles; 