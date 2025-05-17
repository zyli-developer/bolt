/**
 * UserSig 生成工具
 * 
 * 使用腾讯云官方提供的TLSSigAPIv2工具生成UserSig
 * 参考文档: https://cloud.tencent.com/document/product/269/32688
 */

const { Api } = require('./TLSSigAPIv2');
const { IM } = require('../config');
const logger = require('./logger');

/**
 * 生成UserSig签名
 * @param {string} userID - 用户ID
 * @param {number} expire - 签名过期时间，单位：秒，默认30天（2592000秒）
 * @returns {string} - UserSig签名
 */
function genUserSig(userID, expire = 2592000) {
  try {
    logger.info(`生成UserSig签名----Generating UserSig for user ${userID}`);
    
    // 创建Api实例
    const api = new Api(Number(IM.SDKAppID), IM.SecretKey);
    
    // 生成UserSig
    const userSig = api.genUserSig(userID, expire);
    
    logger.debug(`生成UserSig签名----UserSig generated successfully for user ${userID}`);
    return userSig;
  } catch (error) {
    logger.error(`生成UserSig签名----Failed to generate UserSig: ${error.message}`, { error });
    throw error;
  }
}

/**
 * 生成带群组ID的PrivateMapKey
 * @param {string} userID - 用户ID
 * @param {string} groupId - 群组ID
 * @param {number} expire - 签名过期时间，单位：秒，默认30天
 * @returns {string} - PrivateMapKey签名
 */
function genPrivateMapKey(userID, groupId, expire = 2592000) {
  try {
    logger.info(`生成PrivateMapKey----Generating PrivateMapKey for user ${userID} in group ${groupId}`);
    
    // 创建Api实例
    const api = new Api(Number(IM.SDKAppID), IM.SecretKey);
    
    // 权限位，255表示全部权限
    const privilegeMap = 255;
    
    // 生成带字符串房间号的PrivateMapKey
    const privateMapKey = api.genPrivateMapKeyWithStringRoomID(userID, expire, groupId, privilegeMap);
    
    logger.debug(`生成PrivateMapKey----PrivateMapKey generated successfully`);
    return privateMapKey;
  } catch (error) {
    logger.error(`生成PrivateMapKey----Failed to generate PrivateMapKey: ${error.message}`, { error });
    throw error;
  }
}

module.exports = {
  genUserSig,
  genPrivateMapKey
};
