export default function errorHandler(err, req, res, next) {
  console.error("🔥 Error:", err);

  // If your service throws `{ status: 400, message: "Invalid data" }`
  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  // Prisma errors
  if (err.code && err.code.startsWith("P")) {
    return res.status(400).json({
      success: false,
      message: "Database error",
      error: err.meta || err.message,
    });
  }

  // Default unknown error
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
