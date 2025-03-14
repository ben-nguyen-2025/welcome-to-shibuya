<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    //you can specify attributes here
    protected $fillable = ['title', 'text', 'category_id'];

    public function category() 
    {
        return $this->belongsTo(Category::class, 'category_id');
        //any post should belong to a category
    }
}
