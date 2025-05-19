#!/usr/bin/env node

/**
 * 自动创建和配置Cloudflare KV命名空间
 * 此脚本会:
 * 1. 检查是否存在指定的KV命名空间
 * 2. 如果不存在，则创建新的KV命名空间
 * 3. 更新wrangler.toml配置文件
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件目录
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// KV命名空间名称
const KV_NAMESPACE_NAME = 'ASSETS';
const WRANGLER_CONFIG_PATH = path.join(rootDir, 'wrangler.toml');

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
 * 获取所有KV命名空间
 */
function listKVNamespaces() {
  const output = runWranglerCommand('kv:namespace list');
  if (!output) return [];
  
  try {
    // 解析输出以获取KV命名空间列表
    const lines = output.split('\n').filter(line => line.trim().length > 0);
    const namespaceList = [];
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('title') && lines[i].includes('id')) {
        // 找到表头后开始解析
        for (let j = i + 1; j < lines.length; j++) {
          const line = lines[j].trim();
          if (line.startsWith('│')) {
            const parts = line.split('│').map(p => p.trim()).filter(p => p);
            if (parts.length >= 2) {
              namespaceList.push({
                title: parts[0],
                id: parts[1]
              });
            }
          }
        }
        break;
      }
    }
    
    return namespaceList;
  } catch (error) {
    console.error('解析KV命名空间列表失败:', error);
    return [];
  }
}

/**
 * 创建KV命名空间
 */
function createKVNamespace(name) {
  console.log(`正在创建KV命名空间 "${name}"...`);
  const output = runWranglerCommand(`kv:namespace create "${name}"`);
  
  if (!output) {
    throw new Error(`创建KV命名空间 "${name}" 失败`);
  }
  
  try {
    // 解析输出以获取KV命名空间ID
    const match = output.match(/id:\s+"([^"]+)"/);
    if (match && match[1]) {
      return match[1];
    }
    throw new Error('无法从输出中获取KV命名空间ID');
  } catch (error) {
    console.error('解析创建KV命名空间输出失败:', error);
    throw error;
  }
}

/**
 * 更新wrangler.toml配置
 */
function updateWranglerConfig(kvId) {
  try {
    let content = fs.readFileSync(WRANGLER_CONFIG_PATH, 'utf8');
    
    // 非常简单直接地更新KV ID
    if (content.includes(`binding = "${KV_NAMESPACE_NAME}"`)) {
      // 用新ID替换旧ID或空ID
      content = content.replace(
        /binding\s*=\s*"ASSETS"\s*\nid\s*=\s*"[^"]*"/g,
        `binding = "ASSETS"\nid = "${kvId}"`
      );
    } else {
      console.error('错误: wrangler.toml中未找到ASSETS绑定配置');
      throw new Error('配置文件格式不正确');
    }
    
    fs.writeFileSync(WRANGLER_CONFIG_PATH, content);
    console.log(`已更新wrangler.toml配置文件，KV命名空间ID: ${kvId}`);
  } catch (error) {
    console.error('更新wrangler.toml配置文件失败:', error);
    throw error;
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('正在检查KV命名空间...');
  
  try {
    // 获取现有的KV命名空间
    const namespaces = listKVNamespaces();
    const existingNamespace = namespaces.find(ns => ns.title === KV_NAMESPACE_NAME);
    
    let namespaceId;
    
    if (existingNamespace) {
      console.log(`已找到KV命名空间 "${KV_NAMESPACE_NAME}", ID: ${existingNamespace.id}`);
      namespaceId = existingNamespace.id;
    } else {
      // 创建新的KV命名空间
      namespaceId = createKVNamespace(KV_NAMESPACE_NAME);
      console.log(`已创建KV命名空间 "${KV_NAMESPACE_NAME}", ID: ${namespaceId}`);
    }
    
    // 更新wrangler.toml配置
    updateWranglerConfig(namespaceId);
    console.log('KV命名空间配置完成');
  } catch (error) {
    console.error('设置KV命名空间时出错:', error);
    process.exit(1);
  }
}

main(); 