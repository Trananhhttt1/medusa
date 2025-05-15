import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { createBrandWorkflow } from "../../../workflows/brand/create_brand";
import { z } from "zod";
import { PostAdminCreateBrand } from "./validators";
import BrandModelService from "../../../modules/brand/service";
import { BRAND_MODULE } from "../../../modules/brand";

type PostAdminCreateBrandType = z.infer<typeof PostAdminCreateBrand>;

export const POST = async (
  req: MedusaRequest<PostAdminCreateBrandType>,
  res: MedusaResponse
) => {
  try {
    const brandService: BrandModelService = req.scope.resolve(BRAND_MODULE);
    const input = req.body;
    const brand = await brandService.createBrands(input);
    res.status(200).json({ data: brand });
  } catch (error) {
    res.status(500).json({
      message: "Create brand failed ",
      error: error.message,
    });
  }
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const brandService: BrandModelService = req.scope.resolve(BRAND_MODULE);
    const skip = req.query?.offset
      ? parseInt(req.query.offset as string, 10)
      : 0;
    const take = req.query?.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;
    const [data, count] = await brandService.listAndCountBrands(
      {},
      { take, skip }
    );
    res.status(200).json({ data, count });
  } catch (error) {
    res.status(500).json({
      message: "Get list Brand failed ",
      error: error.message,
    });
  }
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const brandService: BrandModelService = req.scope.resolve(BRAND_MODULE);
    const id = req?.query?.id as string;
    const data = await brandService.deleteBrands(id);
    res.status(200).json({ data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "DELETE brands failes", error: error.message });
  }
};
