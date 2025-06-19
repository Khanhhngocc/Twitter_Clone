document.addEventListener("DOMContentLoaded", () => {
    const postContainer = document.querySelector(".postContainer");

    if(postContainer) {
        fetch(`/api/posts/${postId}`, {
            method: "GET"
        })
        .then(response => response.json())
        .then(result => outputPostsWithReplies(result, postContainer))
    }
})