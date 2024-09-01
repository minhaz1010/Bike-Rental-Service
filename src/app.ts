import express, { Request, Response } from "express";
import cors from "cors";
import { mainRoutes } from "./app/route";
import notFound from "./app/middleware/notFound";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import morgan from "morgan";
import path from "path";
const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello dear");
});
app.use("/api", mainRoutes);

app.use(globalErrorHandler);

app.use(notFound);
export default app;
