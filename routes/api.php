<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;


use App\Http\Controllers\UploadClientController;
use App\Http\Controllers\ContactUsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/', function (Request $request){
    return response()->json([
        'status' => true,
        "message" => "Welcome"
    ]);
});
Route::post('/upload-client', [UploadClientController::class, 'store']);
Route::post('/store-contact-us-query', [ContactUsController::class, 'store']);

Route::post('/verify-recaptcha', function (Request $request) {
    $recaptchaValue = $request->get('recaptchaToken');
    $secretKey = env('RECAPTCHA_SECRET_KEY');

    $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
        'secret' => $secretKey,
        'response' => $recaptchaValue,
    ]);

    $data = $response->json();

    if ($data['success']) {
        return response()->json(['success' => true]);
    } else {
//        return response()->json(['success' => false, 'error-codes' => $data['error-codes']]);
        return response()->json(['success' => false]);
    }
});
