<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DefectItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'part' => $this->part,
            'description' => $this->description,
            'images' => DefectItemImageResource::collection($this->whenLoaded('images')),
        ];
    }
}
