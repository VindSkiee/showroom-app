<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'files' => 'required|array|max:10',
            'files.*' => 'file|mimes:jpg,jpeg,png,gif,webp,mp4|max:10240',
        ]);

        $uploadedFiles = [];

        foreach ($request->file('files') as $file) {
            $path = $file->store('uploads', 'public');

            $uploadedFiles[] = [
                'id' => uniqid(),
                'name' => $file->getClientOriginalName(),
                'url' => '/storage/' . $path,
                'mime' => $file->getMimeType(),
                'size' => $file->getSize(),
                'width' => null,
                'height' => null,
            ];
        }

        return response()->json($uploadedFiles);
    }
}
