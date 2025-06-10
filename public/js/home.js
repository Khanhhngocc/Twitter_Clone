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
