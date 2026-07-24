<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DefectItemImage extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'defect_item_id',
        'image_path',
    ];

    public function defectItem(): BelongsTo
    {
        return $this->belongsTo(DefectItem::class);
    }
}
