<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SaleResource;
use App\Models\Sale;
use App\Services\SaleService;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    public function __construct(
        private SaleService $saleService
    ) {}

    private function parseStrapiParam(Request $request, string $bracketKey, $default = null)
    {
        $qs = $request->getQueryString() ?? '';
        if ($qs === '' || !str_contains($qs, $bracketKey)) return $default;

        $decoded = urldecode($qs);
        if (preg_match('/' . preg_quote($bracketKey, '/') . '=([^&]*)/', $decoded, $m)) {
            return urldecode($m[1]);
        }
        return $default;
    }

    public function index(Request $request)
    {
        $query = Sale::query();

        if ($request->has('populate')) {
            $query->with(['vehicle', 'car']);
        }

        $vehicleId = $this->parseStrapiParam($request, 'filters[vehicle][$eq]');
        if ($vehicleId) {
            $query->where('vehicle_id', $vehicleId);
        }

        $carId = $this->parseStrapiParam($request, 'filters[car][$eq]');
        if ($carId) {
            $query->where('car_id', $carId);
        }

        $dateGte = $this->parseStrapiParam($request, 'filters[saleDate][$gte]');
        if ($dateGte) {
            $query->where('sale_date', '>=', $dateGte);
        }

        $dateLte = $this->parseStrapiParam($request, 'filters[saleDate][$lte]');
        if ($dateLte) {
            $query->where('sale_date', '<=', $dateLte);
        }

        if ($request->filled('sort')) {
            $sortParts = explode(':', $request->sort);
            $field = $sortParts[0];
            $direction = $sortParts[1] ?? 'asc';
            $query->orderBy($field, $direction);
        }

        $page = (int) ($this->parseStrapiParam($request, 'pagination[page]', '1'));
        $pageSize = (int) ($this->parseStrapiParam($request, 'pagination[pageSize]', '20'));

        $total = $query->count();
        $sales = $query->skip(($page - 1) * $pageSize)->take($pageSize)->get();

        return response()->json([
            'data' => SaleResource::collection($sales),
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required_without:car_id|exists:vehicles,id',
            'car_id' => 'required_without:vehicle_id|exists:cars,id',
            'sale_price' => 'required|integer|min:0',
            'buyer_name' => 'nullable|string',
            'quantity' => 'nullable|integer|min:1',
            'sale_date' => 'nullable|date',
        ]);

        $sale = $this->saleService->createSale($validated);

        return response()->json([
            'data' => new SaleResource($sale),
        ], 201);
    }

    public function destroy(Sale $sale)
    {
        $this->saleService->deleteSale($sale);

        return response()->json(['message' => 'Sale deleted']);
    }
}
