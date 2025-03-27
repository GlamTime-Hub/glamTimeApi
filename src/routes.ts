import express, { Request, Response, Router } from "express";

const routes: Router = express.Router();
routes.get('/', (_: Request, res: Response) => {
  res.send('API funcionando correctamente');
});

export default routes;