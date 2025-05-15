import { brand } from "./models/brand";
import { MedusaService } from "@medusajs/framework/utils";

class BrandModelService extends MedusaService({ brand }) {}

export default BrandModelService;
