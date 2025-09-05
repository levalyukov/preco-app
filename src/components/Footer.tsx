import '../styles/Footer.css'

function Footer() {
    return (
        <footer>
            <p>
                <a target='_blank' href='https://github.com/levalyukov/preco-app'>GitHub</a> · v0.3.1
            </p>

            <p>
                <a id='changeGroup' onClick={() => {localStorage.removeItem("user_quick_schedule"); window.location.reload()}}>Изменить учебную группу</a>
            </p>
        </footer>
    )
}

export { Footer }