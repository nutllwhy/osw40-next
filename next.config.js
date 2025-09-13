/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // GitHub Pages 部署配置
  basePath: process.env.NODE_ENV === 'production' ? '/osw40-next' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/osw40-next/' : '',
};

module.exports = nextConfig;
