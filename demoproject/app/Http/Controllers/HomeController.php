<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    //
    public function index(){
        //Select * FROM Categories;
        echo(request('category_id'));
        $allCategories =  Category::get(); //['1, 2'];
        //request function checks parameters in URL
        //$allPosts = Post::orderby('id', 'desc')->get();

        // $allPosts = Post::where('category_id', request('category_id'))
        //     ->latest()
        //     ->get();

        $allPosts = Post::when(request('category_id'), function($query)
        {
            $query->where('category_id', request('category_id'));
        })
        ->latest()
        ->get();

        /*
        return view("blog.home", [
            'categories' => $allCategories,
            'posts' => $allPosts
        ]);
        */
        return view("blog.home", compact('allCategories', 'allPosts'));

        //this is in php
        //infinite data can be included

        /*
        model = database table
        view = html
        controller = logic

        model connects to db, controller makes actions based on data
        view displays results to user
        */
    }
}
