import {
  createStep,
  StepResponse,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { BRAND_MODULE } from "../../modules/brand";
import BrandModelService from "../../modules/brand/service";

export type CreateBrandStepInput = {
  name: string;
  description: string;
};

type CreateBrandWorkflowInput = {
  name: string;
  description: string;
};

export const createBrandStep = createStep(
  "create-brand-step",
  async (input: CreateBrandStepInput, { container }) => {
    const brandService: BrandModelService =
      container.resolve<BrandModelService>(BRAND_MODULE);

    const brand = await brandService.createBrands(input);
    return new StepResponse(brand, brand.id);
  }
);

export const createBrandWorkflow = createWorkflow(
  "create-brands",
  (input: CreateBrandWorkflowInput) => {
    const brand = createBrandStep(input);
    return new WorkflowResponse(brand);
  }
);
