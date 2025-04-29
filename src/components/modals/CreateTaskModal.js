"use client"

import { useState, useEffect } from "react"
import { Modal, Form, Input, Select, Button, message, Steps, DatePicker, Divider, Card, Avatar, Timeline } from "antd"
import { UserOutlined, EditOutlined, CheckOutlined } from "@ant-design/icons"
import taskService from "../../services/taskService"
import useStyles from "../../styles/components/modals/create-task-modal"
import dayjs from 'dayjs'
import ConfirmPage from "./CreateTaskModal/ConfirmPage"

const { Option } = Select
const { Step } = Steps
const { TextArea } = Input
const { Search } = Input

const CreateTaskModal = ({ visible, onCancel, cardData }) => {
  const { styles } = useStyles()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [nameValidating, setNameValidating] = useState(false)
  const [confirmSection, setConfirmSection] = useState('basicInfo')
  const [showTargetDescription, setShowTargetDescription] = useState(false)
  
  // 模拟用户数据
  const mockUsers = [
    { id: '1', name: 'Jackson', avatar: 'J' },
    { id: '2', name: 'Jackson', avatar: 'J' },
  ];
  
  const steps = [
    {
      title: '基本信息',
      content: 'first',
    },
    {
      title: 'QA',
      content: 'second',
    },
    {
      title: '权限分配',
      content: 'third',
    },
    {
      title: '确认发布',
      content: 'fourth',
    },
  ]

  // 初始化表单数据
  useEffect(() => {
    if (visible && cardData) {
      // 如果有cardData，则预填充表单
      form.setFieldsValue({
        title: cardData.title || "",
        description: `基于卡片"${cardData.title?.substring(0, 30)}${cardData.title?.length > 30 ? "..." : ""}"创建的任务`,
        priority: cardData.priority || "medium",
        testTarget: cardData.testTarget || "web_app_llm",
        brand: cardData.brand || "",
        model: cardData.model || "",
        version: cardData.version || "",
        paramCount: cardData.paramCount || "",
        recommendPrecision: cardData.recommendPrecision || "",
      });
      
      // 如果测评对象是"other"，显示补充描述输入框
      if (cardData.testTarget === "other") {
        setShowTargetDescription(true);
      }
    }
  }, [visible, cardData, form]);
  
  // 检查名称唯一性的函数
  const checkNameUnique = async (name) => {
    if (!name || name.trim() === '') return true
    
    try {
      setNameValidating(true)
      // 调用API检查名称是否已存在
      const isUnique = await taskService.checkTaskNameUnique(name)
      return isUnique
    } catch (error) {
      console.error("检查名称唯一性失败:", error)
      return false
    } finally {
      setNameValidating(false)
    }
  }
  
  // 禁用当前日期之前的所有日期
  const disabledDate = (current) => {
    // 禁用今天之前的日期
    return current && current < dayjs().startOf('day')
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      // 验证所有步骤的必填字段
      const allRequiredFields = [
        ...getStepFieldNames(0),
        ...getStepFieldNames(1),
        ...getStepFieldNames(2),
        ...getStepFieldNames(3)
      ];
      
      const values = await form.validateFields(allRequiredFields)

      // 构建任务数据
      const taskData = {
        ...values,
        createdAt: new Date().toISOString(),
        status: "pending",
        // 如果有cardData，则使用cardData的数据，否则使用默认值
        sourceCardId: cardData?.id || null,
        title: values.title || (cardData?.title || "新建任务"),
        tags: cardData?.tags || [],
        author: cardData?.author || null,
        summary: cardData?.summary || "",
        credibility: cardData?.credibility || 0,
        score: cardData?.score || 0,
        chartData: cardData?.chartData || null,
        // 添加QA数据
        qa: {
          question: values.questionDescription,
          answer: values.answerDescription
        },
        // 添加权限分配数据
        permissions: {
          sceneEditors: values.sceneEditors || [],
          templateEditors: values.templateEditors || [],
          viewpointEditors: values.viewpointEditors || []
        }
      }

      // 调用保存任务接口
      await taskService.createTask(taskData)

      message.success("任务创建成功")
      form.resetFields()
      onCancel()
    } catch (error) {
      console.error("创建任务失败:", error)
      message.error("创建任务失败，请重试")
    } finally {
      setLoading(false)
    }
  }
  
  const handleNext = async () => {
    try {
      // 验证当前步骤的表单字段
      const stepFieldNames = getStepFieldNames(currentStep);
      await form.validateFields(stepFieldNames);
      setCurrentStep(currentStep + 1)
    } catch (error) {
      console.error("表单验证失败:", error)
    }
  }
  
  const handleBack = () => {
    if (currentStep === 0) {
      onCancel()
    } else {
      setCurrentStep(currentStep - 1)
    }
  }
  
  const handleSaveAndNext = async () => {
    try {
      // 验证当前步骤的表单字段
      const stepFieldNames = getStepFieldNames(currentStep);
      await form.validateFields(stepFieldNames);
      
      // 这里可以添加保存逻辑
      message.success("保存成功");
      
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error("表单验证失败:", error);
    }
  };
  
  // 根据当前步骤获取需要验证的字段
  const getStepFieldNames = (step) => {
    switch (step) {
      case 0:
        return ['title', 'description', 'priority', 'testTarget'];
      case 1:
        return ['questionDescription', 'answerDescription'];
      case 2:
        return ['sceneEditors', 'templateEditors', 'viewpointEditors'];
      case 3:
        return []; // 第四步的字段
      default:
        return [];
    }
  };
  
  // 用户搜索处理
  const handleUserSearch = (value, type) => {
    // 这里可以实现搜索逻辑
    console.log(`搜索${type}用户:`, value);
  };
  
  // 渲染确认发布页面的基本信息内容
  const renderConfirmBasicInfo = () => {
    const formValues = form.getFieldsValue();
    
    return (
      <div className={styles.confirmSection}>
    
        
        <div className={styles.confirmInfoRow}>
          <div className={styles.confirmInfoLabel}>任务名称</div>
          <div className={styles.confirmInfoValue}>{formValues.title}</div>
        </div>
        
        <div className={styles.confirmInfoRow}>
          <div className={styles.confirmInfoLabel}>创建人</div>
          <div className={styles.confirmInfoValue}>
            <Avatar size={24} style={{ marginRight: '8px' }}>M</Avatar>
            Mike
          </div>
        </div>
        
        <div className={styles.confirmInfoRow}>
          <div className={styles.confirmInfoLabel}>描述</div>
          <div className={styles.confirmInfoValue}>{formValues.description}</div>
        </div>
        
        <div className={styles.confirmInfoRow}>
          <div className={styles.confirmInfoLabel}>优先级</div>
          <div className={styles.confirmInfoValue}>
            {formValues.priority === 'high' ? '高' : 
             formValues.priority === 'medium' ? '中' : 
             formValues.priority === 'low' ? '低' : ''}
          </div>
        </div>
        
        <div className={styles.confirmInfoRow}>
          <div className={styles.confirmInfoLabel}>完成期限</div>
          <div className={styles.confirmInfoValue}>
            {formValues.deadline ? dayjs(formValues.deadline).format('YYYY-MM-DD') : '未设置'}
          </div>
        </div>
        
        <div className={styles.confirmInfoRow}>
          <div className={styles.confirmInfoLabel}>测评对象</div>
          <div className={styles.confirmInfoValue}>{formValues.testTarget}</div>
        </div>
        
        {formValues.testTarget === 'other' && (
          <div className={styles.confirmInfoRow}>
            <div className={styles.confirmInfoLabel}>补充描述</div>
            <div className={styles.confirmInfoValue}>{formValues.targetDescription || '无'}</div>
          </div>
        )}
        
        <div className={styles.confirmInfoSection}>
          <div className={styles.confirmInfoRow}>
            <div className={styles.confirmInfoLabel}>品牌</div>
            <div className={styles.confirmInfoValue}>{formValues.brand || '无'}</div>
          </div>
          
          <div className={styles.confirmInfoRow}>
            <div className={styles.confirmInfoLabel}>型号</div>
            <div className={styles.confirmInfoValue}>{formValues.model || '无'}</div>
          </div>
          
          <div className={styles.confirmInfoRow}>
            <div className={styles.confirmInfoLabel}>版本</div>
            <div className={styles.confirmInfoValue}>{formValues.version || '无'}</div>
          </div>
          
          <div className={styles.confirmInfoRow}>
            <div className={styles.confirmInfoLabel}>参数量</div>
            <div className={styles.confirmInfoValue}>{formValues.paramCount || '无'}</div>
          </div>
          
          <div className={styles.confirmInfoRow}>
            <div className={styles.confirmInfoLabel}>推理精度</div>
            <div className={styles.confirmInfoValue}>{formValues.recommendPrecision || '无'}</div>
          </div>
        </div>
      </div>
    );
  };
  
  // 渲染确认发布页面的QA内容
  const renderConfirmQA = () => {
    const formValues = form.getFieldsValue();
    
    return (
      <div className={styles.confirmSection}>
        <div className={styles.confirmSectionTitle}>编辑QA</div>
        
        <div className={styles.confirmInfoRow}>
          <div className={styles.confirmInfoLabel}>问题描述</div>
          <div className={styles.confirmInfoValue}>{formValues.questionDescription}</div>
        </div>
        
        <div className={styles.confirmInfoRow}>
          <div className={styles.confirmInfoLabel}>答案描述</div>
          <div className={styles.confirmInfoValue}>{formValues.answerDescription}</div>
        </div>
      </div>
    );
  };
  
  // 渲染确认发布页面的权限分配内容
  const renderConfirmPermissions = () => {
    const formValues = form.getFieldsValue();
    
    return (
      <div className={styles.confirmSection}>
        <div className={styles.confirmSectionTitle}>权限分配</div>
        
        <div className={styles.confirmPermissionCard}>
          <div className={styles.confirmPermissionTitle}>
            <EditOutlined /> 编辑场景
          </div>
          <div className={styles.confirmPermissionDesc}>
            以下用户可以：编辑场景和针对场景的观点
          </div>
          <div className={styles.confirmUserList}>
            {mockUsers.map(user => (
              <div key={`confirm-scene-${user.id}`} className={styles.userItem}>
                <Avatar className={styles.userAvatar}>{user.avatar}</Avatar>
                <span className={styles.userName}>{user.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.confirmPermissionCard}>
          <div className={styles.confirmPermissionTitle}>
            <EditOutlined /> 编辑模板
          </div>
          <div className={styles.confirmPermissionDesc}>
            以下用户可以：编辑模板和针对模板的观点
          </div>
          <div className={styles.confirmUserList}>
            {mockUsers.map(user => (
              <div key={`confirm-template-${user.id}`} className={styles.userItem}>
                <Avatar className={styles.userAvatar}>{user.avatar}</Avatar>
                <span className={styles.userName}>{user.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.confirmPermissionCard}>
          <div className={styles.confirmPermissionTitle}>
            <EditOutlined /> 编辑观点
          </div>
          <div className={styles.confirmPermissionDesc}>
            以下用户可以：编辑针对该任务的全部观点
          </div>
          <div className={styles.confirmUserList}>
            {mockUsers.map(user => (
              <div key={`confirm-viewpoint-${user.id}`} className={styles.userItem}>
                <Avatar className={styles.userAvatar}>{user.avatar}</Avatar>
                <span className={styles.userName}>{user.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // 根据选择的确认部分渲染对应的内容
  const renderConfirmContent = () => {
    switch (confirmSection) {
      case 'basicInfo':
        return renderConfirmBasicInfo();
      case 'qa':
        return renderConfirmQA();
      case 'permissions':
        return renderConfirmPermissions();
      default:
        return renderConfirmBasicInfo();
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
 
            
            <Form.Item 
              name="title" 
              label="名称" 
              rules={[
                { required: true, message: "请输入任务名称" },
                {
                  validator: async (_, value) => {
                    if (!value || value.trim() === '') return
                    
                    const isUnique = await checkNameUnique(value)
                    if (!isUnique) {
                      throw new Error('任务名称已存在，请更换名称')
                    }
                  },
                }
              ]}
              validateStatus={nameValidating ? 'validating' : undefined}
              hasFeedback
            >
              <Input placeholder="请输入任务名称" />
            </Form.Item>

            <Form.Item name="description" label="描述" rules={[{ required: true, message: "请输入任务描述" }]}>
              <TextArea rows={6} placeholder="请输入任务描述" className={styles.textArea} />
            </Form.Item>

            <Form.Item name="priority" label="优先级" rules={[{ required: true, message: "请选择优先级" }]}>
              <Select placeholder="Please select">
                <Option value="high">高</Option>
                <Option value="medium">中</Option>
                <Option value="low">低</Option>
              </Select>
            </Form.Item>

            <Form.Item name="deadline" label="完成期限">
              <DatePicker 
                placeholder="Select date" 
                style={{ width: '100%' }} 
                disabledDate={disabledDate}
              />
            </Form.Item>
            
            <Divider />
            
            <Form.Item name="testTarget" label="测评对象" rules={[{ required: true, message: "请选择测评对象" }]}>
              <Select placeholder="Please select" onChange={(value) => {
                setShowTargetDescription(value === 'other');
              }}>
                <Option value="web_app_llm">大语言模型（网页、app端）</Option>
                <Option value="local_llm">大语言模型（本地部署）</Option>
                <Option value="smart_cockpit">智能座舱</Option>
                <Option value="smart_watch">智能手表</Option>
                <Option value="smart_toy">智能玩具</Option>
                <Option value="smart_furniture">智能家具</Option>
                <Option value="other">其他</Option>
              </Select>
            </Form.Item>
            
            {showTargetDescription && (
              <Form.Item
                name="targetDescription"
                label="补充描述"
                rules={[{ required: true, message: "请输入补充描述" }]}
              >
                <TextArea rows={2} placeholder="请补充描述" className={styles.textArea} />
              </Form.Item>
            )}
            
            <div className={styles.infoText}>选填但很重要：填写越详细，测试可信度越高。</div>
            
            <div className={styles.formGrid}>
              <Form.Item name="brand" label="品牌" className={styles.gridItem}>
                <Input placeholder="请输入任务名称" />
              </Form.Item>
              
              <Form.Item name="model" label="型号" className={styles.gridItem}>
                <Input placeholder="请输入任务名称" />
              </Form.Item>
              
              <Form.Item name="version" label="版本" className={styles.gridItem}>
                <Input placeholder="请输入任务名称" />
              </Form.Item>
              
              <Form.Item name="paramCount" label="参数量" className={styles.gridItem}>
                <Input placeholder="请输入任务名称" />
              </Form.Item>
              
              <Form.Item name="recommendPrecision" label="推理精度" className={styles.gridItem} style={{ gridColumn: "1 / span 2" }}>
                <Input placeholder="请输入任务名称" />
              </Form.Item>
            </div>
          </>
        )
      case 1:
        return (
          <>            
            <div className={styles.qaContainer}>
              <Form.Item 
                name="questionDescription" 
                label="问题描述" 
                rules={[{ required: true, message: "请输入问题描述" }]}
              >
                <TextArea 
                  rows={10} 
                  placeholder="请输入问题描述" 
                  className={styles.qaTextarea} 
                />
              </Form.Item>
              
              <Form.Item 
                name="answerDescription" 
                label="答案描述" 
                rules={[{ required: true, message: "请输入答案描述" }]}
              >
                <TextArea 
                  rows={10} 
                  placeholder="请输入答案描述" 
                  className={styles.qaTextarea} 
                />
              </Form.Item>
            </div>
          </>
        )
      case 2:
        return (
          <>

            
            <div className={styles.permissionText}>
              针对以下三项工作，分别选择有操作权限的用户：
            </div>
            
            <div className={styles.permissionCards}>
              <Card className={styles.permissionCard}>
                <div className={styles.permissionCardTitle}>
                  <EditOutlined /> 编辑场景
                </div>
                <div className={styles.permissionCardDesc}>
                  以下 2 位用户可以：编辑场景和针对场景的观点
                </div>
                
                <Form.Item name="sceneEditors" className={styles.userSelectForm}>
                  <div className={styles.userSearchContainer}>
                    <Search 
                      placeholder="搜索" 
                      onSearch={(value) => handleUserSearch(value, 'scene')}
                      className={styles.userSearch}
                      prefix={<UserOutlined />}
                    />
                  </div>
                  
                  <div className={styles.userList}>
                    {mockUsers.map(user => (
                      <div key={`scene-${user.id}`} className={styles.userItem}>
                        <Avatar className={styles.userAvatar}>{user.avatar}</Avatar>
                        <span className={styles.userName}>{user.name}</span>
                      </div>
                    ))}
                  </div>
                </Form.Item>
              </Card>
              
              <Card className={styles.permissionCard}>
                <div className={styles.permissionCardTitle}>
                  <EditOutlined /> 编辑模板
                </div>
                <div className={styles.permissionCardDesc}>
                  以下 2 位用户可以：编辑模板和针对模板的观点
                </div>
                
                <Form.Item name="templateEditors" className={styles.userSelectForm}>
                  <div className={styles.userSearchContainer}>
                    <Search 
                      placeholder="搜索" 
                      onSearch={(value) => handleUserSearch(value, 'template')}
                      className={styles.userSearch}
                      prefix={<UserOutlined />}
                    />
                  </div>
                  
                  <div className={styles.userList}>
                    {mockUsers.map(user => (
                      <div key={`template-${user.id}`} className={styles.userItem}>
                        <Avatar className={styles.userAvatar}>{user.avatar}</Avatar>
                        <span className={styles.userName}>{user.name}</span>
                      </div>
                    ))}
                  </div>
                </Form.Item>
              </Card>
              
              <Card className={styles.permissionCard}>
                <div className={styles.permissionCardTitle}>
                  <EditOutlined /> 编辑观点
                </div>
                <div className={styles.permissionCardDesc}>
                  以下 2 位用户可以：编辑针对该任务的全部观点
                </div>
                
                <Form.Item name="viewpointEditors" className={styles.userSelectForm}>
                  <div className={styles.userSearchContainer}>
                    <Search 
                      placeholder="搜索" 
                      onSearch={(value) => handleUserSearch(value, 'viewpoint')}
                      className={styles.userSearch}
                      prefix={<UserOutlined />}
                    />
                  </div>
                  
                  <div className={styles.userList}>
                    {mockUsers.map(user => (
                      <div key={`viewpoint-${user.id}`} className={styles.userItem}>
                        <Avatar className={styles.userAvatar}>{user.avatar}</Avatar>
                        <span className={styles.userName}>{user.name}</span>
                      </div>
                    ))}
                  </div>
                </Form.Item>
              </Card>
            </div>
          </>
        );
      case 3:
        return (
          <ConfirmPage formData={form.getFieldsValue(true)} />
        )
      default:
        return null
    }
  }

  return (
    <Modal 
      title={null}
      open={visible} 
      onCancel={onCancel} 
      footer={null} 
      width="80vw"
      height="95vh"
      style={{ top: 20 }}
      bodyStyle={{ height: 'calc(95vh - 56px)', display: 'flex', flexDirection: 'column' }}
      destroyOnClose
      className={styles.modal}
    >
      <div className={styles.stepsContainer}>
        <Steps current={currentStep} items={steps.map(item => ({ title: item.title }))} />
      </div>
      
      <div className={styles.contentContainer}>
      <Form
        form={form}
        layout="vertical"
          className={styles.form}
        initialValues={{
          permission: "workspace",
            title: cardData?.title || "",
            description: cardData ? `基于卡片"${cardData?.title?.substring(0, 30)}${cardData?.title?.length > 30 ? "..." : ""}"创建的任务` : "",
            questionDescription: "",
            answerDescription: "",
            sceneEditors: [],
            templateEditors: [],
            viewpointEditors: [],
            targetDescriptionVisible: false,
            priority: "medium"
          }}
        >
          {renderContent()}
        </Form>
      </div>

      <div className={styles.footerButtons}>
        <Button onClick={handleBack}>
          {currentStep === 0 ? '返回' : '上一步'}
        </Button>
        <Button onClick={handleSubmit}>
              保存
            </Button>
        {currentStep === 3 ? (
          <Button type="primary" onClick={handleSubmit}>
            确认创建
          </Button>
        ) : (
          <Button type="primary" onClick={handleSaveAndNext}>
            保存并进入下一步
          </Button>
        )}
          </div>
    </Modal>
  )
}

export default CreateTaskModal
