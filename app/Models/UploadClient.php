<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UploadClient extends Model
{
    use HasFactory;

    protected $table = 'tblUploadClients';

    protected $primaryKey = 'id';

    protected $attributes = [
        'Active' => 1,
        "City" => null,
        "State" => null,
        "Zip" => null,
        "Address2" => null,
    ];

    protected $fillable = [
        'LastName',
        'FirstName',
        'DOB',
        'StartDate',
        'Address1',
        'Address2',
        'City',
        'State',
        'Zip',
        'Email',
        'PhoneHome',
        'Gender',
        'PictureFile',
        'ProgramID',
        'Language',
        'IntakePref',
        'ReferredBy',
        'ReferredProgram',
        'IntakePref',
        'AttendingLocation',
        'chkAgree',
        'chkPermission',
        'VictimName',
        'Pronouns',
        'FullName',
        'AllowEmail',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = true; // Set to false to disable Laravel's default timestamps handling

    /**
     * Custom created_at field name.
     *
     * @var string
     */
    const CREATED_AT = 'CreateDate';

    /**
     * Custom updated_at field name.
     *
     * @var string
     */
    const UPDATED_AT = 'ModifiedDate';
}
