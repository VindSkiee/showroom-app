import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: ['id'],
    translations: {
      id: {
        'app.components.LeftMenu.navbrand.title': 'Admin Aneka Motor',
      },
      en: {
        'app.components.LeftMenu.navbrand.title': 'Admin Aneka Motor',
      },
    },
  },
  bootstrap(app: StrapiApp) {},
};
