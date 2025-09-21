const nextConfig = {
  images: {
    domains: ["images-na.ssl-images-amazon.com", "highclass.com", "m.media-amazon.com"], // agrega los que uses
  },
  async rewrites() {
    return [{ source: "/api/:path*", destination: "http://127.0.0.1:8080/api/:path*" }];
  },
};
export default nextConfig;
