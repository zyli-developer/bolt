import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css }) => {
  return {
    taskDetailPage: css`
      padding: 16px;
      transition: all 0.3s;
    `,
    chatOpen: css`
      margin-right: 320px;
    `,
    chatClosed: css`
      margin-right: 0;
    `,
    loadingContainer: css`
      display: flex;
      justify-content: center;
      align-items: center;
      height: 70vh;
      flex-direction: column;
    `,
    errorMessage: css`
      text-align: center;
      margin: 30px 0;
      font-size: 16px;
      color: #ff4d4f;
    `,
    hideTabsNav: css`
      display: none;
    `,
    taskDetailBreadcrumb: css`
      margin-bottom: 8px;
    `,
    breadcrumbArrow: css`
      cursor: pointer;
      &:hover {
        color: #1890ff;
      }
    `,
    breadcrumbParent: css`
      cursor: pointer;
      &:hover {
        color: #1890ff;
      }
    `,
    taskDetailTitleSection: css`
      margin-bottom: 16px;
    `,
    taskTitle: css`
      font-size: 20px;
      margin: 0 0 8px 0;
    `,
    taskCreatorSection: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    `,
    taskCreatorInfo: css`
      display: flex;
      align-items: center;
      gap: 8px;
    `,
    creatorText: css`
      font-size: 14px;
    `,
    creatorName: css`
      font-weight: 500;
    `,
    creatorSource: css`
      color: #1890ff;
    `,
    taskTags: css`
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    `,
    taskDimensionTag: css`
      margin: 0;
    `,
    taskActionsTop: css`
      display: flex;
      gap: 8px;
    `,
    // Task Bottom Section
    taskDetailBottomSection: css`
      margin-top: 16px;
    `,
    // Steps Navigation
    stepsNavigation: css`
      display: flex;
      justify-content: space-between;
      padding: 0 24px;
      height: 62px;
      align-items: center;
      background: #FAFAFA;
      border-radius: 12px 12px 0 0;
    `,
    step: css`
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    `,
    currentStep: css`
      cursor: pointer;
    `,
    stepIcon: css`
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
    `,
    stepIconCurrent: css`
      border: 1px solid #006ffd;
      background: #006ffd;
      color: #fff;
    `,
    stepIconCompleted: css`
      border: 1px solid #006ffd;
      background: #B4DBFF;
      color: #006ffd;
    `,
    stepIconIncomplete: css`
      border: 1px solid #8f9098;
      background: #fff;
      color: #8f9098;
    `,
    stepLabel: css`
      font-size: 12px;
      font-weight: 700;
    `,
    stepLabelCurrent: css`
      color: #006ffd;
    `,
    stepLabelCompleted: css`
      color: #006ffd;
    `,
    stepLabelIncomplete: css`
      color: #8f9098;
    `,
    // Score Section
    scoreSection: css`
      background: #EAF2FF;
      padding: 16px;
      border-radius: 12px;
      margin-bottom: 24px;
    `,
    scoreHeader: css`
      display: flex;
      align-items: center;
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
      margin-top: 8px;
    `,
    scoreLink: css`
      color: #006FFD;
    `,
    // Task Info Section
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
    // Annotation Section
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
    annotationLoading: css`
      padding: 20px 0;
      text-align: center;
    `,
    annotationLoadingText: css`
      margin-top: 8px;
      color: #8f9098;
      font-size: 12px;
    `,
    // Button Bar at bottom
    buttonBar: css`
      margin: 16px auto;
      display: flex;
      gap: 12px;
      justify-content: center;
    `,
    // Progress container for test
    progressContainer: css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 400px;
    `,
    progressText: css`
      margin-top: 24px;
    `,
    // Timeline and Animation
    timelineAnimation: css`
      position: relative;
    `,
    
    // Pulse animation (used in CSS)
    pulseAnimation: css`
      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(0, 111, 253, 0.4);
        }
        70% {
          box-shadow: 0 0 0 6px rgba(0, 111, 253, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(0, 111, 253, 0);
        }
      }
    `,
    // Evaluation Results
    evaluationChartsWrapper: css`
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      @media (max-width: 768px) {
        flex-direction: column;
      }
    `,
    evaluationLeftSection: css`
      padding: 8px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
      flex: 0 0 380px;
      
      @media (max-width: 768px) {
        flex: 0 0 auto;
        width: 100%;
      }
    `,
    evaluationRightSection: css`
      padding: 8px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
      flex: 1;
      min-width: 300px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    `,
    modelPanelHeader: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
      transition: background-color 0.3s;
      
      &:hover {
        background-color: #f0f7ff;
      }
    `,
    modelPanelLeft: css`
      display: flex;
      align-items: center;
      gap: 8px;
    `,
    modelInfo: css`
      flex: 1;
    `,
    modelTags: css`
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    `,
    modelTag: css`
      background: #f0f0f0;
      border-radius: 10px;
      padding: 0 6px;
    `,
    chartLegend: css`
      display: flex;
      flex-wrap: wrap;
    `,
    legendItem: css`
      display: flex;
      align-items: center;
      margin-right: 12px;
    `,
    legendColor: css`
      border-radius: 50%;
      margin-right: 4px;
    `,
    metricsSection: css`
      display: flex;
      flex-wrap: wrap;
      
      @media (max-width: 768px) {
        flex-direction: column;
      }
    `,
    metricItem: css`
      background: #f9f9f9;
      border-radius: 4px;
      flex: 1;
      min-width: 120px;
    `,
    positive: css`
      color: #52c41a;
    `,
    negative: css`
      color: #ff4d4f;
    `,
    scoreRadarSection: css`
      display: flex;
      flex-wrap: wrap;
      
      @media (max-width: 768px) {
        flex-direction: column;
      }
    `,
    // Customizing Ant Design components
    // (these can be used with className or passed to components)
    customTimelineItem: css`
      .ant-timeline-item-head.ant-timeline-item-head-custom {
        background: #f9f9f9 !important;
        padding: 0;
        border: none;
      }
    `,
  };
});

export default useStyles; 