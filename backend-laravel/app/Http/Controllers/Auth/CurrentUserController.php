<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CurrentUserController extends Controller
{
    /**
     * Get the authenticated user.
     * Returns user info in the format the frontend expects.
     *
     * GET /api/user
     * GET /api/auth/me
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'authenticated' => true,
            'user' => [
                'id' => $user->id,
                'username' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }
}
