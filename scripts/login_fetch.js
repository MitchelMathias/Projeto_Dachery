document.getElementById('login').addEventListener('submit', async (e) =>{
    e.preventDefault()

    await fetch('api/login_mysql.js', {
        method:'post',
        headers:{
            'Content-type':'application/json'
        },
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        })
    })
})