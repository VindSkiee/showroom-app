import type { Schema, Struct } from '@strapi/strapi';

export interface DefectItemDefectItem extends Struct.ComponentSchema {
  collectionName: 'components_defect_items';
  info: {
    description: 'Item kecacatan pada kendaraan';
    displayName: 'Defect Item';
    icon: 'warning';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    images: Schema.Attribute.Media<'images', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 3;
        },
        number
      >;
    part: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'defect-item.defect-item': DefectItemDefectItem;
    }
  }
}
