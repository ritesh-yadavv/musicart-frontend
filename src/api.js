const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://musicart-backend-kohl.vercel.app"
    : "http://localhost:8080";

export default baseUrl;