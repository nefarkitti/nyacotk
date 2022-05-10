let hidePost = {}

function toggleHide(hideshow, threadposts, responses) {
    const hideButton = document.getElementById(hideshow);
    const threadAll = document.getElementById(threadposts);
    if (!hideButton) throw new Error("Hide Button not found")
    if (!threadAll) throw new Error("Post not found")
    if (typeof hidePost[threadposts] == "undefined") {
        hidePost[threadposts] = true;
    }
    hidePost[threadposts] = !hidePost[threadposts];
    hideButton.innerText = (hidePost[threadposts]) ? responses[1] : responses[0];
    threadAll.hidden = (!hidePost[threadposts])
}

function toggleCreation() {
    const startThread = document.getElementById("startThreadText");
    const creationForm = document.getElementById("creation-form")
    if (!startThread) throw new Error("Text not found")
    if (!creationForm) throw new Error("Creation Form not found")
    startThread.hidden = true;
    creationForm.hidden = false;
}

function escapeHTML(str){
    return new Option(str).innerHTML;
}

// totally not copied from khajiit
function parseMarkdown(msg) { // https://www.bigomega.dev/markdown-parser/
    // Parse messages with markdown, and return the HTML
    // This is a modified version of the one from https://www.bigomega.dev/markdown-parser/
    // You can use ** for bold, _ for italic, and ` for code
    let messages = msg.split(" ")
    let htmlText = messages.map(msg => msg
        .replace(/\&gt;\&gt;(.*)/gim, '<a href="#post-:specialnyacosodaofferat<><>today!alsohikart!!$1">&gt;&gt;$1</a>')).join(" ")


    htmlText = htmlText.replaceAll(/^\|\|(.*?)\|\|/gim, '<span class="spoiler">$1</span>')
    return htmlText.trim();


    /*
    let messages = msg.split("")
    const htmlText = messages.map(msg => msg
        .replace(/^\|\|(.*)\|\|$/gim, '<span class="spoiler">$1</span>')
        .replace(/\&gt;\&gt;(.*)/gim, '<a href="#post-:specialnyacosodaofferat<><>today!alsohikart!!$1">&gt;&gt;$1</a>')).join(" ")
    return htmlText.trim()*/

    
}

function boardinit(boardpage) {
const title = document.getElementById("title");
if (!title) throw new Error("Title not found");

console.log("hello world!")




// Board Data stuff, will get it through axios request thikng
async function init(name) {
    const createPost = document.getElementById("createPost");
    if (createPost) {
        const urlCheck = document.getElementById("post-url")
        const imgPreview = document.getElementById("imgpreviewchange")
        urlCheck.onchange = function () {
            if (urlCheck.value.length && (urlCheck.value.startsWith("http://") || urlCheck.value.startsWith("https://"))) {
                //imgPreview.src = `${URL}/external?url=${encodeURIComponent(urlCheck.value)}`;;
		// too much requests loll glitch doesnt like that
		imgPreview.src = `https://external-content.duckduckgo.com/iu/?u=${encodeURIComponent(urlCheck.value)}`
		// yeah i think duckduckgo wont mind that too much
            }
        }


        createPost.addEventListener('submit', async event => {
            event.preventDefault();
            const errorText = document.getElementById("errorText");
            const subject = document.getElementById("post-subject").value;
            const comment = document.getElementById("post-comment").value;
            const isReply = document.getElementById("isReply").value;
            const replyTo = document.getElementById("replyTo").value;
            
            const file = document.getElementById("post-url").value;
            try {
                const session = localStorage.getItem("kartissus")
                const response = await axios({
                    url: `${URL}/boards/${(isReply == "false") ? name : `${parseInt(replyTo)}/post`}`,
                    method: "POST",
                    headers: {
                        "authorization": session
                    },
                    data: {
                        subject,
                        content: comment,
                        file,
                        board: name
                    }
                });
                if (response.status === 200) window.location.reload();
            } catch (error) {
                console.error(error);
                errorText.innerText = error.response.data;
            }
        })
    }


    const mainBoard = document.getElementById("board");
    if (!mainBoard) throw new Exception("G O N E") // finally racism is solved (wait what)
    try {
        const session = localStorage.getItem("kartissus")
        const req = await axios({
            url: `${URL}/boards/${name}?page=1`,
            method: "GET",
            headers: {
                "authorization": session
            }
        });
        const board = req.data;
        /*
const board = {
    name: "/gen/",
    threads: [{
        id: 1, // also thread ID as well
        user: {
            name: "Anonymous",
            id: "c0p3Am41d"
        },
        date: "12/03/2022 19:44",
        content: ">be me",
        file: null,
        replies: [{
            id: 2,
            user: {
                name: "Anonymous",
                id: "c0p3Am42d"
            },
            date: "12/03/2022 20:45",
            content: ">be me\ni dont know if this was a good idea or a bad one\n||this is a spoiler",
            file: null
        }, {
            id: 3,
            user: {
                name: "Anonymous",
                id: "c0p3Am42d"
            },
            date: "12/04/2022 00:64",
            content: ">be me\n>>nyaco.tk frontend dev\n>start work on the frontend\n>things are going good\n>wait\n>this is just the front page\n>yeshoney.jpg\ni dont know if this was a good idea or a bad one",
            file: "https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg"
        }]
    }]
}*/
        board.threads.forEach(thread => {
            // we do a LIL too much trolling
            const threadDiv = document.createElement("div");
            threadDiv.classList.add("thread");
            // Button
            const hideShowButton = document.createElement("button");
            hideShowButton.id = `hideshow-${thread.id}`;
            hideShowButton.onclick = function () {
                toggleHide(`hideshow-${thread.id}`, `thread-posts-${thread.id}`, ["show", "hide"]);
            };
            hideShowButton.classList.add("hideshow");
            hideShowButton.innerText = "hide";
        
            // Posts div
            const postsDiv = document.createElement("div");
            postsDiv.id = 'thread-posts-' + thread.id;
        
            threadDiv.appendChild(hideShowButton);
            // posts
            const postDiv = generatePost(thread, false);
            //threadDiv.appendChild(postDiv);
            postsDiv.appendChild(postDiv);

            const fewReplies = document.createElement("div");
            const mostReplies = document.createElement("div");

            thread.replies.forEach(reply => {
                const replyDiv = generatePost(reply, true, thread.replies.indexOf(reply));
                //replyDiv.style.clear = "left"
                const index = thread.replies.indexOf(reply);
                if (index < 4) fewReplies.appendChild(replyDiv);
                else mostReplies.appendChild(replyDiv);
                //threadDiv.appendChild(replyDiv);
            })
            mostReplies.id = `reply-more-${thread.id}`;
            const hideShowReplies = document.createElement("button");
            hideShowReplies.id = `hs-replies-${thread.id}`;
            mostReplies.hidden = true;
            hideShowReplies.onclick = function () {
                toggleHide(`hs-replies-${thread.id}`, `reply-more-${thread.id}`, ["show all comments", "hide fewer comments"]);
            };
            hidePost[`reply-more-${thread.id}`] = false;
            hideShowReplies.classList.add("hideshow");
            hideShowReplies.innerText = "show all comments";
            hideShowReplies.style.clear = "left";
            if (thread.replies.length) {
                postsDiv.appendChild(fewReplies);
                if (thread.replies.length > 4) {
                    postsDiv.appendChild(mostReplies);
                }
                postsDiv.appendChild(hideShowReplies);
            }
            threadDiv.appendChild(postsDiv);
            threadDiv.appendChild(document.createElement("hr"));
            
            
            mainBoard.appendChild(threadDiv);
            
            /*
        <div class="thread">
                    <button id="hideshow" onClick="toggleHide('thread-posts-somerandomid');" class="hideshow">hide</button>
                    <div id="thread-posts-somerandomid">
                        <div class="thread-info" hidden>File: <a href="https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg">https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg</a> (33.2KB, 591x512)</div>
                        <div class="thread-file"><img src="https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg" width="160" hidden></div>
                        <div class="thread-contents">
                            <div class="thread-op-info"><b>nyaco.tk <span style="color:green;">Anonymous</span></b> c0p3&m41d | <a href="">1</a> (12/03/2022 19:44) <a>[reply]</a></div>
                            <div class="thread-text">
                                <p>
                                    <font style="color:purple;">
                                        &gt;be me<br>
                                    </font>
                                </p>
                                <button>show all comments</button>
                            </div>
                        </div>
                        <div class="thread-reply">
                            <div class="thread-reply-contents">
                                <div class="thread-info" hidden>File: <a href="https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg">https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg</a> (33.2KB, 591x512)</div>
                                <div class="thread-file" hidden><img src="https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg" width="160" hidden></div>
                                <div class="thread-contents">
                                    <div class="thread-op-info"><b><span style="color:green;">Anonymous</span></b> c0p3&m41d | <a href="">2</a> (12/03/2022 19:44)</div>
                                    <div class="thread-text">
                                        <p>
                                            <font style="color:purple;">
                                                &gt;be me<br>
                                            </font>
                                            i dont know if this was a good idea or a bad one<br>
                                            <span class="spoiler">this is a spoiler</span><br>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="thread-reply" style="clear:left;">
                            <div class="thread-reply-contents">
                                <div class="thread-info" >File: <a href="https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg">https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg</a> (33.2KB, 591x512)</div>
                                <div class="thread-file"><img src="https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg" width="160" ></div>
                                <div class="thread-contents">
                                    <div class="thread-op-info"><b><span style="color:green;">Anonymous</span></b> c0p3&m41d | <a href="">3</a> (12/03/2022 19:44)</div>
                                    <div class="thread-text">
                                        <p>
                                            <font style="color:purple;">
                                                &gt;be me<br>
                                                &gt;nyaco.tk frontend dev<br>
                                                &gt;start work on the frontend<br>
                                                &gt;things are going good<br>
                                                &gt;wait<br>
                                                &gt;this is just the front page<br>
                                                &gt;yeshoney.jpg<br>
                                            </font>
                                            i dont know if this was a good idea or a bad one<br>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            */
        })
        //mainBoard.appendChild(document.createElement("hr"))
    } catch (error) {
        if (error.response && error.response.status === 401) {
            window.location.href = "/";
        }
        console.log(error);
    }
}

init(boardpage);


function generatePost(post, isReply, index) {
    /*
<div class="thread-info" hidden>File: <a href="https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg">https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg</a> (33.2KB, 591x512)</div>
						<div class="thread-file" hidden><img src="https://pbs.twimg.com/media/EXFXCnWXkAEZKDQ.jpg" width="160" hidden></div>
						<div class="thread-contents">
							<div class="thread-op-info"><b><span style="color:green;">Anonymous</span></b> c0p3&m41d | <a href="">2</a> (12/03/2022 19:44)</div>
							<div class="thread-text">
								<p>
									<font style="color:purple;">
										&gt;be me<br>
									</font>
									i dont know if this was a good idea or a bad one<br>
									<span class="spoiler">this is a spoiler</span><br>
								</p>
							</div>
						</div>
    */
    const div = document.createElement("div");
    if (isReply) {
        div.classList.add("thread-reply")
        if (index == 0) {
            div.style.float = "inherit";
            div.style.display = "table";
            
        } else {
            div.style.clear = "left"
        }
    }
    
    if (post.file != null) {
        const img = document.createElement("img");
        //img.src = `${URL}/external?url=${encodeURIComponent(post.file)}`;
        img.src = `https://external-content.duckduckgo.com/iu/?u=${encodeURIComponent(post.file)}`
	    if (["https://cdn.upload.systems","https://i.upload.systems"].filter(x=>post.file.startsWith(x)).length) {
            img.src = post.file;
        }
        img.loading = "lazy"; // performance gain
        img.alt = "Image Loading...";
        
        const { width, height } = img;
        console.log(width, height);

        img.onerror = function () {
            img.hidden = true;
        };

        img.onload = function () {
            img.width = 160
        }
          

        const threadInfo = document.createElement("div");
        threadInfo.classList.add("thread-info");
        const t1 = document.createElement("span");
        t1.innerText = "File: ";
        const t2 = document.createElement("span");
        t2.innerText = ` (${width}x${height})`;
        const link = document.createElement("a");
        link.href = post.file;
        link.innerText = (post.file && post.file.length) && (post.file.length > 142) ? post.file.substring(0, 142) + "..." : post.file;
        threadInfo.appendChild(t1);
        threadInfo.appendChild(link);
        threadInfo.appendChild(t2);
        div.appendChild(threadInfo)

        const threadFile = document.createElement("div");
        threadFile.classList.add("thread-file");
        threadFile.appendChild(img);
        div.appendChild(threadFile);
    }
    const threadContents = document.createElement("div");
    threadContents.classList.add("thread-contents");

    const opInfo = document.createElement("div");
    opInfo.classList.add("thread-op-info");
    const b1 = document.createElement("b");
    const span0 = document.createElement("span");
    span0.innerText = post.title + " ";
    const span1 = document.createElement("span");
    span1.style.color = "green";
    span1.innerText = post.user.name;
    b1.appendChild(span0);
    b1.appendChild(span1);

    opInfo.appendChild(b1);

    const id = document.createElement("span");
    id.innerText = ` ${post.user.id} | `;

    opInfo.appendChild(id);

    const clickableID = document.createElement("a");
    clickableID.innerText = `${post.id}${isReply ? " (reply)" : ""}`;
    clickableID.href="#createPost"
    clickableID.onclick = function() {
        toggleCreation();
        const form = document.getElementById("createPost");
        form.hidden = false;
        document.getElementById("post-comment").value = `>>${post.id}`;
        document.getElementById("isReply").value = true;
        document.getElementById("replyTo").value = post.id;
    }


    opInfo.appendChild(clickableID);

    const date = document.createElement("span");
    date.innerText = ` (${post.date})`;

    opInfo.appendChild(date);

    threadContents.appendChild(opInfo);

    const threadText = document.createElement("div");
    threadText.classList.add("thread-text");
/*
    if (isReply) {
        const gotoReply = document.createElement("a");
        gotoReply.innerText = `>>${post.replyTo}`;
        gotoReply.href = `#post-${post.replyTo}`;
        threadText.appendChild(gotoReply);
    }*/

    const content = document.createElement("p");
    const text = post.content.split("\n")
    for (let i = 0; i < text.length; i++) {
        // implementing markdown
        //<span class="spoiler">this is a spoiler</span><br>
        const line = text[i];
        /*if (line.startsWith(">>")) {
            
        } else */if (line.startsWith(">") && !line.startsWith(">>")) {
            // turning text to purple
            const span = document.createElement("span");
            span.style.color = "purple";
            span.innerText = line;
            content.appendChild(span);
            content.appendChild(document.createElement("br"));
        } else {
            /*
            // create an a tag which links to the post
            console.log(spaces)
            if (tagPost.length) {
                // create an a tag which links to the post
                const a = document.createElement("a");
                a.href = `#post-${tagPost[0].substring(2)}`;
                a.innerText = tagPost[0];
                content.appendChild(a);
            } else {
                const span = document.createElement("span");
                span.innerText = line;
                content.appendChild(span);
            }*/
            //parseMarkdown(escapeHTML(content.content))
            const span = document.createElement("span");
            span.innerHTML = parseMarkdown(escapeHTML(line))
            
            // Use .replaceAll on span to replace :specialnyacosodaofferat<><>today!alsohikart!! with the linked post ID
            span.innerHTML = span.innerHTML.replaceAll(":specialnyacosodaofferat<><>today!alsohikart!!", "")

            //.replace(":specialnyacosodaofferat<><>today!alsohikart!!");
            content.appendChild(span);
            content.appendChild(document.createElement("br"));
        }
        
    }

    // ill do the highlighting later
    //content.innerText = post.content;

    threadText.appendChild(content);
    threadContents.id = `post-${post.id}`;
    threadContents.appendChild(threadText);

    const hr = document.createElement("hr");


    div.appendChild(threadContents);
    //div.appendChild(hr);

    return div;
    //<span style="color:green;">Anonymous</span></b> c0p3&m41d | <a href="">2</a> (12/03/2022 19:44)
}
// silly
}