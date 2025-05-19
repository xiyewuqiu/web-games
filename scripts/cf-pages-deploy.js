#!/usr/bin/env node

/**
 * Cloudflare Pages 部署脚本
 * 专为 Cloudflare Pages 环境设计的部署脚本
 * 自动执行以下步骤:
 * 1. 设置 KV 命名空间
 * 2. 部署应用
 */

import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// 获取当前目录
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const WRANGLER_CONFIG_PATH = resolve(rootDir, 'wrangler.toml');

/**
 * 运行命令
 */
function runCommand(command, errorMessage) {
  try {
    console.log(`执行命令: ${command}`);
    const output = execSync(command, { 
      encoding: 'utf8',
      cwd: rootDir,
      stdio: 'inherit'  // 所有输出直接传递到控制台
    });
    return output;
  } catch (error) {
    console.error(`${errorMessage}: ${error.message}`);
    process.exit(1);
  }
}

/**
 * 检查 wrangler.toml 配置
 */
function checkWranglerConfig() {
  try {
    const config = fs.readFileSync(WRANGLER_CONFIG_PATH, 'utf8');
    
    console.log('\n当前 wrangler.toml 配置:');
    console.log('------------------------');
    console.log(config);
    console.log('------------------------');
    
    // 检查 KV ID 是否已设置
    const match = config.match(/binding\s*=\s*"ASSETS"\s*\nid\s*=\s*"([^"]*)"/);
    if (match) {
      const id = match[1];
      if (id) {
        console.log(`KV 命名空间 ID 已设置: ${id}`);
        return true;
      } else {
        console.log('警告: KV 命名空间 ID 为空');
        return false;
      }
    } else {
      console.log('警告: 未找到 KV 命名空间配置');
      return false;
    }
  } catch (error) {
    console.error('读取配置失败:', error);
    return false;
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('==== 开始 Cloudflare Pages 部署 ====');
    
    // 检查当前配置
    const isConfigValid = checkWranglerConfig();
    
    // 如果 KV ID 未设置，运行 setup-kv.js
    if (!isConfigValid) {
      console.log('\n==== 设置 KV 命名空间 ====');
      runCommand('node scripts/setup-kv.js', 'KV 命名空间设置失败');
      
      // 再次检查配置
      checkWranglerConfig();
    }
    
    // 部署应用
    console.log('\n==== 部署应用 ====');
    runCommand('npx wrangler deploy', '应用部署失败');
    
    console.log('\n==== 部署完成 ====');
  } catch (error) {
    console.error('部署失败:', error);
    process.exit(1);
  }
}

main(); 