import express, { urlencoded, json } from "express";
import { config } from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { connectionDB } from "./db/connection";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { swaggerOptions } from "./core/configrations/swager/swager.config";
import supportRouter from "./modules/support/support.contoller";
import workingAreaRouter from "./modules/working_area/working_area.contoller";
import propertyRouter from "./modules/property/property.contoller"
import unitRouter from './modules/unit/unit.contoller'

const app = express();
config();
app.use(
  cors({
    origin: "*",
  })
);
app.use(morgan("dev"));
app.use(helmet());
app.use(json());
app.use(urlencoded({ extended: false }));

if (process.env.APP_ENV !== "prod") {
  const swaggerSpec = swaggerJSDoc(swaggerOptions);
  // Serve Swagger documentation
  app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
}

app.use("/api/support", supportRouter);
app.use("/api/workingarea", workingAreaRouter);
app.use("/api/property", propertyRouter);
app.use("/api/unit", unitRouter);

app.get("*", (req, res) => {
  res.status(401).send({ error: "Api not found!" });
});
app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on ${process.env.APP_PORT}`);
  connectionDB();
});
