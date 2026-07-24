<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'documentId' => (string) $this->id,
            'name' => $this->name,
            'model' => $this->model,
            'licensePlate' => $this->license_plate,
            'type' => $this->type,
            'price' => (int) $this->price,
            'year' => (int) $this->year,
            'documentStatus' => $this->document_status,
            'documentNote' => $this->document_note,
            'taxStatus' => $this->tax_status,
            'taxExpiryYear' => $this->tax_expiry_year ? (int) $this->tax_expiry_year : null,
            'taxExpiredFrom' => $this->tax_expired_from ? (int) $this->tax_expired_from : null,
            'defectStatus' => $this->defect_status,
            'availabilityStatus' => $this->availability_status,
            'stock' => (int) $this->stock,
            'stockSold' => (int) $this->stock_sold,
            'purchasePrice' => $this->purchase_price ? (int) $this->purchase_price : null,
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
            'promo' => new PromoResource($this->whenLoaded('promo')),
            'images' => ImageResource::collection($this->whenLoaded('images')),
            'video' => new VideoResource($this->whenLoaded('video')),
            'defects' => DefectItemResource::collection($this->whenLoaded('defects')),
            'sales' => SaleResource::collection($this->whenLoaded('sales')),
        ];
    }
}
