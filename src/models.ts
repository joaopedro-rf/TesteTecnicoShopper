export interface Measurement {
    measure_uuid?: string; 
    image_url: string;
    customer_code: string;
    measure_datetime: Date;
    has_confirmed: boolean; 
    measure_type: "WATER" | "GAS";
}

export interface MeasurementConfirm{
    measure_uuid: "string",
    confirmed_value: number
}