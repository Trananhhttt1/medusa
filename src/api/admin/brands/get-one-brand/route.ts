import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import BrandModelService from "../../../../modules/brand/service";
import { BRAND_MODULE } from "../../../../modules/brand";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const brandService: BrandModelService = req.scope.resolve(BRAND_MODULE);
    console.log(req.query);
    const id = req?.query?.id as string;

    const brand = await brandService.retrieveBrand(id);
    res.status(200).json({ data: brand });
  } catch (error) {
    res.status(500).json({
      message: "Create brand failed ",
      error: error.message,
    });
  }
};
