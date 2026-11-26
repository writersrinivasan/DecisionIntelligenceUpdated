/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@langchain/langgraph", "@langchain/core", "@langchain/groq"],
};
export default nextConfig;
