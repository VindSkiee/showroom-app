<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PromoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'documentId' => (string) $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'discount' => (int) $this->discount,
            'isActive' => (bool) $this->is_active,
            'banner' => $this->banner_path ? [
                'id' => $this->id,
                'url' => '/storage/' . $this->banner_path,
                'name' => basename($this->banner_path),
            ] : null,
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
        ];
    }
}
