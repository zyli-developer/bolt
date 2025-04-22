/**
 * UserSig 生成工具
 * 
 * 使用腾讯云官方提供的tls-sig-api-v2库生成UserSig
 * 参考文档: https://cloud.tencent.com/document/product/269/32688
 */

const TLSSigAPIv2 = require('tls-sig-api-v2');
const logger = require('./logger');

/**
 * 生成UserSig签名
 * @param {number} sdkappid - 应用SDKAppID
 * @param {string} secretKey - 密钥
 * @param {string} userID - 用户ID
 * @param {number} expire - 签名过期时间，单位：秒，默认一天（86400秒）
 * @returns {string} - UserSig签名
 */
function genUserSig(sdkappid, secretKey, userID, expire = 86400) {
  try {
    logger.info(`Generating UserSig for user ${userID}`);
    
    // 获取TLSSigAPIv2.Api类
    const Api = TLSSigAPIv2.Api;
    
    // 创建Api实例
    const api = new Api(Number(sdkappid), secretKey);
    
    // 生成UserSig
    const userSig = api.genUserSig(userID, expire);
    
    logger.debug(`UserSig generated successfully for user ${userID}`);
    return userSig;
  } catch (error) {
    logger.error(`Failed to generate UserSig: ${error.message}`, { error });
    throw error;
  }
}

module.exports = {
  genUserSig
};
