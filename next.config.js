/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 启用静态导出
  images: {
    unoptimized: true,  // 静态导出时需要禁用图片优化
  },
  // 如果你的网站不是部署在根路径，需要设置 basePath
  // basePath: '/your-base-path',
}

module.exports = nextConfig 