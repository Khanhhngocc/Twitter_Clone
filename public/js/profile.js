document.addEventListener("DOMContentLoaded", (e) => {
    const postsContainer = document.querySelector(".postsContainer");
    if(postsContainer){
        if(selectedTab === "replies") {
            fetch(`/api/posts?postedBy=${profileUserId}&isReply=true`, {
                method: "GET"
            })
            .then(response => response.json())
            .then(result => outputPosts(result, postsContainer))
        } else {
            fetch(`/api/posts?postedBy=${profileUserId}&isReply=false`, {
                method: "GET"
            })
            .then(response => response.json())
            .then(result => outputPosts(result, postsContainer))
        }
    }

    const resultsContainer = document.querySelector(".resultsContainer");
    if(resultsContainer) {
        if(selectedTab === "following"){
            fetch(`/api/users/${profileUserId}/following`, {
                method: "GET"
            })
            .then(response => response.json())
            .then(results => outputUsers(results.following, resultsContainer))
        } else {
            fetch(`/api/users/${profileUserId}/followers`, {
                method: "GET"
            })
            .then(response => response.json())
            .then(results => outputUsers(results.followers, resultsContainer))
        }
    }


function outputUsers (results, container) {
    container.innerHTML = "";

    if(!Array.isArray(results)) {
        results = [results];
    }

    results.forEach(result => {
        const html = createUserHtml(result, true);
        container.insertAdjacentHTML("beforeend", html)
    })

    if(results.length == 0) {
        const span = '<span class="noResults">No results to show</span>'
        container.insertAdjacentHTML("beforeend", span);
    }
}

function createUserHtml(userData, showFollowButton) {

    let name = userData.firstName + " " + userData.lastName;
    let isFollowing = userLoggedIn.following && userLoggedIn.following.includes(userData._id);
    let text = isFollowing ? "Following" : "Follow"
    let buttonClass = isFollowing ? "followButton following" : "followButton"

    let followButton = ""
    if(showFollowButton && userLoggedIn._id != userData._id){
        followButton =  `<div class='followButtonContainer'>
                            <button class='${buttonClass}' data-user='${userData._id}'>${text}</button>
                        </div>`
    }

    return `<div class='user'>
                <div class='userImageContainer'>
                    <img src='${userData.profilePic}' />
                </div>
                <div class='userDetailsContainer'>
                    <div class='header'>
                        <a href='/profile/${userData.userName}'>${name}</a>
                        <span class='username'>@${userData.userName}</span>
                    </div>
                </div>
                ${followButton}
            </div>`
}