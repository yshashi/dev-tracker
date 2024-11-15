import express, { NextFunction, Response, Request } from "express";
import { createTask, getTasks, updateTaskStatus } from "../controllers/taskController";
import { CreateTaskRequest } from "../types/taskTypes";
import { validateToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", validateToken, (req: CreateTaskRequest, res: Response, next: NextFunction) =>
  createTask(req, res, next),
);
router.get("/", validateToken, (req: Request, res: Response, next: NextFunction) =>
  getTasks(req, res, next),
);

router.patch('/:taskId/status', validateToken, (req: Request, res: Response, next: NextFunction) =>
  updateTaskStatus(req, res, next)
);

export default router;
