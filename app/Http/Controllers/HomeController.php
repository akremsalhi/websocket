<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\MessageCreatedEvent;
use App\Events\UserJoinEvent;
use Illuminate\Support\Str;

class HomeController extends Controller
{

    public function index () {
        

        $id = Str::random(6);

        broadcast(new UserJoinEvent($id))->toOthers();
        return view('welcome', compact('id'));
    }

    public function store (Request $request) {
        $validated = $request->validate([
            'message' => 'required',
            'from' => 'required',
        ]);

        $data = ['message' => $request->input('message'), 'from' => $request->input('from')];

        broadcast(new MessageCreatedEvent($data))->toOthers();

        return response()->json(compact('data'));
    }
}
