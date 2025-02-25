<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebsiteSettings extends Model
{
    use HasFactory;

    protected $table = 'tblWebsiteSettings';

    protected $visible = ['ClientEmail', 'SubjectLine'];

    // remove all columns except the wanted ones
    public function setRawAttributes(array $attributes, $sync = false)
    {
        $filteredAttributes = array_intersect_key($attributes, array_flip($this->visible));

        parent::setRawAttributes($filteredAttributes, $sync);
    }
}


