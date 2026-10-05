<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class StoreUploadClient extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'firstName' => 'required|string',
            'lastName' => 'required|string',
            'DOB' => [
                'required',
                'date',
                'date_format:Y-m-d',
                function ($attribute, $value, $fail) {
                    // Ensure the date is within the SQL Server's acceptable date range
                    $minDate = '1753-01-01';
                    $maxDate = '9999-12-31';

                    if ($value < $minDate || $value > $maxDate) {
                        $fail("Please check the given date.");
                    }
                },
            ],
            'gender' => 'required|string',
            'relationshipWithVictim' => 'required|string',
            'preferredPronouns' => 'sometimes|nullable|string',
            'streetAddress1' => 'sometimes|nullable|string',
            'streetAddress2' => 'sometimes|nullable|string',
            'city' => 'sometimes|nullable|string',
            'state' => 'sometimes|nullable|string',
            'zipCode' => 'sometimes|nullable|string',
            'phone' => 'required|string',
            'email' => 'required|string|email',
            'programsReferredTo' => 'required|string',
            'referredBy' => 'required|string',
            'intakePreference' => 'required|string',
            'location' => 'required|string',
            'additionalNotes' => 'string',
            'pictureFile' => 'file|mimes:jpg,jpeg,png',
            'chkAgree' => 'required|boolean|accepted:true',
            'chkPermission' => 'required|boolean|accepted:true',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success'   => false,
            'message'   => 'Validation errors',
            'errors'      => $validator->errors()
        ], 422));
    }
}
