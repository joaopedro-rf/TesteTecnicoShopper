import express, { NextFunction, RequestHandler } from "express";
import { database } from "./database.js";
import  Measurement from "./types.js"
import { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(express.json());

database.init().catch(console.error);

const validateCreateUser: RequestHandler = (req, res, next) => {
  const { image_url, customer_code, measure_type, measure_datetime } = req.body;

  if (typeof image_url !== "string") {
    return res.status(400).json({ error: "Image_url must be a string" });
  }
  if (typeof customer_code !== "string") {
    return res.status(400).json({ error: "Customer_code must be a string" });
  }
  if (typeof measure_type !== "number") {
    return res.status(400).json({ error: "Measure_type must be either WATER or GAS" });
  }
  if (isNaN(new Date(measure_datetime).getTime())) {
    return res.status(400).json({ error: "Measure_datetime must be a valid Date" });
  }
  
  next();
};


app.post("/upload", validateCreateUser, async (req: Request, res: Response) => {
  try {
    const { image_url, customer_code, measure_type, measure_datetime } = req.body as Measurement;

    if (!image_url || !customer_code || !measure_datetime || !measure_type) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "VALIDATION ERROR",
      });
    }

    await database.insertMeasurement({
      image_url,
      customer_code,
      measure_type,
      measure_datetime
    });

    res.status(200).json();
  } catch (error) {
    console.error("Error inserting measurement:", error);
    res.status(500).json({ error_code: "INTERNAL_ERROR", error_description: "Failed to insert measurement" });
  }
});

app.get("/:customer_code/list", async (req, res) => {
  try {
    const customer_code = req.params.customer_code;

    const measurements = await database.getMeasurementsByCustomerCode(
      customer_code
    );

    if (measurements === null) {
      return res.status(404).json({
        error_code: "MEASURES_NOT_FOUND",
        error_description: "Nenhuma leitura encontrada",
      });
    }

    res.json(measurements);
  } catch (error) {
    console.error("Error fetching measurements:", error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
