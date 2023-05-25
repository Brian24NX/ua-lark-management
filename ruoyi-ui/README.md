## 开发

```bash
# 克隆项目
git clone https://codeup.aliyun.com/619476b8f1ae9b61971ddae1/carrier/carrier-hvac/carrier-hvac-manager.git

# 进入项目目录
cd carrier-hvac-manager

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npmmirror.com

# 启动服务
npm run dev
```

浏览器访问 http://localhost:80

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

2.   活动列表- 名单管理人- 接口暂无
3.   活动列表- 名单管理-导入 报错


 