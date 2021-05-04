"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  /**
   * Promise to fetch all records
   *
   * @return {Promise}
   */
  find(params, populate) {
    return strapi
      .query("order")
      .find(params, ["customer", "order_items", "order_items.product"]);
  },

  /**
   * Promise to fetch record
   *
   * @return {Promise}
   */

  findOne(params, populate) {
    return strapi
      .query("order")
      .findOne(params, ["customer", "order_items", "order_items.product"]);
  }
};
