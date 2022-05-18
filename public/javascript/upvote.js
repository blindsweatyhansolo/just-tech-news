// SCRIPT FILE FOR UPVOTE BUTTON (SINGLE POST) LOGIC
async function upvoteClickHandler(event) {
    event.preventDefault();

    // grab id from single-post URL string
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    // PUT request using id
    const response = await fetch('/api/posts/upvote', {
        method: 'PUT',
        body: JSON.stringify({
            // set the value of post_id to id grabbed from URL string
            post_id: id
        }),
        headers: {
            'Content-type': 'application/json'
        }
    });

    // reload page on success
    if (response.ok) {
        document.location.reload();
    } else {
        alert(response.statusText);
    }
};

document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);