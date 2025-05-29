const postsContainer = document.querySelector(".postsContainer");
if(postsContainer) {
    fetch("/api/posts")
        .then(response => response.json())
        .then(result => {
            outputPosts(result, postsContainer);
        })
        .catch(error => {
            console.log(error)
        })
}

function outputPosts (results, container) {
    container.innerHTML = "";

    results.forEach((result) => {
        const safeResult = JSON.parse(JSON.stringify(result));
        const html = createPostHtml(safeResult);
        container.insertAdjacentHTML("beforeend", html);
    });
}