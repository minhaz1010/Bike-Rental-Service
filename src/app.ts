import express, { Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./app/errors/globalErrorHandler";
import { mainRoutes } from "./app/route";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello dear");
});

app.use("/api", mainRoutes);

app.use(globalErrorHandler);
export default app;
