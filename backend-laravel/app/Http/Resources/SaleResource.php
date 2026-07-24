<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SaleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'documentId' => (string) $this->id,
            'saleDate' => $this->sale_date->toISOString(),
            'salePrice' => (int) $this->sale_price,
            'buyerName' => $this->buyer_name,
            'quantity' => (int) $this->quantity,
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
            'vehicle' => new VehicleResource($this->whenLoaded('vehicle')),
            'car' => new CarResource($this->whenLoaded('car')),
        ];
    }
}
