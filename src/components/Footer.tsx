import '../styles/Footer.css'

function Footer() {
    function resetLocalStorage() {
        if (localStorage.getItem("user_quick_schedule") != null) {
            localStorage.removeItem("user_quick_schedule"); 
            window.location.reload()
        }
    }

    return (
        <footer>
            <p>
                <a target='_blank' href='https://github.com/levalyukov/preco-app'>GitHub</a> · v0.4.1
            </p>

            <p>
                <a id='changeGroup' onClick={() => {resetLocalStorage();}}>Изменить учебную группу</a>
            </p>
        </footer>
    )
}

export { Footer }