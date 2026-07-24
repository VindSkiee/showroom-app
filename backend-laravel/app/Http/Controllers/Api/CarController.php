<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CarResource;
use App\Models\Car;
use Illuminate\Http\Request;

class CarController extends Controller
{
    public function index(Request $request)
    {
        $query = Car::query();

        // Populate (eager load relations)
        if ($request->has('populate')) {
            $query->with(['promo', 'images', 'video', 'defects.images', 'sales']);
        }

        // Filter: type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter: availability_status
        if ($request->filled('availabilityStatus')) {
            $query->where('availability_status', $request->availabilityStatus);
        }

        // Filter: name contains
        if ($request->filled('filters[name][$containsi]')) {
            $query->where('name', 'LIKE', '%' . $request->input('filters[name][$containsi]') . '%');
        }

        // Filter: price gte
        if ($request->filled('filters[price][$gte]')) {
            $query->where('price', '>=', $request->input('filters[price][$gte]'));
        }

        // Filter: price lte
        if ($request->filled('filters[price][$lte]')) {
            $query->where('price', '<=', $request->input('filters[price][$lte]'));
        }

        // Filter: promo not null
        if ($request->input('filters[promo][$notNull]') === 'true') {
            $query->whereNotNull('promo_id');
        }

        // Sort
        if ($request->filled('sort')) {
            $sortParts = explode(':', $request->sort);
            $field = $sortParts[0];
            $direction = $sortParts[1] ?? 'asc';

            $sortMap = [
                'price' => 'price',
                'year' => 'year',
                'name' => 'name',
                'createdAt' => 'created_at',
                'updatedAt' => 'updated_at',
            ];

            $dbField = $sortMap[$field] ?? $field;
            $query->orderBy($dbField, $direction);
        }

        // Pagination
        $page = (int) $request->input('pagination[page]', 1);
        $pageSize = (int) $request->input('pagination[pageSize]', 20);

        $total = $query->count();
        $cars = $query->skip(($page - 1) * $pageSize)->take($pageSize)->get();

        return response()->json([
            'data' => CarResource::collection($cars),
            'meta' => [
                'pagination' => [
                    'page' => $page,
                    'pageSize' => $pageSize,
                    'pageCount' => (int) ceil($total / $pageSize),
                    'total' => $total,
                ],
            ],
        ]);
    }

    public function show(Request $request, string $id)
    {
        $query = Car::query();

        if ($request->has('populate')) {
            $query->with(['promo', 'images', 'video', 'defects.images', 'sales']);
        }

        $car = $query->findOrFail($id);

        return response()->json([
            'data' => new CarResource($car),
        ]);
    }
}
