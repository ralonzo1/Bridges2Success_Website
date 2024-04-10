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
            'DOB' => 'required|date',
            'gender' => 'required|string',
            'relationshipWithVictim' => 'required|string',
            'preferredPronouns' => 'required|string',
            'streetAddress1' => 'required|string',
            'streetAddress2' => 'string',
            'city' => 'string',
            'state' => 'string',
            'zipCode' => 'string',
            'phone' => 'required|string',
            'email' => 'required|string|email',
            'programsReferredTo' => 'required|string',
            'referredBy' => 'required|string',
            'intakePreference' => 'required|string',
            'location' => 'string',
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
