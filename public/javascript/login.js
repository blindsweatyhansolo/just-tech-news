// SCRIPT FILE FOR LOGIN/SIGNUP LOGIC
async function loginFormHandler(event) {
    event.preventDefault();

    // data from login form
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    // verify if ALL fields have values
    // THEN perform POST (route /users/login) request with form values
    if (email && password) {
        const response = await fetch('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email,
                password
            }),
            headers: { 'Content-type': 'application/json' }
        });

        // check the response status
        if (response.ok) {
            // redirect to homepage on success
            document.location.replace('/');
        } else {
            alert(response.statusText);
        }
    }
}

async function signupFormHandler(event) {
    event.preventDefault();

    // data from signup form
    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    // verify if ALL fields actually have values
    // THEN perform POST (route /users) request with form values
    if (username && email && password) {
        const response = await fetch('/api/users', {
            method: 'post',
            body: JSON.stringify({
                username,
                email,
                password
            }),
            headers: { 'Content-type': 'application/json' }
        });

        // check the response status
        if (response.ok) {
            console.log('Success!');
        } else {
            alert(response.statusText);
        }
    }
};


document.querySelector('.login-form').addEventListener('submit', loginFormHandler);

document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);

