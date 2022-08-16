<?php

use App\Events\UserJoinEvent;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {

    $id = Str::random(6);

    broadcast(new UserJoinEvent($id))->toOthers();
    return view('welcome', compact('id'));
});
