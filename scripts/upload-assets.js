#!/usr/bin/env node

/**
 * 将静态资产上传到Cloudflare KV
 * 此脚本在部署前自动运行，将构建的静态资产上传到KV命名空间
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import toml from '@iarna/toml';

// 获取当前文件目录
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const wranglerConfigPath = path.join(rootDir, 'wrangler.toml');

/**
 * 运行wrangler命令
 */
function runWranglerCommand(command) {
  try {
    return execSync(`npx wrangler ${command}`, { encoding: 'utf8' });
  } catch (error) {
    console.error(`执行命令失败: npx wrangler ${command}`);
    console.error(error.message);
    return null;
  }
}

/**
 * 读取wrangler.toml配置
 */
function readWranglerConfig() {
  try {
    const content = fs.readFileSync(wranglerConfigPath, 'utf8');
    return toml.parse(content);
  } catch (error) {
    console.error('读取wrangler.toml配置失败:', error);
    return null;
  }
}

/**
 * 上传静态资产到KV
 */
function uploadAssets(namespaceId) {
  console.log('正在上传静态资产到KV命名空间...');
  
  // 确保dist目录存在
  if (!fs.existsSync(distDir)) {
    console.error(`错误: 目录 "${distDir}" 不存在，请先运行构建命令`);
    process.exit(1);
  }
  
  // 使用wrangler上传资产
  const result = runWranglerCommand(`kv:bulk put --binding=ASSETS --namespace-id=${namespaceId} ${distDir}`);
  
  if (result) {
    console.log('静态资产上传成功');
    return true;
  } else {
    console.error('静态资产上传失败');
    return false;
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    // 读取wrangler.toml配置
    const config = readWranglerConfig();
    
    if (!config || !config.kv_namespaces) {
      console.error('错误: 未找到KV命名空间配置，请先运行setup-kv.js脚本');
      process.exit(1);
    }
    
    // 查找ASSETS命名空间ID
    const assetsNamespace = config.kv_namespaces.find(ns => ns.binding === 'ASSETS');
    
    if (!assetsNamespace) {
      console.error('错误: 未找到ASSETS KV命名空间配置，请先运行setup-kv.js脚本');
      process.exit(1);
    }
    
    // 上传静态资产
    const success = uploadAssets(assetsNamespace.id);
    
    if (success) {
      console.log('资产上传完成，准备部署');
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (error) {
    console.error('上传资产时出错:', error);
    process.exit(1);
  }
}

main(); 