#!/bin/bash

# Cloudflare Pages 部署脚本
# 此脚本专为 Cloudflare Pages 环境设计
# KV 命名空间 ID 已在 wrangler.toml 中配置

echo "===== 开始 Cloudflare Pages 部署 ====="

# KV 命名空间已配置，直接部署
echo "正在部署应用..."
npx wrangler deploy

# 如果部署失败，退出
if [ $? -ne 0 ]; then
  echo "部署失败"
  exit 1
fi

echo "===== 部署完成 =====" 