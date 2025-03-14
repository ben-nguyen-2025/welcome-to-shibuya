<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

//Route::view('/', 'blog.home')->name('homeway');

Route::get('/', [HomeController::class, "index"])->name("homeway");
Route::view('/about', 'blog.about')->name('aboutway');
Route::view('/contact', 'blog.contact')->name('contactway');
Route::get('/posts/{post}', [PostController::class, "show"])->name('post.show');
