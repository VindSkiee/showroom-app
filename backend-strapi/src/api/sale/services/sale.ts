import { factories } from "@strapi/strapi";

export default factories.createCoreService("api::sale.sale", ({ strapi }) => ({
  async afterCreate(event) {
    const { result } = event;

    try {
      const sale = await strapi.db.query("api::sale.sale").findOne({
        where: { id: result.id },
        populate: ["vehicle", "car"],
      }) as any;

      if (sale?.vehicle) {
        const vehicle = await strapi.db.query("api::vehicle.vehicle").findOne({
          where: { id: sale.vehicle.id },
        }) as any;
        if (vehicle) {
          const currentStock = vehicle.stock ?? 1;
          const newStock = Math.max(0, currentStock - 1);
          await strapi.db.query("api::vehicle.vehicle").update({
            where: { id: sale.vehicle.id },
            data: {
              stock: newStock,
              stockSold: (vehicle.stockSold ?? 0) + 1,
              availabilityStatus: newStock <= 0 ? "sold_out" : "available",
            },
          });
        }
      }

      if (sale?.car) {
        const car = await strapi.db.query("api::car.car").findOne({
          where: { id: sale.car.id },
        }) as any;
        if (car) {
          const currentStock = car.stock ?? 1;
          const newStock = Math.max(0, currentStock - 1);
          await strapi.db.query("api::car.car").update({
            where: { id: sale.car.id },
            data: {
              stock: newStock,
              stockSold: (car.stockSold ?? 0) + 1,
              availabilityStatus: newStock <= 0 ? "sold_out" : "available",
            },
          });
        }
      }
    } catch (err) {
      strapi.log.error("Sale lifecycle afterCreate error:", err);
    }
  },

  async afterDelete(event) {
    const { result } = event;

    try {
      const sale = await strapi.db.query("api::sale.sale").findOne({
        where: { id: result.id },
        populate: ["vehicle", "car"],
      }) as any;

      if (sale?.vehicle) {
        const vehicle = await strapi.db.query("api::vehicle.vehicle").findOne({
          where: { id: sale.vehicle.id },
        }) as any;
        if (vehicle) {
          await strapi.db.query("api::vehicle.vehicle").update({
            where: { id: sale.vehicle.id },
            data: {
              stock: (vehicle.stock ?? 0) + 1,
              stockSold: Math.max(0, (vehicle.stockSold ?? 1) - 1),
              availabilityStatus: "available",
            },
          });
        }
      }

      if (sale?.car) {
        const car = await strapi.db.query("api::car.car").findOne({
          where: { id: sale.car.id },
        }) as any;
        if (car) {
          await strapi.db.query("api::car.car").update({
            where: { id: sale.car.id },
            data: {
              stock: (car.stock ?? 0) + 1,
              stockSold: Math.max(0, (car.stockSold ?? 1) - 1),
              availabilityStatus: "available",
            },
          });
        }
      }
    } catch (err) {
      strapi.log.error("Sale lifecycle afterDelete error:", err);
    }
  },
}));
