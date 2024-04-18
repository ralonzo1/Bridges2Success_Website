<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactUsRequest;
use App\Mail\AdminContactUsMail;
use App\Mail\ContactUsMail;
use App\Models\ContactUsQueries;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactUsController extends Controller
{
    public function store(ContactUsRequest $request)
    {
        $data = $this->generateDataToStore($request);
        ContactUsQueries::create($data);
        Mail::to($data['email'])->send(new ContactUsMail());
        Mail::to(env('MAIL_FROM_ADDRESS'))->send(new AdminContactUsMail($data['email'], $data['message']));
        return response()->json([
            'status' => true,
            "message" => "Data stored successfully"
        ]);
    }

    private function generateDataToStore(Request $request) {
        $data = [
            'subject' => $request->subject,
            'email' => $request->email,
            'message' => $request->message,
        ];

        return $data;
    }
}
