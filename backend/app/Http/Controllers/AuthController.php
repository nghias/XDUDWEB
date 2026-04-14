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

    // Hàm gửi link về email
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // Đổi User thành Model tương ứng của bạn (ví dụ NguoiDung)
        $user = User::where('email', $request->email)->first();
        if (!$user) return response()->json(['message' => 'Email không tồn tại!'], 404);

        $token = rand(100000, 999999); // Tạo mã 6 số

        // Lưu vào bảng quen_mat_khau
        DB::table('quen_mat_khau')->updateOrInsert(
            ['email' => $request->email],
            ['token' => $token, 'ngay_tao' => Carbon::now()]
        );

        // SỬA DÒNG NÀY: Thay localhost bằng domain Vercel thực tế của Frontend
        $frontendUrl = "https://xdudweb.vercel.app"; // Thay bằng link React của bạn
        $resetLink = $frontendUrl . "/reset-password?token=" . $token . "&email=" . $request->email;

        // Gửi email (Laravel sẽ tự lấy cấu hình Brevo ở file .env để gửi đi)
        Mail::send([], [], function ($message) use ($user, $token) {
            $message->to($user->email)
                ->subject('Mã xác nhận đổi mật khẩu - Tìm Trọ Trực Tuyến')
                ->html("
                    <div style='font-family: Arial, sans-serif; background-color: #f4f7f6; padding: 40px 0; margin: 0;'>
                        <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; padding: 40px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); text-align: center;'>
                            
                            <h2 style='color: #0d6efd; margin-bottom: 20px;'>Yêu Cầu Đặt Lại Mật Khẩu</h2>
                            
                            <p style='font-size: 16px; color: #333333; text-align: left;'>Chào <b>{$user->ho_ten}</b>,</p>
                            
                            <p style='font-size: 16px; color: #555555; text-align: left; line-height: 1.6;'>
                                Bạn vừa yêu cầu mã xác nhận để đặt lại mật khẩu cho tài khoản tại hệ thống <b>Tìm Trọ Trực Tuyến</b>. Dưới đây là mã xác nhận của bạn:
                            </p>
                            
                            <div style='margin: 30px 0;'>
                                <span style='display: inline-block; font-size: 36px; font-weight: bold; color: #0d6efd; letter-spacing: 8px; background-color: #e9ecef; padding: 15px 30px; border-radius: 8px; border: 2px dashed #0d6efd;'>
                                    {$token}
                                </span>
                            </div>
                            
                            <p style='font-size: 14px; color: #777777; text-align: left;'>
                                <i>Lưu ý: Vui lòng không chia sẻ mã này cho bất kỳ ai. Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.</i>
                            </p>
                            
                            <hr style='border: none; border-top: 1px solid #eeeeee; margin: 30px 0;' />
                            
                            <p style='font-size: 12px; color: #999999;'>
                                Đây là email tự động, vui lòng không trả lời. <br>
                                &copy; 2026 Tìm Trọ Trực Tuyến.
                            </p>
                        </div>
                    </div>
                ");
        });

        return response()->json(['message' => 'Mã xác nhận đã được gửi vào Email của bạn!']);
    }

    // Hàm đặt lại mật khẩu mới
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

    // Hàm Đăng ký tài khoản
    public function register(Request $request)
    {
        $request->validate([
            'ho_ten' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:nguoi_dung,email',
            'mat_khau' => 'required|string|min:8',
            'so_dien_thoai' => 'required|string|max:10|unique:nguoi_dung,so_dien_thoai'
        ], [
            'email.unique' => 'Email này đã được sử dụng.',
            'so_dien_thoai.unique' => 'Số điện thoại này đã được đăng ký.',
            'mat_khau.min' => 'Mật khẩu phải có ít nhất 8 ký tự.'
        ]);

        $user = User::create([
            'ho_ten' => $request->ho_ten,
            'email' => $request->email,
            'mat_khau' => Hash::make($request->mat_khau),
            'so_dien_thoai' => $request->so_dien_thoai,
            'vai_tro' => 'nguoi_tim_phong',
            'trang_thai' => 'hoat_dong',
            'ngay_tao' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Đăng ký tài khoản thành công!',
            'data' => $user
        ], 201);
    }

    // Hàm Đổi mật khẩu (Yêu cầu đã đăng nhập)
    public function changePassword(Request $request)
    {
        $request->validate([
            'mat_khau_cu' => 'required',
            'mat_khau_moi' => 'required|min:8'
        ], [
            'mat_khau_moi.min' => 'Mật khẩu mới phải có ít nhất 8 ký tự.'
        ]);

        $user = $request->user();

        // Kiểm tra mật khẩu cũ có khớp với database không
        if (!Hash::check($request->mat_khau_cu, $user->mat_khau)) {
            return response()->json([
                'success' => false,
                'message' => 'Mật khẩu cũ không chính xác!'
            ], 400);
        }

        // Cập nhật mật khẩu mới
        $user->update([
            'mat_khau' => Hash::make($request->mat_khau_moi)
        ]);

        // (Tùy chọn) Xóa tất cả token để yêu cầu đăng nhập lại trên các thiết bị khác
        // $user->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đổi mật khẩu thành công!'
        ], 200);
    }
}
