<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
//eloquent connects to db 
//mysql queries --> eloquent --> DB
class Category extends Model
{
    protected $table = 'categories';
}
