#!/usr/bin/env node

/**
 * 预部署脚本
 * 将所有部署前准备工作整合到一个脚本中，包括：
 * 1. 设置KV命名空间
 * 2. 构建应用
 * 3. 上传静态资产
 */

import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// 获取当前目录
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

/**
 * 运行命令
 */
function runCommand(command, errorMessage) {
  try {
    console.log(`执行命令: ${command}`);
    const output = execSync(command, { 
      encoding: 'utf8',
      cwd: rootDir,
      stdio: ['inherit', 'pipe', 'inherit']  // 标准输入和错误直接传递，但捕获标准输出
    });
    return output;
  } catch (error) {
    console.error(`${errorMessage}: ${error.message}`);
    process.exit(1);
  }
}

/**
 * 读取wrangler.toml配置
 */
function checkWranglerConfig() {
  try {
    const fs = require('fs');
    const path = require('path');
    const configPath = path.join(rootDir, 'wrangler.toml');
    const config = fs.readFileSync(configPath, 'utf8');
    
    console.log('\n当前wrangler.toml配置:');
    console.log('------------------------');
    console.log(config);
    console.log('------------------------');
    
    // 检查KV ID是否已设置
    const match = config.match(/binding\s*=\s*"ASSETS"\s*\nid\s*=\s*"([^"]*)"/);
    if (match) {
      const id = match[1];
      if (id) {
        console.log(`KV命名空间ID已设置: ${id}`);
      } else {
        console.log('警告: KV命名空间ID为空');
      }
    } else {
      console.log('警告: 未找到KV命名空间配置');
    }
  } catch (error) {
    console.error('读取配置失败:', error);
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('==== 开始部署前准备 ====');
    
    // 检查当前配置
    checkWranglerConfig();
    
    // 步骤1: 设置KV命名空间
    console.log('\n==== 步骤1: 设置KV命名空间 ====');
    runCommand('node scripts/setup-kv.js', 'KV命名空间设置失败');
    
    // 再次检查配置
    checkWranglerConfig();
    
    // 步骤2: 构建应用
    console.log('\n==== 步骤2: 构建应用 ====');
    runCommand('npm run build', '应用构建失败');
    
    // 步骤3: 上传静态资产
    console.log('\n==== 步骤3: 上传静态资产 ====');
    runCommand('node scripts/upload-assets.js', '静态资产上传失败');
    
    console.log('\n==== 部署前准备完成 ====');
    console.log('准备执行部署命令: wrangler deploy');
  } catch (error) {
    console.error('部署前准备失败:', error);
    process.exit(1);
  }
}

main(); 