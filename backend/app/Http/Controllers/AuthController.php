<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Kiểm tra (Validate) dữ liệu Frontend gửi lên
        $request->validate([
            'email' => 'required|email',
            'mat_khau' => 'required|min:8'
        ], [
            'email.required' => 'Vui lòng nhập email.',
            'email.email' => 'Email không đúng định dạng.',
            'mat_khau.required' => 'Vui lòng nhập mật khẩu.',
            'mat_khau.min' => 'Mật khẩu phải ít nhất 8 ký tự!'
        ]);

        // Tìm người dùng trong DB dựa vào email
        $user = User::where('email', $request->email)->first();

        // Kiểm tra xem user có tồn tại và mật khẩu có khớp không
        // Hàm Hash::check sẽ tự động so sánh mật khẩu chữ thường với mật khẩu đã mã hóa trong DB
        if (!$user || !Hash::check($request->mat_khau, $user->mat_khau)) {
            return response()->json([
                'success' => false,
                'message' => 'Email hoặc mật khẩu không chính xác!'
            ], 401);
        }

        // Kiểm tra tài khoản có bị khóa không
        if ($user->trang_thai === 'khoa') {
            return response()->json([
                'success' => false,
                'message' => 'Tài khoản của bạn đã bị quản trị viên khóa.'
            ], 403);
        }

        // Xóa tất cả các token cũ của user này trong bảng 'token_ca_nhan'
        $user->tokens()->delete();

        // Nếu mọi thứ OK, tạo Token đăng nhập (Dùng Sanctum của Laravel)
        $token = $user->createToken('auth_token')->plainTextToken;

        // Trả về kết quả cho Frontend
        return response()->json([
            'success' => true,
            'message' => 'Đăng nhập thành công',
            'data' => $user, // Thông tin người dùng (đã ẩn mật khẩu nhờ cấu hình Model)
            'token' => $token // Frontend sẽ lưu token này lại để dùng cho các request sau
        ], 200);
    }

    public function logout(Request $request)
    {
        // Laravel Sanctum sẽ tự hiểu $request->user() là người đang cầm Token
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã đăng xuất thành công và hủy Token!'
        ]);
    }

    // 1. Hàm gửi link về email
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();
        if (!$user) return response()->json(['message' => 'Email không tồn tại!'], 404);

        // Tạo mã token ngẫu nhiên
        $token = Str::random(60);

        // Lưu vào bảng quen_mat_khau
        DB::table('quen_mat_khau')->updateOrInsert(
            ['email' => $request->email],
            ['token' => $token, 'ngay_tao' => Carbon::now()]
        );

        // Gửi email (Dùng hàm gửi mail thô sơ cho nhanh)
        $resetLink = "http://localhost:3000/reset-password?token=" . $token . "&email=" . $request->email;

        Mail::send([], [], function ($message) use ($user, $resetLink) {
            $message->to($user->email)
                ->subject('Thiết lập lại mật khẩu')
                ->html("Chào {$user->ho_ten}, bấm vào link sau để đổi mật khẩu: <a href='{$resetLink}'>Đổi mật khẩu ngay</a>");
        });

        return response()->json(['message' => 'Link đổi mật khẩu đã được gửi vào Email của bạn!']);
    }

    // 2. Hàm đặt lại mật khẩu mới
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'mat_khau_moi' => 'required|min:8'
        ]);

        // Kiểm tra token có khớp không
        $check = DB::table('quen_mat_khau')
            ->where(['email' => $request->email, 'token' => $request->token])
            ->first();

        if (!$check) return response()->json(['message' => 'Mã xác nhận không hợp lệ hoặc đã hết hạn!'], 400);

        // Cập nhật mật khẩu mới
        User::where('email', $request->email)->update([
            'mat_khau' => Hash::make($request->mat_khau_moi)
        ]);

        // Xóa token sau khi dùng xong
        DB::table('quen_mat_khau')->where(['email' => $request->email])->delete();

        return response()->json(['message' => 'Mật khẩu đã được cập nhật thành công!']);
    }
}
