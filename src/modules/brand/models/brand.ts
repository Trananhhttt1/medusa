import { model } from "@medusajs/framework/utils";

export const brand = model.define("brand", {
  id: model.id().primaryKey(),
  name: model.text(),
  description: model.text(),
});
