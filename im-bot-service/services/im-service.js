/**
 * 腾讯云IM服务
 * 
 * 使用REST API直接调用腾讯云IM服务
 * 参考文档: https://cloud.tencent.com/document/product/269/1520
 */

const axios = require('axios');
const { IM } = require('../config');
const logger = require('../utils/logger');
const { genUserSig } = require('../utils/user-sig');

// 腾讯云IM服务域名
const IM_DOMAIN = 'https://console.tim.qq.com';

/**
 * 生成API请求的URL
 * @param {string} serviceCmd - 服务名/命令，例如"im_open_login_svc/account_import"
 * @returns {string} - 完整的API URL
 */
function buildApiUrl(serviceCmd) {
  const random = Math.floor(Math.random() * 4294967295);
  // 生成管理员的UserSig
  const adminUserSig = genUserSig(IM.AdminUserID);
  
  return `${IM_DOMAIN}/v4/${serviceCmd}?sdkappid=${IM.SDKAppID}&identifier=${IM.AdminUserID}&usersig=${adminUserSig}&random=${random}&contenttype=json`;
}

/**
 * 发送POST请求到腾讯云IM REST API
 * @param {string} serviceCmd - 服务名/命令
 * @param {Object} requestData - 请求数据
 * @returns {Promise<Object>} - 响应数据
 */
async function callImApi(serviceCmd, requestData = {}) {
  try {
    const url = buildApiUrl(serviceCmd);
    logger.info(`Calling IM API: ${serviceCmd}`);
    
    const response = await axios.post(url, requestData);
    
    if (response.data.ErrorCode !== 0) {
      throw new Error(`IM API error: ${response.data.ErrorInfo} (${response.data.ErrorCode})`);
    }
    
    return response.data;
  } catch (error) {
    // 捕获网络异常，记录日志并重新抛出
    if (error.response) {
      logger.error(`IM API error: ${error.response.status} - ${error.response.statusText}`, {
        data: error.response.data,
        url: serviceCmd
      });
    } else if (error.request) {
      logger.error(`IM API no response received`, { request: error.request });
    }
    
    logger.error(`Failed to call IM API ${serviceCmd}: ${error.message}`);
    throw error;
  }
}

/**
 * 创建机器人账号
 * 参考文档: https://cloud.tencent.com/document/product/269/89991
 * 
 * @param {string} userId - 机器人账号ID，以@RBT#开头
 * @param {string} nickname - 机器人昵称
 * @param {string} faceUrl - 头像URL(可选)
 * @returns {Promise<Object>} - 创建结果
 */
async function createBotAccount(userId, nickname, faceUrl = '') {
  try {
    logger.info(`创建机器人账号----Creating bot account: ${userId}`);
    
    const data = {
      UserID: userId,
      Nick: nickname
    };
    
    if (faceUrl) {
      data.FaceUrl = faceUrl;
    }
    
    const result = await callImApi('openim_robot_http_svc/create_robot', data);
    
    logger.info(`创建机器人账号----Bot account created successfully: ${userId}`);
    return result;
  } catch (error) {
    logger.error(`创建机器人账号----Failed to create bot account: ${error.message}`, { error });
    throw error;
  }
}

/**
 * 拉取所有机器人
 * 参考文档: https://cloud.tencent.com/document/product/269/89993
 * 
 * @param {string} userId - 机器人账号ID，以@RBT#开头
 * @param {string} nickname - 机器人昵称
 * @param {string} faceUrl - 头像URL(可选)
 * @returns {Promise<Object>} - 创建结果
 */
async function getAllBots() {
  try {
    logger.info(`拉取所有机器人----Getting all bots`);
    const result = await callImApi('openim_robot_http_svc/get_all_robots');
    
    logger.info(`拉取所有机器人----All bots retrieved successfully : ${result}`);
    return result;
  } catch (error) {
    logger.error(`拉取所有机器人----Failed to get all bots: ${error.message}`, { error });
    throw error;
  }
}

/**
 * 发送单聊文本消息
 * 参考文档: https://cloud.tencent.com/document/product/269/2282
 * 
 * @param {string} fromAccount - 发送方用户ID
 * @param {string} toAccount - 接收方用户ID
 * @param {string} text - 消息文本内容
 * @returns {Promise<Object>} - 发送结果
 */
async function sendC2CTextMessage(fromAccount, toAccount, text) {
  try {
    logger.info(`Sending C2C message from ${fromAccount} to ${toAccount}`);
    
    // 构建请求体
    const requestBody = {
      SyncOtherMachine: 2, // 同步到发送方的其他设备
      From_Account: fromAccount,
      To_Account: toAccount,
      MsgLifeTime: 604800, // 消息保存7天
      MsgRandom: Math.floor(Math.random() * 4294967295),
      MsgBody: [
        {
          MsgType: 'TIMTextElem',
          MsgContent: {
            Text: text
          }
        }
      ]
    };
    
    // 调用API
    const result = await callImApi('openim/sendmsg', requestBody);
    
    logger.info('Message sent successfully', { 
      MessageSeq: result.MsgSeq,
      MessageTime: result.MsgTime
    });
    
    return result;
  } catch (error) {
    logger.error(`Failed to send C2C message: ${error.message}`, { error });
    throw error;
  }
}

/**
 * 发送群组文本消息
 * 参考文档: https://cloud.tencent.com/document/product/269/1629
 * 
 * @param {string} fromAccount - 发送方用户ID
 * @param {string} groupId - 群组ID
 * @param {string} text - 消息文本内容
 * @returns {Promise<Object>} - 发送结果
 */
async function sendGroupTextMessage(fromAccount, groupId, text) {
  try {
    logger.info(`Sending group message from ${fromAccount} to group ${groupId}`);
    
    // 构建请求体
    const requestBody = {
      GroupId: groupId,
      From_Account: fromAccount,
      Random: Math.floor(Math.random() * 4294967295),
      MsgBody: [
        {
          MsgType: 'TIMTextElem',
          MsgContent: {
            Text: text
          }
        }
      ]
    };
    
    // 调用API
    const result = await callImApi('group_open_http_svc/send_group_msg', requestBody);
    
    logger.info('Group message sent successfully', {
      MsgTime: result.MsgTime
    });
    
    return result;
  } catch (error) {
    logger.error(`Failed to send group message: ${error.message}`, { error });
    throw error;
  }
}

/**
 * 获取用户资料
 * 参考文档: https://cloud.tencent.com/document/product/269/1639
 * 
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} - 用户资料
 */
async function getUserProfile(userId) {
  try {
    logger.info(`获取用户资料----Getting user profile: ${userId}`);
    
    const requestBody = {
      To_Account: [userId],
      TagList: ["Tag_Profile_IM_Nick", "Tag_Profile_IM_Image"]
    };
    
    return await callImApi('profile/portrait_get', requestBody);
  } catch (error) {
    logger.error(`获取用户资料----Failed to get user profile: ${error.message}`, { error });
    throw error;
  }
}

/**
 * 检查账号是否存在
 * 参考文档: https://cloud.tencent.com/document/product/269/38417
 * 
 * @param {Array<string>} userIds - 用户ID数组
 * @returns {Promise<Object>} - 账号检查结果
 */
async function checkAccountExists(userIds) {
  try {
    logger.info(`Checking accounts: ${userIds.join(', ')}`);
    
    const requestBody = {
      CheckItem: userIds.map(userId => ({ UserID: userId }))
    };
    
    return await callImApi('im_open_login_svc/account_check', requestBody);
  } catch (error) {
    logger.error(`Failed to check accounts: ${error.message}`, { error });
    throw error;
  }
}

/**
 * 获取腾讯云IM服务器IP地址列表
 * 参考文档: https://cloud.tencent.com/document/product/269/45438
 *
 * @param {number} nettype - 服务器IP类型，4:web SDK中国区，5:IM回调中国区
 * @returns {Promise<Array<string>>} - 服务器IP列表
 */
async function getImServerIpList(nettype = 4) {
  try {
    logger.info(`获取IM服务器IP列表，nettype=${nettype}`);
    // 直接拼接URL，接口为ConfigSvc/GetIPList
    const random = Math.floor(Math.random() * 4294967295);
    const { SDKAppID, AdminUserID } = IM;
    const adminUserSig = genUserSig(AdminUserID);
    const url = `${IM_DOMAIN}/v4/ConfigSvc/GetIPList?sdkappid=${SDKAppID}&identifier=${AdminUserID}&usersig=${adminUserSig}&random=${random}&contenttype=json&nettype=${nettype}`;
    const response = await axios.post(url, {});
    if (response.data.ErrorCode !== 0) {
      throw new Error(`IM GetIPList error: ${response.data.ErrorInfo} (${response.data.ErrorCode})`);
    }
    return response.data.IPList || [];
  } catch (error) {
    logger.error(`获取IM服务器IP列表失败: ${error.message}`, { error });
    throw error;
  }
}

module.exports = {
  createBotAccount,
  sendC2CTextMessage,
  sendGroupTextMessage,
  getUserProfile,
  checkAccountExists,
  callImApi,
  getAllBots,
  getImServerIpList
};
