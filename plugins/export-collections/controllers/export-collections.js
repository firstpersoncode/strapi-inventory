"use strict";
const moment = require("moment");
const ObjectsToCsv = require("objects-to-csv");

/**
 * export-collections.js controller
 *
 * @description: A set of functions called "actions" of the `export-collections` plugin.
 */

module.exports = {
  /**
   * Default action.
   *
   * @return {Object}
   */

  exportOrders: async ctx => {
    let orders = [];
    const input = ctx.request.body;
    const { start, end } = input;

    const knex = strapi.connections.default;

    if (start) {
      orders = await knex
        .column(
          "orders.id",
          "orders.order",
          "orders.note",
          "orders.status",
          "orders.created_at",
          "customers.fullname",
          "customers.email",
          "customers.phone",
          "customers.address"
        )
        .select()
        .from("orders")
        .where("orders.created_at", ">=", moment(start).toDate())
        .andWhere("orders.created_at", "<=", moment(end).toDate())
        .join("customers", { "customers.id": "orders.customer" });
    } else {
      orders = await knex
        .column(
          "orders.id",
          "orders.order",
          "orders.note",
          "orders.status",
          "orders.created_at",
          "customers.fullname",
          "customers.email",
          "customers.phone",
          "customers.address"
        )
        .select()
        .from("orders")
        .where("orders.created_at", "<=", moment(end).toDate())
        .join("customers", { "customers.id": "orders.customer" });
    }

    let result = [];

    for (let order of orders) {
      const orderItems = await knex
        .column("order_items.product_sku", "order_items.qty")
        .select()
        .from("order_items")
        .where("order_items.order", order.id);

      order = {
        ...order,
        order_items: orderItems
      };

      result.push(order);
    }

    const fileName = Date.now() + "-orders.csv";
    const filePath = "exported/";
    const file = filePath + fileName;

    const normalizedOrders = normalizeOrders(result);
    const csv = new ObjectsToCsv(normalizedOrders);
    await csv.toDisk("./public/" + file);

    // Send 200 `ok`
    ctx.send({
      message: "ok",
      orders: normalizedOrders,
      file
    });
  },

  exportProducts: async ctx => {
    let products = [];
    const input = ctx.request.body;
    const { start, end } = input;

    const knex = strapi.connections.default;

    if (start) {
      products = await knex
        .column("products.id", "products.name", "products.qty", "products.sku")
        .select()
        .from("products")
        .where("products.created_at", ">=", moment(start).toDate())
        .andWhere("products.created_at", "<=", moment(end).toDate());
    } else {
      products = await knex
        .column("products.id", "products.name", "products.qty", "products.sku")
        .select()
        .from("products")
        .where("products.created_at", "<=", moment(end).toDate());
    }

    let result = products;

    const fileName = Date.now() + "-products.csv";
    const filePath = "exported/";
    const file = filePath + fileName;

    const csv = new ObjectsToCsv(result);
    await csv.toDisk("./public/" + file);

    // Send 200 `ok`
    ctx.send({
      message: "ok",
      products: result,
      file
    });
  }
};

function normalizeOrders(orders) {
  return orders.map(order => ({
    order: order.order,
    customer: order.fullname,
    customer_email: order.email,
    customer_phone: order.phone,
    customer_address: order.address,
    items:
      order.order_items && order.order_items.length
        ? order.order_items
            .map(item => item.product_sku + ": " + item.qty)
            .join(", ")
        : null,
    status: order.status,
    note: order.note
  }));
}
