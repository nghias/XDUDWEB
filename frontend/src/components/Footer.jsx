import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-dark text-light py-4 mt-auto">
            <div className="container text-center">
                <h5 className="fw-bold mb-3">Hệ thống Tìm Trọ Trực Tuyến</h5>
                <p className="mb-0 text-secondary">
                    © {new Date().getFullYear()} Bản quyền thuộc về Tìm Trọ Trực Tuyến. Tất cả các quyền được bảo lưu.
                </p>
            </div>
        </footer>
    );
};

export default Footer;