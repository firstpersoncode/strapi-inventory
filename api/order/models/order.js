"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async beforeUpdate(params, data) {
      const entity = await strapi.services.order.findOne({ order: data.order });

      if (entity.status !== data.status) {
        const orderItems = entity.order_items;
        for (let item of orderItems) {
          let product = item.product;
          let currQty = product.qty;
          let qty;
          if (
            (entity.status === "created" && data.status === "processed") ||
            (entity.status === "cancelled" && data.status === "processed")
          ) {
            qty = currQty - item.qty;

            product = await strapi.services.product.update(
              {
                id: product.id
              },
              { qty }
            );
          } else if (
            (entity.status === "processed" && data.status === "created") ||
            (entity.status === "processed" && data.status === "cancelled")
          ) {
            qty = currQty + item.qty;

            product = await strapi.services.product.update(
              {
                id: product.id
              },
              { qty }
            );
          }
        }
      }
    }
  }
};
