import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_API = import.meta.env.VITE_BASE_API || 'http://localhost:8000/api';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [editId, setEditId] = useState(null);

    // 1. READ: Gọi API lấy tất cả users
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${BASE_API}/users`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
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
                // Sửa
                await axios.put(`${BASE_API}/users/${editId}`, { name });
            } else {
                // Thêm
                await axios.post(`${BASE_API}/users`, { name });
            }
            setName('');
            setEditId(null);
            fetchUsers(); // Cập nhật lại list
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    // 3. Chuẩn bị UPDATE
    const handleEdit = (user) => {
        setName(user.name);
        setEditId(user.id);
    };

    // 4. DELETE: Xóa user
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa?")) {
            try {
                await axios.delete(`${BASE_API}/users/${id}`);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h2>Quản lý Users (CRUD)</h2>
            
            <form onSubmit={handleSave} style={{ marginBottom: '20px' }}>
                <input 
                    type="text" 
                    placeholder="Nhập tên user..." 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ padding: '8px', marginRight: '10px' }}
                />
                <button type="submit" style={{ padding: '8px' }}>
                    {editId ? 'Cập nhật' : 'Thêm mới'}
                </button>
                {editId && <button type="button" onClick={() => {setName(''); setEditId(null)}} style={{ marginLeft:'5px' }}>Hủy</button>}
            </form>

            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>
                                <button onClick={() => handleEdit(user)}>Sửa</button>
                                <button onClick={() => handleDelete(user.id)} style={{ marginLeft: '10px', color: 'red' }}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && <tr><td colSpan="3" style={{textAlign: 'center'}}>Chưa có dữ liệu</td></tr>}
                </tbody>
            </table>
        </div>
    );
};

export default Users;