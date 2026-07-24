<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Promo extends Model
{
    protected $fillable = [
        'title',
        'description',
        'discount',
        'is_active',
        'banner_path',
    ];

    protected $casts = [
        'discount' => 'integer',
        'is_active' => 'boolean',
    ];

    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class);
    }

    public function cars(): HasMany
    {
        return $this->hasMany(Car::class);
    }
}
