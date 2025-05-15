# 1. Syntrust API Protocol Buffers 规范 v1

## 1.1 目录

- [1. Syntrust API Protocol Buffers 规范 v1](#1-syntrust-api-protocol-buffers-规范-v1)
  - [1.1 目录](#11-目录)
- [2. API 设计规范说明](#2-api-设计规范说明)
  - [2.1 版本控制](#21-版本控制)
  - [2.2 认证方式](#22-认证方式)
  - [2.3 请求/响应格式](#23-请求响应格式)
  - [2.4 状态码使用](#24-状态码使用)
  - [2.5 错误响应格式](#25-错误响应格式)
  - [2.6 分页参数](#26-分页参数)
- [3. 基础消息类型](#3-基础消息类型)
  - [3.1 用户与权限相关消息类型](#31-用户与权限相关消息类型)
  - [3.2 维度与场景相关消息类型](#32-维度与场景相关消息类型)
  - [3.3 评分与流程相关消息类型](#33-评分与流程相关消息类型)
  - [3.4 分类与侧边栏相关消息类型](#34-分类与侧边栏相关消息类型)
  - [3.5 卡片与任务相关消息类型](#35-卡片与任务相关消息类型)
  - [3.6 消息、附件与批注相关消息类型](#36-消息附件与批注相关消息类型)
- [4. API 端点定义](#4-api-端点定义)
  - [4.1 用户认证](#41-用户认证)
    - [4.1.1 密码登录](#411-密码登录)
    - [4.1.2 手机验证码登录](#412-手机验证码登录)
      - [4.1.2.1 发送验证码](#4121-发送验证码)
      - [4.1.2.2 验证码登录](#4122-验证码登录)
    - [4.1.3 SSO 登录](#413-sso-登录)
    - [4.1.4 用户注册](#414-用户注册)
  - [4.2 探索](#42-探索)
    - [4.2.1 获取探索列表](#421-获取探索列表)
    - [4.2.2 获取探索详情](#422-获取探索详情)
  - [4.3 任务](#43-任务)
    - [4.3.1 获取任务列表](#431-获取任务列表)
    - [4.3.2 获取任务详情](#432-获取任务详情)
      - [4.3.2.1 获取任务详情概览](#4321-获取任务详情概览)
      - [4.3.2.2 获取任务详情答案](#4322-获取任务详情答案)
      - [4.3.2.3 获取任务详情场景](#4323-获取任务详情场景)
      - [4.3.2.4 获取任务详情模板](#4324-获取任务详情模板)
  - [4.4 资产](#44-资产)
    - [4.4.1 获取资产详情](#441-获取资产详情)
  - [4.5 工作空间](#45-工作空间)
    - [4.5.1 保存新建 task 信息](#451-保存新建-task-信息)
    - [4.5.2 更新 task 信息](#452-更新-task-信息)
    - [4.5.3 删除 task](#453-删除-task)
  - [4.6 文件上传](#46-文件上传)
    - [4.6.1 上传文件](#461-上传文件)
  - [4.7 机器人对话](#47-机器人对话)
    - [4.7.1 发送消息](#471-发送消息)
  - [4.8 条件搜索](#48-条件搜索)
    - [4.8.1 复合过滤条件](#481-复合过滤条件)
      - [4.8.1.1 比较运算符](#4811-比较运算符)
      - [4.8.1.2 单一条件表达式](#4812-单一条件表达式)
      - [4.8.1.3 过滤条件列表结构](#4813-过滤条件列表结构)
    - [4.8.2 排序表达式](#482-排序表达式)
    - [4.8.3 分页参数](#483-分页参数)
    - [4.8.4 探索列表搜索接口](#484-探索列表搜索接口)
    - [4.8.5 任务列表搜索接口](#485-任务列表搜索接口)
    - [4.8.6 资产列表搜索接口](#486-资产列表搜索接口)

## 2. API 设计规范说明

### 2.1 版本控制
- API 版本通过 URL 路径前缀`/v1`进行控制
- 重大更新时递增版本号，如`/v2`，确保向后兼容

### 2.2 认证方式
- 统一使用 JWT Token 认证
- Token 通过请求头`Authorization: Bearer <token>`传递
- 登录接口返回 token，其他接口需要携带 token 访问

### 2.3 请求/响应格式
- 请求和响应消息使用 Protocol Buffers 格式
- 时间类型使用 google.protobuf.Timestamp

### 2.4 状态码使用
- 200: 请求成功
- 201: 创建成功
- 400: 请求参数错误
- 401: 未授权
- 403: 权限不足
- 404: 资源不存在
- 500: 服务器错误

### 2.5 错误响应格式
```protobuf
message Error {
  string code = 1;
  string message = 2;
}
```

### 2.6 分页参数
```protobuf
message PaginationRequest {
  int32 page = 1;  // 默认1
  int32 per_page = 2;  // 默认20
}

message PaginatedResponse {
  int32 total = 1;
  int32 page = 2;
  int32 per_page = 3;
}
```

## 3. 基础消息类型

### 3.1 用户与权限相关消息类型

```protobuf
message User {
  string id = 1;
  string email = 2;
  string name = 3;
  string workspace = 4;
  bool vip = 5;
  string avatar = 6;
  string phone = 7;
  string role = 8;
  map<string, string> preferences = 9;
  google.protobuf.Timestamp last_login = 10;
  google.protobuf.Timestamp created_at = 11;
  google.protobuf.Timestamp updated_at = 12;
}
```

### 3.2 维度与场景相关消息类型

```protobuf
message Dimension {
  string latitude = 1;
  float weight = 2;
}

message DimensionNode {
  string id = 1;
  string label = 2;  // equals "name"
  int32 weight = 3;
  message Position {
    int32 x = 1;
    int32 y = 2;
  }
  string type = 4;
  Position position = 5;
}

message DimensionEdge {
  string id = 1;
  string source = 2;
  string target = 3;
}

message Scenario {
  repeated DimensionNode node = 1;
  repeated DimensionEdge edge = 2;
}
```

### 3.3 评分与流程相关消息类型

```protobuf
message Score {
  string version = 1;
  string confidence = 2;
  string score = 3;
  int32 consumed_points = 4;
  string description = 5;
  repeated Dimension dimension = 6;
  google.protobuf.Timestamp updated_at = 7;
}

message Step {
  string agent = 1;
  repeated Score score = 2;
  string reason = 3;
}

message StepNode {
  string id = 1;
  string label = 2;  // equals "name"
  string executor_type = 3;  // "human" or "agent"
  string executor_id = 4;
  string description = 5;
  message Position {
    int32 x = 1;
    int32 y = 2;
  }
  Position position = 6;
  string type = 7;
  repeated Dimension dimension = 8; // latitude: weight
}

message StepEdge {
  string id = 1;
  string source = 2;
  string target = 3;
}

message FlowConfig {
  repeated StepNode nodes = 1;
  repeated StepEdge edges = 2;
}
```

### 3.4 分类与侧边栏相关消息类型

```protobuf
message ClassificationList {
  // 分类列表
  string classification = 1;
  repeated Level1 level1 = 2;
}

message Level1 {
  // 第一级子列表
  string level_1_name = 1;
  repeated Level2 level2 = 2;
}

message Level2 {
  // 第二级子列表
  string level_2_name = 1;
  repeated Element level3 = 2;
}

message Element {
  string name = 1;
  string classification = 2;
  string id = 3;
}

message Sidebar {
  repeated ClassificationList classification = 1;
}
```

### 3.5 卡片与任务相关消息类型

```protobuf
message ExplorationCard {
  string id = 1;
  string prompt = 2; // 这里的prompt，作为每个卡片的标题
  string response_summary = 3;
  string created_by = 4;
  string created_from = 5;
  google.protobuf.Timestamp created_at = 6;
  repeated Step step = 7;
  // tbd
  // repeated Milestone milestones = 8;
  // repeated TeamMember team_members = 9;
}

// tbd
// message Milestone {
//   string id = 1;
//   string title = 2;
//   string status = 3;
//   google.protobuf.Timestamp completion_date = 4;
// }

// tbd
// message TeamMember {
//   string id = 1;
//   string name = 2;
//   string role = 3;
// }

message TaskCard {
  string id = 1;
  string prompt = 2; // 这里的prompt，作为每个卡片的标题
  string response_summary = 3;
  string created_by = 4;
  string created_from = 5;
  google.protobuf.Timestamp created_at = 6;
  repeated Step step = 7;
  string status = 8;
  // tbd add qa, scenario, model
}

message TaskData {
  string title = 1;
  string prompt = 2;
  string response = 3;
  string context = 4;
  string object = 5;
  string brand = 6;
  string model = 7;
  string version = 8;
  string parameter_quantity = 9;
  string reasoning_accuracy = 10;
  int priority = 11;
  google.protobuf.Timestamp due_date = 12;
  User assigned_to = 13;
  FlowConfig flow_config = 14;
  string user_id = 15;  // 创建者
  Scenario scenario = 16;
}
```

### 3.6 消息、附件与批注相关消息类型

```protobuf
message Message {
  string id = 1;
  string chat_id = 2;
  string content = 3;
  string type = 4;
  string priority = 5;
  User sender = 6;
  string status = 7;
  repeated string read_by = 8;
  map<string, string> metadata = 9;
  google.protobuf.Timestamp sent_at = 10;
}

message Attachment {
  string id = 1;
  string file_name = 2;
  string content_type = 3;
  string file_path = 4;
}

message Annotation {
  string id = 1;
  string target = 2;
  string body = 3;
  string type = 4;
  google.protobuf.Timestamp created_at = 5;
  google.protobuf.Timestamp updated_at = 6;
  string annotator_id = 7;
  string task_id = 8;
  string title = 9;
  string comment = 10;
  repeated Attachment attachment = 11;

  message Value {
    // For text labels
    message TextLabel {
      int32 start = 1;
      int32 end = 2;
      string text = 3;
      repeated string labels = 4;
    }

    // For textarea
    message TextArea {
      repeated string text = 1;
      message Meta {
        double lead_time = 1;
        map<string, string> additional_meta = 2;
      }
      Meta meta = 2;
    }

    // For choices
    message Choice {
      repeated string choices = 1;
    }

    // For image regions
    message Region {
      int32 x = 1;
      int32 y = 2;
      int32 width = 3;
      int32 height = 4;
      repeated string labels = 5;
    }

    oneof value_type {
      TextLabel text_label = 1;
      TextArea text_area = 2;
      Choice choice = 3;
      Region region = 4;
    }
  }

  Value value = 12;
}

message AnnotationOverview {
  //标题，概要，详情，附件(list)，最近修改人，最近修改时间
  string title = 1;
  string body = 2;
  repeated Attachment attachment = 3;
  string user = 4;
  google.protobuf.Timestamp updated_at = 5;
}

## 4. API 端点定义

### 4.1 用户认证
#### 4.1.1 密码登录
- **URL**: `/v1/syntrust/auth/login`
- **Method**: POST
- **Request**:
```protobuf
message LoginRequest {
  string email = 1;
  string password = 2;
}
```
- **Response**:
```protobuf
message LoginResponse {
  string token = 1;
  User user = 2;
  Sidebar sidebar_list = 3;
  string user_signature = 4;
  string workspace = 5;
}
```

#### 4.1.2 手机验证码登录
##### 4.1.2.1 发送验证码
- **URL**: `/v1/syntrust/auth/sms/code`
- **Method**: POST
- **Request**:
```protobuf
message SendSmsCodeRequest {
  string phone = 1;
}
```

##### 4.1.2.2 验证码登录
- **URL**: `/v1/syntrust/auth/sms/login`
- **Method**: POST
- **Request**:
```protobuf
message SmsLoginRequest {
  string phone = 1;
  string code = 2;
}
```
- **Response**:
```protobuf
message SmsLoginResponse {
  string token = 1;
  User user = 2;
  Sidebar sidebar_list = 3;
  string user_signature = 4;
  string workspace = 5;
}
```

#### 4.1.3 SSO 登录
- **URL**: `/v1/syntrust/auth/sso/login`
- **Method**: POST
- **Request**:
```protobuf
message SsoLoginRequest {
  string sso_token = 1;
  string provider = 2;  // 例如: "google", "github"
}
```
- **Response**:
```protobuf
message SsoLoginResponse {
  string token = 1;
  User user = 2;
  Sidebar sidebar_list = 3;
  string user_signature = 4;
  string workspace = 5;
}
```

#### 4.1.4 用户注册
- **URL**: `/v1/syntrust/auth/register`
- **Method**: POST
- **Request**:
```protobuf
message RegisterRequest {
  string email = 1;
  string password = 2;
  string name = 3;
}
```
- **Response**:
  // 跳转到登陆页
```protobuf
message RegisterResponse {
  string message = 1;
  User user = 2;
}
```

#### 4.2 探索
##### 4.2.1 获取探索列表
- **URL**: `/v1/syntrust/explorations`
- **Method**: GET
- **Request**:
```protobuf
message ExplorationsPageRequest {
  string tab = 1; // community || workspace (tbd personal)
  string user_id = 2;
  PaginationRequest pagination = 3;
}
```
- **Response**:
```protobuf
message GetExplorationsPageResponse {
  repeated ExplorationCard card = 1;
  PaginationResponse pagination = 2;
}
```

##### 4.2.2 获取探索详情
- **URL**: `/v1/syntrust/exploration/{exploration_id}`
- **Method**: GET
- **Request**:
```protobuf
message ExplorationTaskRequest {
  string user_id = 1;
}
```
- **Response**:
```protobuf
message GetExplorationTaskResponse {
  string prompt = 1;
  string created_by = 2;
  string created_from = 3;
  repeated Step step = 4;
  Scenario scenario = 5;
  Score score = 6;
  // tbd 推广位
}
```

#### 4.3 任务
##### 4.3.1 获取任务列表
- **URL**: `/v1/syntrust/tasks`
- **Method**: GET
- **Request**:
```protobuf
message TasksPageRequest {
  string tab = 1; // community || workspace  || personal
  string user_id = 2;
  PaginationRequest pagination = 3;
}
```

- **Response**:
```protobuf
message GetTasksPageResponse {
  repeated TaskCard card = 1;
  PaginationResponse pagination = 2;
}
```

##### 4.3.2 获取任务详情
// 这里的拆分，是为了页面渲染的时候，可以不用等待暂时不需要的数据请求
##### 4.3.2.1 获取任务详情概览
- **URL**: `/v1/syntrust/task/{task_id}/overview`
- **Method**: GET
- **Request**:
```protobuf
message TaskRequest {
  string user_id = 1;
}
```
- **Response**:
```protobuf
message GetTaskResponse {
  // prompt 和 response_summary 已经在 TaskCard 里传输过了。
  string id = 1;
  string title = 2;
  string description = 3;
  string status = 4;
  int32 priority = 5;
  google.protobuf.Timestamp due_date = 6;
  User assigned_to = 7;
  repeated string keyword = 8;
  repeated AnnotationOverview annotation = 9;
  int32 consumed_points = 10;
  // tbd 积分消耗说明
  string consumption_instructions = 11;
}
```

##### 4.3.2.2 获取任务详情答案
- **URL**: `/v1/syntrust/task/{task_id}/qa`
- **Method**: GET
- **Request**:
```protobuf
message TaskQnaRequest {
  string user_id = 1;
}
```
- **Response**:
```protobuf
message GetTaskQnaResponse {
  string response = 1;
  repeated Annotation annotation = 2;
}
```

##### 4.3.2.3 获取任务详情场景
- **URL**: `/v1/syntrust/task/{task_id}/scenario`
- **Method**: GET
- **Request**:
```protobuf
message TaskScenarioRequest {
  string user_id = 1;
}
```
- **Response**:
```protobuf
message GetTaskScenarioResponse {
  string response = 1;
  Scenario scenario = 2;
  repeated Annotation annotation = 3;
}
```

##### 4.3.2.4 获取任务详情模板
- **URL**: `/v1/syntrust/task/{task_id}/flow`
- **Method**: GET
- **Request**:
```protobuf
message TaskFlowRequest {
  string user_id = 1;
}
```
- **Response**:
```protobuf
message GetTaskFlowResponse {
  FlowConfig flow_config = 1;
  repeated Annotation annotation = 2;
}
```

### 4.4 资产
#### 4.4.1 获取资产详情
- **URL**: `/v1/syntrust/assets/{asset_id}`
- **Method**: GET
- **Request**:
```protobuf
message AssetsRequest {
  string tab = 1; // 必填: community || workspace || personal
  
}
```
- **Response**:
```protobuf
message GetAssetsResponse {
  Asset asset = 1;
}
```

### 4.5 工作空间

#### 4.5.1 保存新建 task 信息
- **URL**: `/v1/syntrust/users/{user_id}/tasks`
- **Method**: POST
- **Request**:
```protobuf
message SaveTaskRequest {

  TaskData task = 1;
  // qa, flow_config, scenario, 都有各自的annotation list,这里是否还需要annotation
  repeated Annotation annotation = 2; 
  string completed = 3; // yes || no 标记是否完成，还是草稿。
  // tbd 权限分配 （待定）
}
```
- **Response**:
```protobuf
message SaveTaskResponse {
  string prompt = 1;
  string created_by = 2;
  string created_from = 3;
  string task_id = 4;
  string status = 5;
  repeated Step step = 6;
  int32 score = 7;
  float confidence = 8;
  Scenario scenario = 9;
}
```

#### 4.5.2 更新 task 信息
- **URL**: `/v1/syntrust/users/{user_id}/tasks/{task_id}`
- **Method**: PUT
- **Request**:
```protobuf
message UpdateTaskRequest {
  string title = 1;
  string description = 2;
  string status = 3;
  int32 priority = 4;
  google.protobuf.Timestamp due_date = 5;
  User assigned_to = 6;
}
```
- **Response**:
```protobuf
message UpdateTaskResponse {
  Task task = 1;
}
```

#### 4.5.3 删除 task
- **URL**: `/v1/syntrust/users/{user_id}/tasks/{task_id}`
- **Method**: DELETE
- **Response**:
```protobuf
message DeleteTaskResponse {
  string message = 1;
}
```

### 4.6 文件上传

#### 4.6.1 上传文件
- **URL**: `/v1/syntrust/attachments`
- **Method**: POST
- **Request**:
```protobuf
message UploadFileRequest {
  bytes content = 1;        // 文件内容
  string filename = 2;      // 文件名
  string content_type = 3;  // 文件类型
  string user_id = 4;  // 用户ID
}
```
- **Response**:
```protobuf
// 文件上传响应
message UploadFileResponse {
  string file_id = 1;      // 文件ID
  string status = 2;       // 状态
  string url = 3;          // 文件访问URL
}
```

### 4.7 机器人对话

#### 4.7.1 发送消息
- **URL**: `/v1/rbt/chats/{chat_id}/messages`
- **Method**: POST
- **Request**:
```protobuf
message SendMessageRequest {
  string content = 1;
  string type = 2;
  int32 priority = 3;
  map<string, string> metadata = 4;
}

message SendMessageResponse {
  Message message = 1;
}
```

### 4.8 条件搜索

#### 4.8.1 复合过滤条件

复合过滤条件使用 and 处理多条件组合，其核心结构如下：

##### 4.8.1.1 比较运算符
```protobuf
enum CompareOp {
  COMPARE_OP_UNSPECIFIED = 0;
  EQ = 1;
  NEQ = 2;
  GT = 3;
  GTE = 4;
  LT = 5;
  LTE = 6;
  IN = 7;
  NOT_IN = 8;
  LIKE = 9;    // 字符串模糊
  RANGE = 10;  // 数值区间
}
```

##### 4.8.1.2 单一条件表达式
```protobuf
message FilterExpr {
  string field = 1;           // 字段名，如 confidence, scenario, task, keyword, creator
  CompareOp op = 2;           // 操作符
  repeated string values = 3; // 支持多选或区间，如 ["0.8", "1.0"] 表示区间
}
```

##### 4.8.1.3 过滤条件列表结构

实际业务中仅使用 AND 连接所有条件

```protobuf
message FilterList {
  repeated FilterExpr exprs = 1; // 所有条件均以 AND 关系组合
}
```

#### 4.8.2 排序表达式
```protobuf
message SortExpr {
  string field = 1;   // 排序字段（如 confidence, name, created_at, like_count）
  bool desc = 2;      // 是否倒序
}
```

#### 4.8.3 分页参数
与 [2.6 分页参数](#26-分页参数) 一致，点击查看

#### 4.8.4 探索列表搜索接口
```protobuf
message ExplorationSearchRequest {
  string tab = 1; // 必填: community | workspace | personal
  FilterList filter = 2;
  SortExpr sort = 3;
  PaginationRequest pagination = 4;
}
message ExplorationSearchResponse {
  repeated ExplorationCard card = 1;
  PaginationResponse pagination = 2;
  FilterList filter_echo = 3; // 回显
  SortExpr sort_echo = 4;
}
```

#### 4.8.5 任务列表搜索接口
```protobuf
message TaskSearchRequest {
  string tab = 1;
  FilterList filter = 2;
  SortExpr sort = 3;
  PaginationRequest pagination = 4;
}
message TaskSearchResponse {
  repeated TaskCard card = 1;
  PaginationResponse pagination = 2;
  FilterList filter_echo = 3;
  SortExpr sort_echo = 4;
}
```

#### 4.8.6 资产列表搜索接口
```protobuf
message AssetSearchRequest {
  string tab = 1;
  FilterList filter = 2;
  SortExpr sort = 3;
  PaginationRequest pagination = 4;
}
message AssetSearchResponse {
  repeated Asset card = 1;
  PaginationResponse pagination = 2;
  FilterList filter_echo = 3;
  SortExpr sort_echo = 4;
}
```

// 典型接口：
// POST /v1/syntrust/explorations/search
// POST /v1/syntrust/tasks/search
// POST /v1/syntrust/assets/search

// 设计说明：
// - 支持与处理多条件组合。
// - 排序字段单选，默认按时间倒序。
// - tab字段必填，限定搜索范围。
// - 响应包含总数、分页、回显过滤与排序条件。
// - 统一结构便于后端高效实现与维护。

---

## 附录：条件搜索常用示例

以下为基于 4.8 条件搜索 API 设计的典型请求示例，便于开发和测试参考：

### 示例1：按可信度区间、场景多选、作者模糊、时间倒序分页
- **API**: `POST /v1/syntrust/explorations/search`
- **Request**
```protobuf
ExplorationSearchRequest {
  tab: "community",
  filter: [
    exprs: [
      { field: "confidence", op: RANGE, values: ["0.8", "1.0"] }
    ],
    exprs: [
      { field: "scenario", op: IN, values: ["foo", "bar"] }
    ]，
    exprs: [
      { field: "creator", op: LIKE, values: ["张"] }
    ]
     
  ]
  sort: { field: "created_at", desc: true },
  pagination: { page: 2, per_page: 20 }
}
```
- **Response**
```protobuf
ExplorationSearchResponse {
  card: [
    ExplorationCard {
      id: "exp123",
      prompt: "AI 智能助手探索",
      response_summary: "本探索介绍了AI助手的核心能力...",
      created_by: "张三",
      created_from: "web",
      created_at: { seconds: 1714377600 },
      step: [] 
    },
    ... // 其余19条
  ],
  pagination: { total: 100, page: 2, per_page: 20 },
  filter_echo: <同请求...>,
  sort_echo: { field: "created_at", desc: true }
}
```

### 示例2：只按关键词模糊搜索，按名称升序
- **API**: `POST /v1/syntrust/tasks/search`
- **Request**
```protobuf
TaskSearchRequest {
  tab: "personal",
  filter: [
    exprs: [
      { field: "keyword", op: LIKE, values: ["AI"] }
    ]
  ]
  sort: { field: "name", desc: false },
  pagination: { page: 1, per_page: 20 }
}
```
**Response**
```protobuf
TaskSearchResponse {
  card: [
    TaskCard {
      id: "task001",
      prompt: "AI 自动摘要任务",
      response_summary: "本任务要求对长文本进行自动摘要...",
      created_by: "李四",
      created_from: "web",
      created_at: { seconds: 1714377600 },
      step: [],
      status: "open"
    }
    // ... 其余19条
  ],
  pagination: { total: 35, page: 1, per_page: 20 },
  filter_echo: <同请求>,
  sort_echo: { field: "name", desc: false }
}
```

### 示例3：按模板多选、点赞数降序
- **API**: `POST /v1/syntrust/assets/search`
- **Request**
```protobuf
AssetSearchRequest {
  tab: "workspace",
  filter: {
    exprs: [
      { field: "task", op: IN, values: ["T1", "T2"] }
    ]
  },
  sort: { field: "like_count", desc: true },
  pagination: { page: 1, per_page: 10 }
}
```
**Response**
```protobuf
AssetSearchResponse {
  card: [
    Asset {
      id: "asset001",
      name: "模型模板T1资产",
      ...
    },
    // ... 其余9条
  ],
  pagination: { total: 18, page: 1, per_page: 10 },
  filter_echo: <同请求>,
  sort_echo: { field: "like_count", desc: true }
}
```

### 示例4：复杂嵌套过滤（可信度区间 且 (场景A 或 场景B) 且 作者张）
- **API**: `POST /v1/syntrust/tasks/search`
- **Request**
```protobuf
TaskSearchRequest {
  tab: "community",
  filter: [
    exprs: [
      { field: "confidence", op: RANGE, values: ["0.7", "0.95"] }
    ],
    exprs: [
      { field: "scenario", op: EQ, values: ["A"] },
      { field: "scenario", op: EQ, values: ["B"] }
    ],
    exprs: [
      { field: "creator", op: LIKE, values: ["张"] }
    ]
     
  ]
  sort: { field: "created_at", desc: true },
  pagination: { page: 1, per_page: 20 }
}
```
**Response**
```protobuf
TaskSearchResponse {
  card: [
    TaskCard {
      id: "task888",
      prompt: "场景A高可信度任务",
      response_summary: "该任务聚焦于A场景下的高可信度...",
      created_by: "张三",
      created_from: "web",
      created_at: { seconds: 1714377600 },
      step: [],
      status: "closed"
    }
    // ... 其余19条
  ],
  pagination: { total: 22, page: 1, per_page: 20 },
  filter_echo: <同请求>,
  sort_echo: { field: "created_at", desc: true }
}
```

---
