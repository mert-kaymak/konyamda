import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // X-Powered-By header'ı kaldır (güvenlik)
  poweredByHeader: false,

  // Üretimde kaynak haritaları gizle
  productionBrowserSourceMaps: false,
};

export default nextConfig;
