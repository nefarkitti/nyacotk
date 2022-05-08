async function aTimer(page) {
    const session = localStorage.getItem("kartissus")
    try {
        const verifyAuth = await axios({
            url: `${URL}/verify`,
            method: "POST",
            headers: {
                "authorization": session
            }
        });
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
