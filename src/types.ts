interface Measurement {
    image_url: string;
    customer_code: string;
    measure_datetime: Date,
    measure_type: "WATER" | "GAS";
  }

export default Measurement;