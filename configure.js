exports.config = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3307,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "testing",
    connectionLimit: 100
  };