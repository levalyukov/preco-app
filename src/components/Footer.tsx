import React from 'react';
import '../styles/Footer.css'

const Footer: React.FC = () => {
    const year = new Date().getFullYear();

    return (
        <div id='footer-container'>
            <p>
                <a href='https://github.com/levalyukov/preco-app'>GitHub</a> · v1.0.0
                </p>
            <p>© {year} Лев Алюков</p>
        </div>
    );
}

export default Footer;
