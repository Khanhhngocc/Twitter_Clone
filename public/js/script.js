const postFormContainer = document.querySelector(".postFormContainer");
if(postFormContainer) {
    const postTextarea = document.querySelector("#postTextarea");
    const submitPostButton = document.querySelector("#submitPostButton");

    postTextarea.addEventListener("keyup", (e) => {
        const value = e.target.value.trim();

        if(value == ""){
            submitPostButton.disabled = true;
            return;
        } 
        
        submitPostButton.disabled = false;
        
    })
    submitPostButton.addEventListener("click", async(e) => {
        const postsContainer = document.querySelector(".postsContainer");

        let data = {
            content: postTextarea.value.trim()
        }

        try {
            const response = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const postsData = await response.json();

            const html = createPostHtml(postsData);
            // postsContainer.prepend(html); Nhưng prepend() trong JavaScript thuần không hoạt động giống jQuery.prepend() nếu bạn đưa vào string.
            // và nó sẽ hiểu đó là HTML, parse nó thành DOM element và gắn vào.Nhưng trong JavaScript thuần, nếu bạn làm: thì nó sẽ gắn như một TextNode, không phải HTML thực sự — nên bạn thấy <div>abc</div> hiện ra đúng như văn bản!

            postsContainer.insertAdjacentHTML("afterbegin", html); //*** explain */
            postTextarea.value = "";
            submitPostButton.disabled = true;
            
        } catch (error) {
            console.log(error)
        }
    })
}

function createPostHtml(postData) {
    const postedBy = postData.postedBy;

    if(postedBy._id === undefined) {
        console.log("User object not populated");
    }
    const displayName = postedBy.firstName + " " + postedBy.lastName;
    const timestamp = timeDifference(new Date(), new Date(postData.createdAt)); //Tại sao phải truyền new Date(postedBy.createdAt) mà không phải postedBy.createdAt?

    return `<div class='post'>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}'/>
                    </div>
                    <div class='postContentContainer'>
                        <div class='postHeader'>
                            <a href='/profile/${postedBy.userName}' class='displayName'>${displayName}</a>
                            <span class='username'>@${postedBy.userName}</span>
                            <span class='date'>${timestamp}</span>
                        </div>
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                            <div class='postButtonContainer'>
                                <button>
                                    <i class='fa fa-comment'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer'>
                                <button>
                                    <i class='fa fa-retweet'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer'>
                                <button>
                                    <i class='fa fa-heart'></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if(elapsed / 1000 < 30) return "Just now"

        return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
        return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}