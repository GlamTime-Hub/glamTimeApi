// import connectDB from "./src/config/database";
import app from "./src/app";
import { errorHandler } from "./src/middleware/errorHandler";

// connectDB();

const PORT = process.env.PORT || 3000;

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}/api`);
});
