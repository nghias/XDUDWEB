import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Quan trọng: Để link là '/api' để Vercel tự động kích hoạt Rewrites
const BASE_API = '/api'; 

const Users = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Cấu hình Header để InfinityFree nhận diện đúng yêu cầu API
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    // 1. Lấy danh sách Users (READ)
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_API}/users`, config);
            // API trả về trực tiếp mảng [] nên ta lấy response.data
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Lỗi fetch dữ liệu:', error);
            setUsers([]); // Nếu lỗi thì set về mảng rỗng để không bị lỗi .map
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 2. Thêm hoặc Cập nhật User (CREATE / UPDATE)
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`${BASE_API}/users/${editId}`, { name }, config);
            } else {
                await axios.post(`${BASE_API}/users`, { name }, config);
            }
            setName('');
            setEditId(null);
            fetchUsers();
        } catch (error) {
            alert('Không thể lưu dữ liệu. Hãy kiểm tra lại Backend!');
        }
    };

    // 3. Xóa User (DELETE)
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa không?")) {
            try {
                await axios.delete(`${BASE_API}/users/${id}`, config);
                fetchUsers();
            } catch (error) {
                console.error('Lỗi xóa:', error);
            }
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'Arial' }}>
            <h2 style={{ textAlign: 'center' }}>Quản lý Danh sách Users</h2>
            
            <form onSubmit={handleSave} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input 
                    type="text" 
                    placeholder="Nhập tên..." 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ flex: 1, padding: '8px' }}
                />
                <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer', background: '#28a745', color: '#fff', border: 'none' }}>
                    {editId ? 'Cập nhật' : 'Thêm mới'}
                </button>
            </form>

            {loading ? <p>Đang tải dữ liệu...</p> : (
                <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f4f4f4' }}>
                            <th>ID</th>
                            <th>Họ và Tên</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(users) && users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>{user.id}</td>
                                    <td style={{ padding: '8px' }}>{user.name}</td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>
                                        <button onClick={() => { setName(user.name); setEditId(user.id); }} style={{ marginRight: '5px' }}>Sửa</button>
                                        <button onClick={() => handleDelete(user.id)} style={{ color: 'red' }}>Xóa</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center', padding: '10px' }}>Không có dữ liệu hiển thị</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Users;