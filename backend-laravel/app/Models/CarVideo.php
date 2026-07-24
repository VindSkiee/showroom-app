<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CarVideo extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'car_id',
        'video_path',
    ];

    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }
}
