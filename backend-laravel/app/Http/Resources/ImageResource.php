<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ImageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'url' => '/storage/' . $this->image_path,
            'name' => basename($this->image_path),
            'mime' => mime_content_type(storage_path('app/public/' . $this->image_path)) ?: 'image/jpeg',
            'size' => file_exists(storage_path('app/public/' . $this->image_path))
                ? filesize(storage_path('app/public/' . $this->image_path))
                : 0,
        ];
    }
}
