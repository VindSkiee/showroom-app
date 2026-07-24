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
        $nameFilter = $request->input('filters.name.$containsi')
            ?? $request->input('filters[name][$containsi]');
        if ($nameFilter) {
            $query->where('name', 'LIKE', '%' . $nameFilter . '%');
        }

        // Filter: price gte
        $priceGte = $request->input('filters.price.$gte')
            ?? $request->input('filters[price][$gte]');
        if ($priceGte) {
            $query->where('price', '>=', $priceGte);
        }

        // Filter: price lte
        $priceLte = $request->input('filters.price.$lte')
            ?? $request->input('filters[price][$lte]');
        if ($priceLte) {
            $query->where('price', '<=', $priceLte);
        }

        // Filter: year gte
        $yearGte = $request->input('filters.year.$gte')
            ?? $request->input('filters[year][$gte]');
        if ($yearGte) {
            $query->where('year', '>=', $yearGte);
        }

        // Filter: year lte
        $yearLte = $request->input('filters.year.$lte')
            ?? $request->input('filters[year][$lte]');
        if ($yearLte) {
            $query->where('year', '<=', $yearLte);
        }

        // Filter: documentStatus
        $docStatus = $request->input('filters.documentStatus.$eq')
            ?? $request->input('filters[documentStatus][$eq]');
        if ($docStatus) {
            $query->where('document_status', $docStatus);
        }

        // Filter: taxStatus
        $taxStatus = $request->input('filters.taxStatus.$eq')
            ?? $request->input('filters[taxStatus][$eq]');
        if ($taxStatus) {
            $query->where('tax_status', $taxStatus);
        }

        // Filter: defectStatus
        $defectStatus = $request->input('filters.defectStatus.$eq')
            ?? $request->input('filters[defectStatus][$eq]');
        if ($defectStatus) {
            $query->where('defect_status', $defectStatus);
        }

        // Filter: promo not null — support hasPromo=true (frontend simple format)
        if ($request->boolean('hasPromo')) {
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

    public function update(Request $request, string $id)
    {
        $car = Car::findOrFail($id);

        $validated = $request->validate([
            'stock' => 'sometimes|integer|min:0',
            'stock_sold' => 'sometimes|integer|min:0',
            'availability_status' => 'sometimes|in:available,sold_out',
        ]);

        $car->update($validated);

        return response()->json([
            'data' => new CarResource($car->fresh()),
        ]);
    }
}
