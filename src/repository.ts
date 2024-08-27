import knex, { Knex } from "knex";
import { v4 as uuidv4 } from 'uuid';
import Measurement from "./types.js"
import { MeasurementConfirm } from "./models.js"

class MeasurementRepository {
  private db: Knex | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      this.db = knex({
        client: "sqlite3",
        connection: {
          filename: "./measurements.sqlite",
        },
        useNullAsDefault: true,
      });
      await this.createTable();
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error;
    }
  }

  private async createTable() {
    const tableExists = await this.db!.schema.hasTable("measurements");

    if (!tableExists) {
      await this.db!.schema.createTable("measurements", (table) => {
        table.uuid("measure_uuid").primary();
        table.text("image_url").notNullable();
        table.text("customer_code").notNullable();
        table.datetime("measure_datetime").notNullable();
        table.boolean("has_confirmed").notNullable().defaultTo(false);
        table.enu("measure_type", ["WATER", "GAS"]).notNullable();
      });
    }
  }

  async insertMeasurement(measurement: Measurement) {
    if (!this.db) throw new Error("Database not initialized");

    await this.db("measurements").insert({
      measure_uuid: uuidv4(),
      ...measurement,
      has_confirmed: false,
    });
  }

  async getMeasurementsByCustomerCode(customer_code: string) {
    if (!this.db) throw new Error("Database not initialized");

    return await this.db("measurements").where({ customer_code }).select("*");
  }

  async patchConfirmMeasurementById(measurement: MeasurementConfirm){
    const { measure_uuid, confirmed_value } = measurement;

    return await this.db("measurements").where({ measure_uuid} ).update({has_confirmed: true}).update({measure_value : confirmed_value});
  }
}

export const measurementRepository = new MeasurementRepository();