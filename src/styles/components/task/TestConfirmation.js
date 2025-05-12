import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      display: flex; 
      flex-direction: column;
      height: 100%;
      width: 100%;
    `,
    mainContent: css`
      display: flex;
      min-height: calc(100vh - 300px);
      background: #FAFAFA;
      border-radius: 0 0 12px 12px;
      flex: 1;
      width: 100%;
    `,
    leftMenu: css`
      width: 110px;
      border-right: 1px solid #f0f0f0;
      padding: 16px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    `,
    taskOverviewTitle: css`
      padding: 0 0 40px;
      font-size: 14px;
      font-weight: 600;
      color: #000;
      text-align: center;
    `,
    timelineDot: css`
      width: 24px;
      height: 24px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    `,
    timelineDotActive: css`
      background: #f0f7ff;
    `,
    timelineDotInactive: css`
      background: #f9f9f9;
    `,
    timelineItem: css`
      padding: 0 0 32px;
    `,
    timelineText: css`
      font-size: 14px;
      cursor: pointer;
      margin-left: 8px;
    `,
    timelineTextActive: css`
      color: #006ffd;
    `,
    timelineTextInactive: css`
      color: #8f9098;
    `,
    rightContent: css`
      flex: 1;
      padding: 24px;
      display: flex;
      flex-direction: column;
      width: calc(100% - 110px);
    `,
    progressContainer: css`
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      justify-content: center;
      min-height: calc(100vh - 200px);
      height: 100%;
      width: 100%;
      text-align: center;
      background: #FAFAFA;
      border-radius: 12px;
      padding: 40px 20px;
    `,
    progressText: css`
      margin-top: 24px; 
      margin-bottom: 8px;
    `,
    progressCard: css`
      background: #f9f9f9;
      border-radius: 8px;
      overflow: hidden;
    `,
    loadingContainer: css`
      text-align: center; 
      padding: 40px 0;
    `,
    loadingText: css`
      margin-top: 16px;
    `,
    section: css`
      background: #FAFAFA;
      border-radius: 12px;
      margin: -24px;
      width: 100%;
    `,
    scoreSection: css`
      background: #EAF2FF;
      padding: 16px;
      border-radius: 12px;
      margin-bottom: 24px;
      width: 100%;
    `,
    scoreHeader: css`
      display: flex; 
      align-items: center;
      cursor: pointer;
    `,
    scoreHeaderExpanded: css`
      margin-bottom: 8px;
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
    infoSection: css`
      margin-bottom: 24px;
      width: 100%;
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
      flex: 1; 
      display: flex; 
      align-items: center; 
      gap: 8px;
    `,
    tag: css`
      border-radius: 12px; 
      margin-right: 8px;
    `,
    annotationSection: css`
      margin-bottom: 24px;
      width: 100%;
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
      width: 100%;
    `,
    summaryIcon: css`
      color: #52c41a;
    `,
    header: css`
      margin-bottom: 24px;
    `,
    title: css`
      margin: 0 0 0 16px;
      display: inline-block;
    `,
    listItem: css`
      display: flex;
      align-items: center;
    `,
    summaryText: css`
      margin-left: 8px;
    `,
    section: css`
      border-radius: 8px;
      width: 100%;
    `,
    testSummary: css`
      background: #f9f9f9;
      border-radius: 8px;
      padding: 16px;
      width: 100%;
    `,
    parametersGrid: css`
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-top: 16px;
    `,
    parameterCard: css`
      background: #fff;
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    `,
    parameterName: css`
      color: #8c8c8c;
      font-size: 13px;
      margin-bottom: 4px;
    `,
    parameterValue: css`
      font-weight: 500;
      font-size: 15px;
    `,
    testWarning: css`
      background: #fffbe6;
      border: 1px solid #ffe58f;
      border-radius: 8px;
      padding: 12px 16px;
      width: 100%;
    `,
    testButton: css`
      text-align: center;
      margin-top: 24px;
      width: 100%;
    `,
    buttonLarge: css`
      min-width: 200px;
      height: 44px;
    `,
  };
});

export default useStyles; 