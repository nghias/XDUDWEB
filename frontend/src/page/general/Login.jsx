import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [tenTK, setTenTK] = useState('');
    const [matKhau, setMatKhau] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Kiểm tra session khi vừa mở trang (nếu đã đăng nhập thì tự động chuyển hướng)
    useEffect(() => {
        const session = localStorage.getItem('user_session');
        if (session) {
            const userData = JSON.parse(session);
            redirectByRole(userData.vai_tro);
        }
    }, [navigate]);

    // Hàm xử lý chuyển hướng dựa theo vai trò
    const redirectByRole = (vaiTro) => {
        switch (vaiTro) {
            case 'quan_tri':
                navigate('/admin');
                break;
            case 'chu_nha':
            case 'nguoi_tim_phong':
                navigate('/user');
                break;
            default:
                navigate('/login');
                break;
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('https://xdudweb-php.onrender.com/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Gửi param TenTK và MatKhau như yêu cầu
                body: JSON.stringify({ TenTK: tenTK, MatKhau: matKhau })
            });

            const result = await response.json();

            if (result.success) {
                // Lưu object data vào localStorage
                localStorage.setItem('user_session', JSON.stringify(result.data));
                
                // Chuyển hướng đến trang thích hợp
                redirectByRole(result.data.vai_tro);
            } else {
                // Hiển thị lỗi từ server trả về
                setError(result.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!');
            }
        } catch (err) {
            setError('Lỗi kết nối đến server. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formCard}>
                <h2 style={styles.title}>Đăng Nhập</h2>
                
                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label>Tài khoản (Email):</label>
                        <input 
                            type="text" 
                            value={tenTK}
                            onChange={(e) => setTenTK(e.target.value)}
                            required
                            style={styles.input}
                            placeholder="Nhập email của bạn"
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Mật khẩu:</label>
                        <input 
                            type="password" 
                            value={matKhau}
                            onChange={(e) => setMatKhau(e.target.value)}
                            required
                            style={styles.input}
                            placeholder="Nhập mật khẩu"
                        />
                    </div>

                    <button type="submit" disabled={isLoading} style={styles.button}>
                        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// CSS in JS cơ bản (Bạn có thể chuyển sang file .css riêng hoặc dùng Tailwind)
const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' },
    formCard: { padding: '30px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
    title: { textAlign: 'center', marginBottom: '20px', color: '#333' },
    form: { display: 'flex', flexDirection: 'column' },
    inputGroup: { marginBottom: '15px' },
    input: { width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
    button: { padding: '10px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
    error: { color: 'red', marginBottom: '15px', textAlign: 'center', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '4px' }
};

export default Login;