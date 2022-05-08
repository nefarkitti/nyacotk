async function aTimer(page) {
    try {
        const verifyAuth = await axios.post(`${URL}/verify`);
        if (page == "auth") window.location.href = "/main"
    } catch (error) {
        if (error.response.status == 401 && !["auth","404"].includes(page)) {
            window.location.href = '/';
        } else {
            console.log(error);
        }
    }
}

async function checkAuth(page) {
    aTimer(page);
    if (["auth","404"].includes(page)) return;
    setInterval(async function() {
        aTimer(page);
    }, 5000)
    // uncomment when we release hA
}
