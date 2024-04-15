<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUploadClient;
use App\Mail\RegistrationEmail;
use Illuminate\Http\Request;
use App\Models\UploadClient;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class UploadClientController extends Controller
{
    public function store(StoreUploadClient $request)
    {
        $data = $this->generateDataToStore($request);
        UploadClient::create($data);
        Mail::to($data['Email'])->send(new RegistrationEmail($data['Email'], $data['FirstName']." ".$data['LastName']));
        return response()->json([
            'status' => true,
            "message" => "Data stored successfully"
        ]);
    }

    private function generateDataToStore(Request $request) {
        $data = [
            'FirstName' => $request->firstName,
            'LastName' => $request->lastName,
            'DOB' => date($request->DOB),
            'Gender' => $request->gender,
            'RelationshipWithVictim' => $request->relationshipWithVictim,
            'PreferredPronouns' => $request->preferredPronouns,
            'Address1' => $request->streetAddress1,
            'Address2' => $request->streetAddress2,
            'City' => $request->city,
            'State' => $request->state,
            'Zip' => $request->zipCode,
            'Phone' => $request->phone,
            'Email' => $request->email,
            'ReferredProgram' => $request->programsReferredTo ?? "",
            'ReferredBy' => $request->referredBy ?? "",
            'IntakePref' => $request->intakePreference,
            'AttendingLocation' => $request->location,
            'PictureFile'=> '',
            'chkAgree'=> $request->chkAgree ? 1 : 0,
            'chkPermission'=> $request->chkPermission ? 1 : 0,
        ];

        // Check file present in request
        $uploadedFile = '';
        if ($request->hasFile('pictureFile')) {
            // Upload picture file to S3 and store URL in DB
            $uploadedFile = $request->file('pictureFile');
            $name = time() . "." . $uploadedFile->getClientOriginalExtension();
            $filePath = 'uploads/client-profiles/' . $name;
            Storage::disk('public')->put($filePath, file_get_contents($uploadedFile));
            $data['PictureFile'] = $filePath;
        }

        return $data;
    }
}
