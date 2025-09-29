import { useEffect, useState } from 'react'
import '../styles/Footer.css'

function Footer() {
    const [serverStatus, setServerStatus] = useState<'available' | 'dontrespond' | 'unavailable' | "">("");
    const [serverStatusText, setServerStatusText] = useState("");

    useEffect(() => {
        async function getServerStatus() {
            try {
                const backend = await fetch("http://localhost:3000/api/status");
                const server = await backend.json();
                if (server.status == 200) {
                    setServerStatus('available');
                    setServerStatusText("Доступен");
                    console.log("Server worked:", server.status);
                } else {
                    setServerStatus('dontrespond');
                    setServerStatusText("Не отвечает");
                    console.log("Server not worked:", server.status);
                };
            } catch {
                setServerStatus('unavailable');
                setServerStatusText("Недоступен");
            };
        }; getServerStatus();
    }, []);

    return (
        <footer>
            <p id='server-status'>Состояние сервера: <span id={serverStatus}>{serverStatusText}</span></p>
            <p><a target='_blank' href='https://github.com/levalyukov/preco-app'>GitHub</a> · v0.5.2</p>
        </footer>
    )
}

export { Footer }