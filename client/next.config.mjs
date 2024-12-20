/** @type {import('next').NextConfig} */
import envsConfig from './envs.js';

const envs = envsConfig[process.env.MODE];
if (envs) {
  console.log(`process.env.MODE: ${process.env.MODE}`);
  Object.keys(envs).forEach((key) => {
    process.env[key] = envs[key];
  });
  console.log(`Website Url: ${process.env.NEXT_PUBLIC_FE_URL}`);
}

const nextConfig = {
  // images: {
  //   domains: ['https://aceternity.com'],
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { webpack }) => {
    // Enable WebAssembly experiments
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };
    return config;
  },
};

export default nextConfig;
