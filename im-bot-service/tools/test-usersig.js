/**
 * 简单的UserSig生成测试
 */

const TLSSigAPIv2 = require('tls-sig-api-v2');

// 配置信息 - 请确保这些值与您的腾讯云IM应用匹配
const config = {
  SDKAppID: 1600079965,
  SecretKey: '38f373a4ab4408c0df28332c6cd8dc73f5fa0a39ec6c2f96ef39e5a5fbada079',
  AdminUserID: 'administrator'
};

try {
  console.log('测试UserSig生成...');
  
  // 确认SDKAppID类型
  const sdkappid = Number(config.SDKAppID);
  console.log(`SDKAppID (转换后): ${sdkappid}, 类型: ${typeof sdkappid}`);
  
  // 使用正确的API类
  const Api = TLSSigAPIv2.Api;
  console.log('成功获取TLSSigAPIv2.Api类');
  
  // 创建API实例
  const api = new Api(sdkappid, config.SecretKey);
  console.log('成功创建Api实例');
  
  // 生成UserSig
  const expire = 86400;
  const userSig = api.genUserSig(config.AdminUserID, expire);
  
  console.log('==== UserSig生成成功 ====');
  console.log(`UserID: ${config.AdminUserID}`);
  console.log(`有效期: ${expire}秒`);
  console.log(`UserSig: ${userSig}`);
  console.log(`UserSig长度: ${userSig.length}字符`);
} catch (error) {
  console.error('==== UserSig生成失败 ====');
  console.error(`错误信息: ${error.message}`);
  console.error('完整错误:');
  console.error(error);
}
