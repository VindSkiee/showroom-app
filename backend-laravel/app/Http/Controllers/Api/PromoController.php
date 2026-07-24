<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PromoResource;
use App\Models\Promo;
use Illuminate\Http\Request;

class PromoController extends Controller
{
    public function index(Request $request)
    {
        $query = Promo::where('is_active', true);

        // Populate
        if ($request->has('populate')) {
            $query->with(['vehicles', 'cars']);
        }

        $promos = $query->get();

        return response()->json([
            'data' => PromoResource::collection($promos),
            'meta' => [
                'pagination' => [
                    'page' => 1,
                    'pageSize' => count($promos),
                    'pageCount' => 1,
                    'total' => count($promos),
                ],
            ],
        ]);
    }
}
