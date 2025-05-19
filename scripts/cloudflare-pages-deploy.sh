#!/bin/bash

# Cloudflare Pages 部署脚本
# 此脚本专为 Cloudflare Pages 环境设计
# 确保在部署前设置 KV 命名空间

echo "===== 开始 Cloudflare Pages 部署 ====="

# 设置 KV 命名空间
echo "正在设置 KV 命名空间..."
node scripts/setup-kv.js

# 如果设置 KV 命名空间失败，退出
if [ $? -ne 0 ]; then
  echo "设置 KV 命名空间失败，退出部署"
  exit 1
fi

# 部署应用
echo "正在部署应用..."
npx wrangler deploy

# 如果部署失败，退出
if [ $? -ne 0 ]; then
  echo "部署失败"
  exit 1
fi

echo "===== 部署完成 =====" 