<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\TinNhanController;
use App\Http\Controllers\TinDangController;

Route::get('/tat-ca-tin-dang',
    [TinDangController::class,'tatCaTinDang']
);

Route::get('/chi-tiet-tin-dang/{id}',
    [TinDangController::class,'chiTietTinDang']
);

Route::post('/tao-tin-dang',
    [TinDangController::class,'taoTinDang']
);

Route::put('/cap-nhat-tin-dang/{id}',
    [TinDangController::class,'capNhatTinDang']
);

Route::delete('/xoa-tin-dang/{id}',
    [TinDangController::class,'xoaTinDang']
);

Route::get('/tin-dang-cua-toi/{ma_chu_nha}',
    [TinDangController::class,'tinDangCuaToi']
);

Route::get('/tat-ca-tin-nhan',
    [TinNhanController::class,'tatCaTinNhan']
);

Route::get('/chi-tiet-tin-nhan/{id}',
    [TinNhanController::class,'chiTietTinNhan']
);

Route::post('/gui-tin-nhan',
    [TinNhanController::class,'guiTinNhan']
);

Route::delete('/xoa-tin-nhan/{id}',
    [TinNhanController::class,'xoaTinNhan']
);

Route::get('/cuoc-tro-chuyen/{ma_cuoc_tro_chuyen}',
    [TinNhanController::class,'cuocTroChuyen']
);

Route::get('/messages',[TinNhanController::class,'index']);
Route::post('/messages',[TinNhanController::class,'store']);

Route::post('/messages', [TinNhanController::class, 'send']);
Route::get('/messages/{user_id}', [TinNhanController::class, 'getMessages']);


// Testtttttt 