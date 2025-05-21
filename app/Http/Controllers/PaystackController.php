<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PaystackController extends Controller
{
    /**
     * Get Paystack configuration
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getConfig()
    {
        return response()->json([
            'publicKey' => config('paystack.public_key'),
        ]);
    }
}
