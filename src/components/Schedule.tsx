import React from 'react';
import '../styles/Schedule.css'

const Schedule: React.FC = () => {
    return (
        <div id='container'>
            <article>
                <p id='header'>Вторник, 07 июля</p>
                <div id='data-container'>
                    <div id='time'>
                        <p>1 пара</p>
                        <p>8:30 — 10:00</p>
                        <p>Кабинет: 308</p>
                    </div>
                    <div id='info'>
                        <p>Биология</p>
                        <p>Карпова А.В.</p>
                    </div>
                </div>
            </article>

            <article>
                <p id='header'>Вторник, 07 июля</p>
                <div id='data-container'>
                    <div id='time'>
                        <p>1 пара</p>
                        <p>8:30 — 10:00</p>
                        <p>Кабинет: 308</p>
                    </div>
                    <div id='info'>
                        <p>Биология</p>
                        <p>Карпова А.В.</p>
                    </div>
                </div>
            </article>

            <article>
                <p id='header'>Вторник, 07 июля</p>
                <div id='data-container'>
                    <div id='time'>
                        <p>1 пара</p>
                        <p>8:30 — 10:00</p>
                        <p>Кабинет: 308</p>
                    </div>
                    <div id='info'>
                        <p>Биология</p>
                        <p>Карпова А.В.</p>
                    </div>
                </div>
            </article>
        </div>
    );
}

export default Schedule;
