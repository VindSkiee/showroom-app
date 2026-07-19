import type { Core } from "@strapi/strapi";

export default {
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // ============================================
    // 0. Set public permissions for Car API
    // ============================================
    try {
      const publicRole = await strapi.db.query("plugin::users-permissions.role").findOne({
        where: { type: "public" },
      });

      if (publicRole) {
        const actions = ["api::car.car.find", "api::car.car.findOne"];
        for (const action of actions) {
          const existing = await strapi.db.query("plugin::users-permissions.permission").findOne({
            where: { action, role: publicRole.id },
          });
          if (!existing) {
            await strapi.db.query("plugin::users-permissions.permission").create({
              data: { action, role: publicRole.id },
            });
          }
        }

        const saleActions = ["api::sale.sale.find", "api::sale.sale.findOne"];
        for (const action of saleActions) {
          const existing = await strapi.db.query("plugin::users-permissions.permission").findOne({
            where: { action, role: publicRole.id },
          });
          if (!existing) {
            await strapi.db.query("plugin::users-permissions.permission").create({
              data: { action, role: publicRole.id },
            });
          }
        }
        strapi.log.info("✅ Public permissions set for Car & Sale API");
      }
    } catch (err) {
      strapi.log.warn("⚠️  Could not set Car permissions:", (err as Error).message);
    }

    // ============================================
    // 1. Update stock for existing vehicles
    // ============================================
    const vehicles = await strapi.db.query("api::vehicle.vehicle").findMany({});

    if (vehicles.length > 0) {
      const needsUpdate = vehicles.some((v: any) => v.stock == null);

      if (needsUpdate) {
        for (const v of vehicles as any[]) {
          const randomSold = Math.floor(Math.random() * 2);
          await strapi.entityService.update("api::vehicle.vehicle", v.id, {
            data: {
              stock: v.stock ?? 3,
              stockSold: v.stockSold ?? randomSold,
              purchasePrice: v.purchasePrice ?? Math.round(v.price * 0.8),
              availabilityStatus: (v.stock ?? 3) - randomSold <= 0 ? "sold_out" : "available",
            },
          });
        }
        strapi.log.info(`✅ Seed: stock updated for ${vehicles.length} vehicles`);
      } else {
        strapi.log.info(`ℹ️  Vehicles already have stock data, skipping`);
      }
    }

    // ============================================
    // 1b. Fix existing data: stock > 0 but sold_out
    // ============================================
    const wrongStatusVeh = await strapi.db.query("api::vehicle.vehicle").findMany({
      where: { stock: { $gt: 0 }, availabilityStatus: "sold_out" },
    });
    for (const v of wrongStatusVeh as any[]) {
      await strapi.entityService.update("api::vehicle.vehicle", v.id, {
        data: { availabilityStatus: "available" },
      });
    }
    if (wrongStatusVeh.length > 0) {
      strapi.log.info(`✅ Fixed ${wrongStatusVeh.length} vehicles with wrong status`);
    }

    const wrongStatusCar = await strapi.db.query("api::car.car").findMany({
      where: { stock: { $gt: 0 }, availabilityStatus: "sold_out" },
    });
    for (const c of wrongStatusCar as any[]) {
      await strapi.entityService.update("api::car.car", c.id, {
        data: { availabilityStatus: "available" },
      });
    }
    if (wrongStatusCar.length > 0) {
      strapi.log.info(`✅ Fixed ${wrongStatusCar.length} cars with wrong status`);
    }

    // ============================================
    // 2. Seed car data
    // ============================================
    const carCount = await strapi.db.query("api::car.car").count();

    if (carCount === 0) {
      const cars = [
        {
          name: "Toyota Avanza",
          model: "1.3 E",
          licensePlate: "D 1234 AB",
          type: "mpv",
          price: 150000000,
          year: 2020,
          stock: 2,
          stockSold: 1,
          purchasePrice: 120000000,
          documentStatus: "complete",
          taxStatus: "active",
          taxExpiryYear: 2026,
          defectStatus: "none",
          availabilityStatus: "available",
        },
        {
          name: "Honda Brio Satya",
          model: "1.2 E",
          licensePlate: "D 5678 CD",
          type: "hatchback",
          price: 160000000,
          year: 2022,
          stock: 3,
          stockSold: 0,
          purchasePrice: 130000000,
          documentStatus: "complete",
          taxStatus: "active",
          taxExpiryYear: 2027,
          defectStatus: "none",
          availabilityStatus: "available",
        },
        {
          name: "Mitsubishi Xpander",
          model: "1.5 Ultimate",
          licensePlate: "B 9012 EF",
          type: "mpv",
          price: 230000000,
          year: 2021,
          stock: 1,
          stockSold: 0,
          purchasePrice: 185000000,
          documentStatus: "complete",
          taxStatus: "active",
          taxExpiryYear: 2026,
          defectStatus: "minor",
          availabilityStatus: "available",
        },
        {
          name: "Toyota Innova Reborn",
          model: "2.0 G",
          licensePlate: "B 3456 GH",
          type: "mpv",
          price: 350000000,
          year: 2023,
          stock: 2,
          stockSold: 1,
          purchasePrice: 280000000,
          documentStatus: "complete",
          taxStatus: "active",
          taxExpiryYear: 2028,
          defectStatus: "none",
          availabilityStatus: "available",
        },
        {
          name: "Honda CR-V Turbo",
          model: "1.5 Prestige",
          licensePlate: "B 7890 IJ",
          type: "suv",
          price: 400000000,
          year: 2022,
          stock: 1,
          stockSold: 2,
          purchasePrice: 330000000,
          documentStatus: "complete",
          taxStatus: "active",
          taxExpiryYear: 2027,
          defectStatus: "none",
          availabilityStatus: "sold_out",
        },
        {
          name: "Daihatsu Sigra",
          model: "1.2 R",
          licensePlate: "B 1122 KL",
          type: "lcgc",
          price: 120000000,
          year: 2023,
          stock: 4,
          stockSold: 0,
          purchasePrice: 95000000,
          documentStatus: "complete",
          taxStatus: "active",
          taxExpiryYear: 2028,
          defectStatus: "none",
          availabilityStatus: "available",
        },
        {
          name: "Suzuki Ertiga",
          model: "1.5 GX",
          licensePlate: "B 3344 MN",
          type: "mpv",
          price: 180000000,
          year: 2021,
          stock: 2,
          stockSold: 1,
          purchasePrice: 145000000,
          documentStatus: "complete",
          taxStatus: "active",
          taxExpiryYear: 2026,
          defectStatus: "none",
          availabilityStatus: "available",
        },
        {
          name: "Toyota Rush",
          model: "1.5 S",
          licensePlate: "B 5566 OP",
          type: "suv",
          price: 280000000,
          year: 2020,
          stock: 1,
          stockSold: 1,
          purchasePrice: 225000000,
          documentStatus: "incomplete",
          taxStatus: "active",
          taxExpiryYear: 2025,
          defectStatus: "none",
          availabilityStatus: "available",
        },
      ];

      for (const car of cars) {
        await strapi.entityService.create("api::car.car", {
          data: { ...car, publishedAt: new Date() } as any,
        });
      }
      strapi.log.info(`✅ Seed: ${cars.length} cars created`);
    } else {
      strapi.log.info(`ℹ️  ${carCount} cars already exist, skipping seed`);
    }
  },
};
