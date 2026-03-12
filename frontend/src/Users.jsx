import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Gắn thêm link proxy vào ngay trước link InfinityFree của bạn
const BASE_API = 'https://corsproxy.io/?https://xdpmweb.free.nf/api';

// Cấu hình headers định danh đây là luồng gọi API chuẩn để InfinityFree không chặn
const apiConfig = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
};

const Users = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [editId, setEditId] = useState(null);

    // 1. READ: Lấy danh sách users
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${BASE_API}/users`, apiConfig);
            setUsers(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 2. CREATE / UPDATE: Lưu user
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                // Sửa (PUT)
                await axios.put(`${BASE_API}/users/${editId}`, { name }, apiConfig);
            } else {
                // Thêm mới (POST)
                await axios.post(`${BASE_API}/users`, { name }, apiConfig);
            }
            setName('');
            setEditId(null);
            fetchUsers(); // Cập nhật lại giao diện sau khi lưu
        } catch (error) {
            console.error('Lỗi khi lưu user:', error);
            alert('Có lỗi xảy ra khi lưu! Bạn mở F12 Console xem chi tiết nhé.');
        }
    };

    // 3. Chuẩn bị đưa dữ liệu lên form để UPDATE
    const handleEdit = (user) => {
        setName(user.name);
        setEditId(user.id);
    };

    // 4. DELETE: Xóa user
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa user này không?")) {
            try {
                await axios.delete(`${BASE_API}/users/${id}`, apiConfig);
                fetchUsers(); // Cập nhật lại giao diện sau khi xóa
            } catch (error) {
                console.error('Lỗi khi xóa user:', error);
            }
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'sans-serif' }}>
            <h2 style={{ textAlign: 'center' }}>Quản lý Users (CRUD)</h2>
            
            <form onSubmit={handleSave} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input 
                    type="text" 
                    placeholder="Nhập tên user..." 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ flex: 1, padding: '10px', fontSize: '16px' }}
                />
                <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
                    {editId ? 'Cập nhật' : 'Thêm mới'}
                </button>
                {editId && (
                    <button type="button" onClick={() => {setName(''); setEditId(null)}} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
                        Hủy
                    </button>
                )}
            </form>

            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ backgroundColor: '#f2f2f2' }}>
                    <tr>
                        <th style={{ width: '50px' }}>ID</th>
                        <th>Name</th>
                        <th style={{ width: '120px', textAlign: 'center' }}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <button onClick={() => handleEdit(user)} style={{ marginRight: '5px', cursor: 'pointer' }}>Sửa</button>
                                    <button onClick={() => handleDelete(user.id)} style={{ color: 'red', cursor: 'pointer' }}>Xóa</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>Chưa có dữ liệu</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Users;