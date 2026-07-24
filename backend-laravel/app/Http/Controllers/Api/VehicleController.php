<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\VehicleResource;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    private function parseStrapiParam(Request $request, string $dotKey, string $bracketKey, $default = null)
    {
        $value = $request->input($dotKey);
        if ($value !== null) return $value;

        // Fallback: parse raw query string for bracket notation with $ (e.g. filters[type][$eq])
        $qs = $request->getQueryString() ?? '';
        if ($qs === '' || !str_contains($qs, $bracketKey)) return $default;

        $decoded = urldecode($qs);
        // Extract value after the key in the query string
        if (preg_match('/' . preg_quote($bracketKey, '/') . '=([^&]*)/', $decoded, $m)) {
            return urldecode($m[1]);
        }
        return $default;
    }

    public function index(Request $request)
    {
        $query = Vehicle::query();

        // Populate (eager load relations)
        if ($request->has('populate')) {
            $query->with(['promo', 'images', 'video', 'defects.images', 'sales']);
        }

        // Filter: type — support both "type=matic" and "filters[type][$eq]=matic"
        $type = $request->filled('type')
            ? $request->type
            : $this->parseStrapiParam($request, 'filters.type.$eq', 'filters[type][$eq]');
        if ($type) {
            $query->where('type', $type);
        }

        // Filter: availability_status
        $availability = $request->filled('availabilityStatus')
            ? $request->availabilityStatus
            : $this->parseStrapiParam($request, 'filters.availabilityStatus.$eq', 'filters[availabilityStatus][$eq]');
        if ($availability) {
            $query->where('availability_status', $availability);
        }

        // Filter: name contains
        $nameFilter = $this->parseStrapiParam($request, 'filters.name.$containsi', 'filters[name][$containsi]');
        if ($nameFilter) {
            $query->where('name', 'LIKE', '%' . $nameFilter . '%');
        }

        // Filter: price gte
        $priceGte = $this->parseStrapiParam($request, 'filters.price.$gte', 'filters[price][$gte]');
        if ($priceGte) {
            $query->where('price', '>=', $priceGte);
        }

        // Filter: price lte
        $priceLte = $this->parseStrapiParam($request, 'filters.price.$lte', 'filters[price][$lte]');
        if ($priceLte) {
            $query->where('price', '<=', $priceLte);
        }

        // Filter: year gte
        $yearGte = $this->parseStrapiParam($request, 'filters.year.$gte', 'filters[year][$gte]');
        if ($yearGte) {
            $query->where('year', '>=', $yearGte);
        }

        // Filter: year lte
        $yearLte = $this->parseStrapiParam($request, 'filters.year.$lte', 'filters[year][$lte]');
        if ($yearLte) {
            $query->where('year', '<=', $yearLte);
        }

        // Filter: documentStatus
        $docStatus = $this->parseStrapiParam($request, 'filters.documentStatus.$eq', 'filters[documentStatus][$eq]');
        if ($docStatus) {
            $query->where('document_status', $docStatus);
        }

        // Filter: taxStatus
        $taxStatus = $this->parseStrapiParam($request, 'filters.taxStatus.$eq', 'filters[taxStatus][$eq]');
        if ($taxStatus) {
            $query->where('tax_status', $taxStatus);
        }

        // Filter: defectStatus
        $defectStatus = $this->parseStrapiParam($request, 'filters.defectStatus.$eq', 'filters[defectStatus][$eq]');
        if ($defectStatus) {
            $query->where('defect_status', $defectStatus);
        }

        // Filter: promo not null
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

        // Pagination — parse from raw query string too
        $page = (int) ($this->parseStrapiParam($request, 'pagination.page', 'pagination[page]', '1'));
        $pageSize = (int) ($this->parseStrapiParam($request, 'pagination.pageSize', 'pagination[pageSize]', '20'));

        $total = $query->count();
        $vehicles = $query->skip(($page - 1) * $pageSize)->take($pageSize)->get();

        return response()->json([
            'data' => VehicleResource::collection($vehicles),
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
        $query = Vehicle::query();

        if ($request->has('populate')) {
            $query->with(['promo', 'images', 'video', 'defects.images', 'sales']);
        }

        $vehicle = $query->findOrFail($id);

        return response()->json([
            'data' => new VehicleResource($vehicle),
        ]);
    }

    public function update(Request $request, string $id)
    {
        $vehicle = Vehicle::findOrFail($id);

        $validated = $request->validate([
            'stock' => 'sometimes|integer|min:0',
            'stock_sold' => 'sometimes|integer|min:0',
            'availability_status' => 'sometimes|in:available,sold_out',
        ]);

        $vehicle->update($validated);

        return response()->json([
            'data' => new VehicleResource($vehicle->fresh()),
        ]);
    }
}
