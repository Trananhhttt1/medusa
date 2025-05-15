import { Module } from "@medusajs/framework/utils";
import BrandModelService from "./service";

export const BRAND_MODULE = "brand";

export default Module(BRAND_MODULE, {
  service: BrandModelService,
});
