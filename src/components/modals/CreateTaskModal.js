"use client"

import { useState } from "react"
import { Modal, Form, Input, Select, Button, message } from "antd"
import taskService from "../../services/taskService"

const { Option } = Select

const CreateTaskModal = ({ visible, onCancel, cardData }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()

      // 构建任务数据
      const taskData = {
        ...values,
        sourceCardId: cardData.id,
        title: cardData.title,
        createdAt: new Date().toISOString(),
        status: "pending",
        tags: cardData.tags,
        author: cardData.author,
        summary: cardData.summary,
        credibility: cardData.credibility,
        score: cardData.score,
        chartData: cardData.chartData,
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

  return (
    <Modal title="新建任务" open={visible} onCancel={onCancel} footer={null} width={500} destroyOnClose>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          permission: "workspace",
          description: `基于卡片"${cardData?.title?.substring(0, 30)}${cardData?.title?.length > 30 ? "..." : ""}"创建的任务`,
        }}
      >
        <Form.Item name="permission" label="权限设置" rules={[{ required: true, message: "请选择权限" }]}>
          <Select placeholder="请选择权限">
            <Option value="community">Community</Option>
            <Option value="workspace">Workspace</Option>
            <Option value="person">Personal</Option>
          </Select>
        </Form.Item>

        <Form.Item name="description" label="任务描述" rules={[{ required: true, message: "请输入任务描述" }]}>
          <Input.TextArea rows={4} placeholder="请输入任务描述" />
        </Form.Item>

        <Form.Item className="form-actions">
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              保存
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateTaskModal
