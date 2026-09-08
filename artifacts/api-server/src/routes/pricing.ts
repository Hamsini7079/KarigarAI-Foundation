import { Router, type IRouter } from "express";
import {
  CreatePricingRecommendationBody,
  CreatePricingRecommendationParams,
  CreatePricingRecommendationResponse,
} from "@workspace/api-zod";
import {
  pricingProvider,
  ProductNotFoundError,
} from "../services/pricing";

const router: IRouter = Router();

router.post(
  "/products/:productId/pricing-recommendation",
  async (req, res): Promise<void> => {
    const params = CreatePricingRecommendationParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const body = CreatePricingRecommendationBody.safeParse(req.body ?? {});
    if (!body.success) {
      res.status(400).json({ error: body.error.message });
      return;
    }

    try {
      const recommendation = await pricingProvider.recommend(
        params.data.productId,
        body.data,
      );
      res
        .status(201)
        .json(CreatePricingRecommendationResponse.parse(recommendation));
    } catch (error) {
      if (error instanceof ProductNotFoundError) {
        res.status(404).json({ error: error.message });
        return;
      }

      throw error;
    }
  },
);

export default router;