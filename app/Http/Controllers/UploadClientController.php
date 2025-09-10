<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUploadClient;
use App\Mail\RegistrationEmail;
use App\Mail\RegistrationFromSettingsEmail;
use Illuminate\Http\Request;
use App\Models\UploadClient;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Throwable;

class UploadClientController extends Controller
{
    public function store(StoreUploadClient $request)
    {
        try {

            $data = $this->generateDataToStore($request);
            UploadClient::create($data);

            $websiteSettings = \App\Models\WebsiteSettings::first();
            $mailContent = str_replace("[LastName]", $data['LastName'], str_replace("[FirstName]", $data['FirstName'], $websiteSettings['ClientEmail']));
            $mailSubject = $websiteSettings['SubjectLine'];

            Mail::to($data['Email'])->send(new \App\Mail\RegistrationFromSettingsEmail($data['Email'], $mailSubject, $mailContent));

            return response()->json([
                'status' => true,
                "message" => "Data stored successfully"
            ]);
        } catch (Throwable $e) {
            // Log the error
            \Log::error("UploadClient store failed", [
                'error' => $e->getMessage(),
                'data' => $data,
                'trace' => $e->getTraceAsString(),
            ]);

            try {
                $adminEmails = explode(',', env('ADMIN_EMAILS', 'admin@example.com'));

                $mailSubject = "UploadClient Store Failed";

                $errorMessage = htmlentities($e->getMessage());

                $submittedData = "";
                foreach ($data as $key => $value) {
                    $submittedData .= "<li style=\"margin-bottom:4px;\"><strong>{$key}:</strong> {$value}</li>";
                }

                $mailContent = <<<HTML
                <div style="font-family: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'; color:#062134; font-size:14px; line-height:20px;">
                    <div style="text-align:center; margin-bottom:1rem;">
                        <img src="https://registrationdev.clientprogressonline.com/images/logo.jpg" alt="Logo" style="max-width:200px; height:auto; display:inline-block;" />
                    </div>

                    <h2 style="color:#b91c1c; font-size:18px; font-weight:700; margin-bottom:10px;">
                        An error occurred while processing a client upload
                    </h2>

                    <div style="background:#fef2f2; border:1px solid #fecaca; padding:12px; border-radius:6px; margin-bottom:20px;">
                        <p style="margin:0; font-weight:600; color:#991b1b;">Error Details:</p>
                        <p style="margin:0; white-space:pre-line; color:#991b1b;">{$errorMessage}</p>
                    </div>

                    <div style="background:#f9fafb; border:1px solid #e5e7eb; padding:12px; border-radius:6px;">
                        <p style="margin:0 0 8px; font-weight:600; color:#111827;">Submitted Data:</p>
                        <ul style="list-style:none; padding:0; margin:0;">
                            {$submittedData}
                        </ul>
                    </div>

                    <p style="margin-top:20px; font-size:12px; color:#6b7280; text-align:center;">
                        This is an automated message sent from the registration system.
                    </p>
                </div>
                HTML;

                foreach ($adminEmails as $adminEmail) {
                    Mail::to(trim($adminEmail))->send(
                        new RegistrationFromSettingsEmail($adminEmail, $mailSubject, nl2br($mailContent))
                    );
                }
            } catch (Throwable $inner) {
                \Log::error("Failed to send error report email", [
                    'error' => $inner->getMessage(),
                    'data' => $data
                ]);
            }

            return response()->json([
                'status' => false,
                "message" => "Something went wrong, please try again later."
            ], 500);
        }
    }

    private function generateDataToStore(Request $request)
    {
        $data = [
            'FirstName' => $request->firstName,
            'LastName' => $request->lastName,
            'DOB' => \Carbon\Carbon::createFromFormat('Y-m-d', $request->DOB)->startOfDay()->format('Y-m-d H:i:s'),
            'Gender' => $request->gender,
            'Remarks' => $request->note,
            'VictimName' => $request->relationshipWithVictim,
            'Pronouns' => $request->preferredPronouns,
            'Address1' => $request->streetAddress1,
            'Address2' => $request->streetAddress2,
            'City' => $request->city,
            'State' => $request->state,
            'Zip' => $request->zipCode,
            'PhoneCell' => $request->phone,
            'Email' => $request->email,
            'ReferredProgram' => $request->programsReferredTo ?? "",
            'ReferredBy' => $request->referredBy ?? "",
            'IntakePref' => $request->intakePreference,
            'AttendingLocation' => $request->location,
            'PictureFile' => '',
            'chkAgree' => $request->chkAgree ? 1 : 0,
            'chkPermission' => $request->chkPermission ? 1 : 0,
            'AllowEmail' => 1,
            'FullName' => $request->lastName . ', ' . $request->firstName,
        ];

        // Check file present in request
        $uploadedFile = '';
        if ($request->hasFile('pictureFile')) {
            // Upload picture file to S3 and store URL in DB
            $uploadedFile = $request->file('pictureFile');
            $name = time() . "." . $uploadedFile->getClientOriginalExtension();
            $filePath = env('CLIENT_PROFILE_PATH') . $name;
            Storage::disk('cpo')->put($filePath, file_get_contents($uploadedFile));
            $data['PictureFile'] = $filePath;
        }

        return $data;
    }
}
