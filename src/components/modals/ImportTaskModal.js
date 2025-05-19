import { useState } from "react"
import { Modal, Upload, Button, Form, message } from "antd"
import { UploadOutlined, InboxOutlined } from "@ant-design/icons"
import { taskCardsData } from "../../mocks/data"

const { Dragger } = Upload

// 预设的导入数据
const mockImportData = [
  {
    id: `import_task_1_${Date.now()}`,
    prompt: "Excel导入-自动化UI测试任务",
    response_summary: "对目标网站进行自动化UI测试，验证各功能模块的可用性和稳定性，生成详细的报告和Bug列表。",
    created_by: "导入用户",
    created_from: "Excel导入",
    created_at: { seconds: Math.floor(Date.now() / 1000) - 3600 },
    status: "进行中",
    author: {
      id: "import_user_1",
      name: "导入用户",
      avatar: null
    },
    templateData: {
      nodes: [
        {
          id: "start",
          data: { label: "评估起点" },
          position: { x: 250, y: 25 },
          style: {
            background: '#f0f7ff',
            border: '1px solid #006ffd',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 'bold'
          }
        },
        {
          id: "GPT-4",
          data: { label: "GPT-4" },
          position: { x: 100, y: 150 },
          style: {
            background: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px'
          }
        },
        {
          id: "Claude",
          data: { label: "Claude" },
          position: { x: 250, y: 150 },
          style: {
            background: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px'
          }
        },
        {
          id: "DeepSeek",
          data: { label: "DeepSeek" },
          position: { x: 400, y: 150 },
          style: {
            background: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px'
          }
        },
        {
          id: "agent-2",
          data: { label: "agent-2" },
          position: { x: 550, y: 150 },
          style: {
            background: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px'
          }
        }
      ],
      edges: [
        { id: "e-start-GPT-4", source: "start", target: "GPT-4", animated: true, style: { stroke: '#006ffd' } },
        { id: "e-start-Claude", source: "start", target: "Claude", animated: true, style: { stroke: '#006ffd' } },
        { id: "e-start-DeepSeek", source: "start", target: "DeepSeek", animated: true, style: { stroke: '#006ffd' } },
        { id: "e-start-agent-2", source: "start", target: "agent-2", animated: true, style: { stroke: '#006ffd' } }
      ]
    },
    source: "Excel导入",
    tags: ["UI测试", "自动化", "测试报告"],
    title: "Excel导入-自动化UI测试任务",
    description: "对目标网站进行自动化UI测试，验证各功能模块的可用性和稳定性，生成详细的报告和Bug列表。",
    updatedAt: new Date().toLocaleString(),
    updatedBy: {
      id: "import_user_1",
      name: "导入用户",
      avatar: null
    },
    step: [
      {
        agent: "Selenium",
        score: [
          {
            version: "1.0",
            confidence: "0.93",
            score: "0.91",
            consumed_points: 65,
            description: "基于Excel导入的测试用例自动执行UI测试，并生成详细报告",
            dimension: [
              { latitude: "覆盖率", weight: 0.95 },
              { latitude: "准确性", weight: 0.92 },
              { latitude: "测试速度", weight: 0.88 }
            ]
          }
        ]
      }
    ],
    chartData: {
      radar: [
        { name: "覆盖率", value: 95 },
        { name: "准确性", value: 92 },
        { name: "测试速度", value: 88 },
        { name: "报告质量", value: 85 },
        { name: "Bug发现", value: 90 },
        { name: "稳定性", value: 87 }
      ],
      line: [
        { month: "01", value: 75 },
        { month: "02", value: 82 },
        { month: "03", value: 88 },
        { month: "04", value: 93 }
      ]
    }
  },
  {
    id: `import_task_2_${Date.now()}`,
    prompt: "Excel导入-数据分析与可视化",
    response_summary: "对导入的大规模数据集进行清洗、分析和可视化，提取关键业务指标和趋势，生成交互式仪表板。",
    created_by: "导入用户",
    created_from: "Excel导入",
    created_at: { seconds: Math.floor(Date.now() / 1000) - 7200 },
    status: "进行中",
    templateData: {
      nodes: [
        {
          id: "start",
          data: { label: "评估起点" },
          position: { x: 250, y: 25 },
          style: {
            background: '#f0f7ff',
            border: '1px solid #006ffd',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 'bold'
          }
        },
        {
          id: "GPT-4",
          data: { label: "GPT-4" },
          position: { x: 100, y: 150 },
          style: {
            background: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px'
          }
        },
        {
          id: "Claude",
          data: { label: "Claude" },
          position: { x: 250, y: 150 },
          style: {
            background: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px'
          }
        },
        {
          id: "DeepSeek",
          data: { label: "DeepSeek" },
          position: { x: 400, y: 150 },
          style: {
            background: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px'
          }
        },
        {
          id: "agent-2",
          data: { label: "agent-2" },
          position: { x: 550, y: 150 },
          style: {
            background: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px'
          }
        }
      ],
      edges: [
        { id: "e-start-GPT-4", source: "start", target: "GPT-4", animated: true, style: { stroke: '#006ffd' } },
        { id: "e-start-Claude", source: "start", target: "Claude", animated: true, style: { stroke: '#006ffd' } },
        { id: "e-start-DeepSeek", source: "start", target: "DeepSeek", animated: true, style: { stroke: '#006ffd' } },
        { id: "e-start-agent-2", source: "start", target: "agent-2", animated: true, style: { stroke: '#006ffd' } }
      ]
    },
    author: {
      id: "import_user_2",
      name: "导入用户",
      avatar: null
    },
    source: "Excel导入",
    tags: ["数据分析", "数据可视化", "仪表板"],
    title: "Excel导入-数据分析与可视化",
    description: "对导入的大规模数据集进行清洗、分析和可视化，提取关键业务指标和趋势，生成交互式仪表板。",
    updatedAt: new Date().toLocaleString(),
    updatedBy: {
      id: "import_user_2",
      name: "导入用户",
      avatar: null
    },
    step: [
      {
        agent: "PowerBI",
        score: [
          {
            version: "1.0",
            confidence: "0.87",
            score: "0.84",
            consumed_points: 72,
            description: "从Excel导入的数据集进行深度分析和可视化展示",
            dimension: [
              { latitude: "数据完整性", weight: 0.86 },
              { latitude: "图表质量", weight: 0.89 },
              { latitude: "洞察价值", weight: 0.91 }
            ]
          }
        ]
      }
    ],
    templateData: {
      nodes: [
        {
          id: "start",
          data: { label: "评估起点" },
          position: { x: 250, y: 25 },
          style: {
            background: '#f0f7ff',
            border: '1px solid #006ffd',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 'bold'
          }
        },
        {
          id: "GPT-4",
          data: { label: "GPT-4" },
          position: { x: 100, y: 150 },
          style: {
            background: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px'
          }
        },
        {
          id: "Claude",
          data: { label: "Claude" },
          position: { x: 250, y: 150 },
          style: {
            background: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px'
          }
        },
        {
          id: "DeepSeek",
          data: { label: "DeepSeek" },
          position: { x: 400, y: 150 },
          style: {
            background: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px'
          }
        },
        {
          id: "agent-2",
          data: { label: "agent-2" },
          position: { x: 550, y: 150 },
          style: {
            background: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px'
          }
        }
      ],
      edges: [
        { id: "e-start-GPT-4", source: "start", target: "GPT-4", animated: true, style: { stroke: '#006ffd' } },
        { id: "e-start-Claude", source: "start", target: "Claude", animated: true, style: { stroke: '#006ffd' } },
        { id: "e-start-DeepSeek", source: "start", target: "DeepSeek", animated: true, style: { stroke: '#006ffd' } },
        { id: "e-start-agent-2", source: "start", target: "agent-2", animated: true, style: { stroke: '#006ffd' } }
      ]
    },
    chartData: {
      radar: [
        { name: "数据完整性", value: 86 },
        { name: "图表质量", value: 89 },
        { name: "洞察价值", value: 91 },
        { name: "交互性", value: 83 },
        { name: "响应速度", value: 80 },
        { name: "易用性", value: 85 }
      ],
      line: [
        { month: "01", value: 70 },
        { month: "02", value: 78 },
        { month: "03", value: 83 },
        { month: "04", value: 87 }
      ]
    }
  },
  {
    id: `import_task_3_${Date.now()}`,
    prompt: "Excel导入-训练数据标注任务",
    response_summary: "对导入的原始数据进行人工标注，用于训练机器学习模型，包括文本分类、实体识别和情感分析任务。",
    created_by: "导入用户",
    created_from: "Excel导入",
    created_at: { seconds: Math.floor(Date.now() / 1000) - 10800 },
    status: "进行中",
    author: {
      id: "import_user_3",
      name: "导入用户",
      avatar: null
    },
    source: "Excel导入",
    tags: ["数据标注", "机器学习", "训练数据"],
    title: "Excel导入-训练数据标注任务",
    description: "对导入的原始数据进行人工标注，用于训练机器学习模型，包括文本分类、实体识别和情感分析任务。",
    updatedAt: new Date().toLocaleString(),
    updatedBy: {
      id: "import_user_3",
      name: "导入用户",
      avatar: null
    },
    step: [
      {
        agent: "标注工具",
        score: [
          {
            version: "1.0",
            confidence: "0.89",
            score: "0.86",
            consumed_points: 58,
            description: "基于Excel导入的原始数据进行标准化标注，提供高质量训练数据",
            dimension: [
              { latitude: "标注准确性", weight: 0.92 },
              { latitude: "标注一致性", weight: 0.87 },
              { latitude: "标注效率", weight: 0.85 }
            ]
          }
        ]
      }
    ],
    chartData: {
      radar: [
        { name: "标注准确性", value: 92 },
        { name: "标注一致性", value: 87 },
        { name: "标注效率", value: 85 },
        { name: "数据覆盖", value: 90 },
        { name: "质量控制", value: 88 },
        { name: "可追溯性", value: 82 }
      ],
      line: [
        { month: "01", value: 78 },
        { month: "02", value: 83 },
        { month: "03", value: 85 },
        { month: "04", value: 89 }
      ]
    }
  }
];

const ImportTaskModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState([])
  const [uploading, setUploading] = useState(false)

  // 处理文件变化
  const handleChange = (info) => {
    // 只保留最后一个文件
    const fileList = [...info.fileList].slice(-1)
    setFileList(fileList)
  }

  // 提交表单
  const handleSubmit = async () => {
    if (fileList.length === 0) {
      message.error("请选择Excel文件")
      return
    }

    try {
      setUploading(true)
      
      // 模拟上传和处理延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 为每个预设任务生成唯一ID以确保不会冲突
      const timestamp = Date.now()
      const importedTasks = []
      
      // 处理每个预设任务数据
      mockImportData.forEach((task, index) => {
        // 为每个任务生成唯一ID（使用时间戳和索引组合）
        const uniqueId = `import_task_${timestamp}_${index}`
        const taskWithUniqueId = {
          ...task,
          id: uniqueId
        }
        
        // 添加到导入任务列表
        importedTasks.push(taskWithUniqueId)
        
        // 同时添加到taskCardsData数组中(保持原有功能)
        taskCardsData.unshift(taskWithUniqueId)
      })
      
      // 将导入的任务保存到localStorage中
      try {
        // 获取现有任务数据
        const existingTasksJson = localStorage.getItem('imported_tasks') || '[]'
        const existingTasks = JSON.parse(existingTasksJson)
        
        // 合并新导入的任务
        const updatedTasks = [...importedTasks, ...existingTasks]
        
        // 保存回localStorage
        localStorage.setItem('imported_tasks', JSON.stringify(updatedTasks))
        
        // 设置最后更新时间，用于触发Storage事件
        localStorage.setItem('tasks_last_imported', Date.now().toString())
        
        // 触发自定义事件，通知TaskPage组件刷新数据
        const importEvent = new CustomEvent('tasksImported', {
          detail: { 
            tasks: importedTasks,
            timestamp: Date.now() 
          }
        })
        window.dispatchEvent(importEvent)
      } catch (error) {
        console.error('保存导入任务到localStorage失败:', error)
      }
      
      message.success("导入成功：已添加3条任务数据")
      
      // 清空表单和文件列表
      form.resetFields()
      setFileList([])
      
      // 关闭Modal
      onCancel()
      
      // 延迟一下再通知父组件成功，确保组件状态更新顺序正确
      setTimeout(() => {
        // 通知父组件导入成功
        if (onSuccess) {
          onSuccess()
        }
      }, 100)
    } catch (error) {
      console.error("导入失败:", error)
      message.error("导入失败，请重试")
    } finally {
      setUploading(false)
    }
  }

  // 自定义上传按钮
  const uploadProps = {
    onRemove: (file) => {
      setFileList([])
    },
    beforeUpload: (file) => {
      // 检查文件类型
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                     file.type === 'application/vnd.ms-excel' ||
                     /\.xlsx?$/.test(file.name.toLowerCase())
      
      if (!isExcel) {
        message.error('请上传Excel文件')
        return Upload.LIST_IGNORE
      }
      
      return false // 阻止自动上传
    },
    fileList,
    onChange: handleChange,
  }

  return (
    <Modal
      title="导入任务"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={uploading}
          onClick={handleSubmit}
        >
          导入
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="file" label="选择Excel文件">
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">仅支持Excel文件格式(.xlsx, .xls)</p>
          </Dragger>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ImportTaskModal 