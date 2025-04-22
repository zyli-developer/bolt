/**
 * 腾讯云IM连接测试工具
 * 
 * 用于测试UserSig生成和腾讯云IM API连接是否正常
 * 运行方式: node test-im-connection.js
 */

const { IM } = require('../config');
const { genUserSig } = require('../utils/user-sig');
const imService = require('../services/im-service');

// 控制台颜色
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * 测试UserSig生成
 */
async function testUserSigGeneration() {
  console.log(`${colors.cyan}[测试] 正在测试UserSig生成...${colors.reset}`);
  try {
    const userSig = genUserSig(IM.SDKAppID, IM.SecretKey, IM.AdminUserID, 86400);
    console.log(`${colors.green}[成功] UserSig生成成功:${colors.reset}`);
    console.log(`${colors.yellow}${userSig}${colors.reset}`);
    console.log(`${colors.blue}UserSig长度: ${userSig.length}字符${colors.reset}`);
    console.log(''); // 空行
    return userSig;
  } catch (error) {
    console.error(`${colors.red}[错误] UserSig生成失败: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

/**
 * 测试账号检查API
 */
async function testAccountCheck() {
  console.log(`${colors.cyan}[测试] 正在测试账号检查API...${colors.reset}`);
  try {
    // 检查管理员账号是否存在
    const result = await imService.checkAccountExists([IM.AdminUserID]);
    console.log(`${colors.green}[成功] 账号检查API调用成功:${colors.reset}`);
    console.log(JSON.stringify(result, null, 2));
    console.log(''); // 空行
  } catch (error) {
    console.error(`${colors.red}[错误] 账号检查API调用失败:${colors.reset}`);
    console.error(`${colors.red}错误信息: ${error.message}${colors.reset}`);
    
    // 提供可能的解决方案
    console.log('');
    console.log(`${colors.yellow}可能的问题和解决方案:${colors.reset}`);
    console.log(`${colors.yellow}1. SDKAppID不正确 - 请确认在config.js中设置了正确的SDKAppID${colors.reset}`);
    console.log(`${colors.yellow}2. SecretKey不正确 - 请确认在config.js中设置了正确的密钥${colors.reset}`);
    console.log(`${colors.yellow}3. 网络问题 - 请确认服务器可以访问腾讯云API${colors.reset}`);
    console.log('');
  }
}

/**
 * 测试管理员资料获取
 */
async function testGetAdminProfile() {
  console.log(`${colors.cyan}[测试] 正在测试获取管理员资料...${colors.reset}`);
  try {
    const result = await imService.getUserProfile(IM.AdminUserID);
    console.log(`${colors.green}[成功] 获取管理员资料成功:${colors.reset}`);
    console.log(JSON.stringify(result, null, 2));
    console.log(''); // 空行
  } catch (error) {
    console.error(`${colors.red}[错误] 获取管理员资料失败:${colors.reset}`);
    console.error(`${colors.red}错误信息: ${error.message}${colors.reset}`);
    console.log('');
  }
}

/**
 * 运行所有测试
 */
async function runTests() {
  console.log(`${colors.magenta}============= 腾讯云IM连接测试 =============${colors.reset}`);
  console.log(`${colors.blue}配置信息:${colors.reset}`);
  console.log(`SDKAppID: ${IM.SDKAppID}`);
  console.log(`AdminUserID: ${IM.AdminUserID}`);
  console.log(`SecretKey: ${IM.SecretKey.substring(0, 8)}...${IM.SecretKey.substring(IM.SecretKey.length - 8)}`);
  console.log(''); // 空行

  // 测试UserSig生成
  await testUserSigGeneration();
  
  // 测试账号检查API
  await testAccountCheck();
  
  // 测试获取管理员资料
  await testGetAdminProfile();
  
  console.log(`${colors.magenta}============= 测试完成 =============${colors.reset}`);
}

// 运行测试
runTests().catch(error => {
  console.error(`${colors.red}[错误] 测试过程中发生未捕获的异常:${colors.reset}`);
  console.error(error);
});
