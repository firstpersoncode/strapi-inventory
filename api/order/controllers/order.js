"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    const input = ctx.request.body;

    try {
      const orderPublicID = generateUUID();

      const customer = await verifyCustomer(input.customer);
      const orderItems = await verifyOrderItems(input.order_items);

      const entity = await strapi.services.order.create({
        order: orderPublicID,
        note: input.note,
        status: input.status,
        customer,
        order_items: orderItems
      });

      return sanitizeEntity(entity, { model: strapi.models.order });
    } catch (err) {
      throw err;
    }
  }
};

async function verifyCustomer(customer) {
  const { email } = customer;

  let entity = await strapi.services.customer.findOne({ email });

  if (!Boolean(entity)) {
    entity = await strapi.services.customer.create(customer);
  }

  return entity.id;
}

async function verifyOrderItems(orderItems) {
  let entities = [];

  try {
    for (let item of orderItems) {
      const { product_sku: productSKU, qty } = item;
      const product = await strapi.services.product.findOne({
        sku: productSKU
      });

      if (!Boolean(product)) {
        throw new Error("Product not found with SKU: " + productSKU);
      }

      const orderItem = await strapi.services["order-item"].create({
        product_sku: productSKU,
        qty,
        product: product.id
      });

      entities.push(orderItem);
    }

    return entities.map(item => item.id);
  } catch (err) {
    throw err;
  }
}

function generateUUID() {
  let dt = Date.now();
  const uuid = "xxxxx".replace(/[xy]/g, function(c) {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });

  return "ORDER-" + uuid.toUpperCase() + "-" + Date.now();
}
