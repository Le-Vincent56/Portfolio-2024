const sendGet = async (url, handler) => {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'text/html',
        },
    });

    const result = await response.json();
    console.log(result);

    if(result.redirect) {
        window.location = result.redirect;
    }

    if(handler) {
        handler(result)
    }
}

module.exports = {
    sendGet
}