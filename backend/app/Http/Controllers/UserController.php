<?php
    namespace App\Http\Controllers;

    use App\Http\Controllers\Controller;
    use App\Models\User;
    use Illuminate\Http\Request;

    class UserController extends Controller
    {
        // READ: Lấy danh sách tất cả users (Khớp BASE_API/users)
        public function index()
        {
            return response()->json(User::all());
        }

        // READ: Lấy 1 user (Khớp BASE_API/users/{id})
        public function show($id)
        {
            $user = User::find($id);
            if (!$user) return response()->json(['message' => 'Not found'], 404);
            return response()->json($user);
        }

        // CREATE: Thêm mới user
        public function store(Request $request)
        {
            $request->validate(['name' => 'required|string']);
            $user = User::create(['name' => $request->name]);
            return response()->json($user, 201);
        }

        // UPDATE: Sửa user
        public function update(Request $request, $id)
        {
            $user = User::find($id);
            if (!$user) return response()->json(['message' => 'Not found'], 404);
            
            $request->validate(['name' => 'required|string']);
            $user->update(['name' => $request->name]);
            return response()->json($user);
        }

        // DELETE: Xóa user
        public function destroy($id)
        {
            $user = User::find($id);
            if (!$user) return response()->json(['message' => 'Not found'], 404);
            
            $user->delete();
            return response()->json(['message' => 'Deleted successfully']);
        }
    }
?>