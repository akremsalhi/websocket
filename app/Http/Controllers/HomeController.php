<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\MessageCreatedEvent;

class HomeController extends Controller
{

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
