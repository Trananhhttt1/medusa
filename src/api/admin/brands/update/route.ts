import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import BrandModelService from "../../../../modules/brand/service";
import { BRAND_MODULE } from "../../../../modules/brand";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const brandService: BrandModelService = req.scope.resolve(BRAND_MODULE);
    const input = req?.body as any;
    console.log(input);
    const brand = await brandService.updateBrands(input);
    res.status(200).json({ data: brand });
  } catch (error) {
    res.status(500).json({
      message: "Update brand failed ",
      error: error.message,
    });
  }
};
