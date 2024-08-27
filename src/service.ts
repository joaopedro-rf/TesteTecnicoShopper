import { measurementRepository } from "./repository.js";
import { Measurement } from "./models.js";
import { MeasurementConfirm } from "./models.js"

class MeasurementService {
  async createMeasurement(measurement: Measurement) {
   
    await measurementRepository.insertMeasurement(measurement);
  }

  async getAllMeasurementsByCustomerCode(customer_code: string) {
    
    return await measurementRepository.getMeasurementsByCustomerCode(customer_code);
  }

  async confimMeasurement(measurement: MeasurementConfirm){
    
    return await measurementRepository.patchConfirmMeasurementById(measurement);
  } 
}

export const measurementService = new MeasurementService();