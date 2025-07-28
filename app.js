

const supabaseUrl = "https://xtjuukzhvksfolnjwvzr.supabase.co"

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0anV1a3podmtzZm9sbmp3dnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0Mzk5NTcsImV4cCI6MjA2NzAxNTk1N30.6CUBA7UDHtJ5md2ci1NKJ-40wGBp-oV803es5_pUCs4"


const { createClient } = supabase;
let merg = createClient(supabaseUrl, supabaseKey);
console.log(merg);

let useremail = document.querySelector(".useremail")

let userpass = document.querySelector(".userpass")
let signbtn = document.querySelector(".signbtn")
let fullName = document.querySelector(".fulname")

signbtn && signbtn.addEventListener("click", async () => {

    if (useremail && userpass) {
        try {
            const { data, error } = await merg.auth.signUp({
                email: useremail.value,
                password: userpass.value,
                options: {
                    full_name: fullName.value,
                }
            })
            console.log(data);
            // window.location.href ="post.html"
            if (error.message.includes("Unable to validate email address: invalid format")) {
                alert("Incorrect Email Format")
            } else if (error.message.includes('Invalid login credentials')) {
                alert('Incorrect credentials');

            } else {
                alert("Sign up successful! Check your email for verification link.");
                window.location.href = "post.html"; // Uncomment if redirect needed
                // window.location.href = "login.html"
            }
        } catch {
            console.log(error?.message);
            alert("Something went wrong: " + error.message);
        }

    } else {
        alert("please fill the field")
    }

})

// logout buttton 
let logoutbtn = document.querySelector(".logoutbtn")
logoutbtn && logoutbtn.addEventListener("click", async () => {
    try {
        const { error } = await merg.auth.signOut();
        if (error) throw error
        window.location.href = "index.html"

    } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed');


    }
})

// continue with google
let google = document.querySelector(".goobtn")

google && google.addEventListener("click", async () => {
    try {
        let redirect = window.location.hostname === "127.0.0.1"
            ? window.location.origin + "/post.html"
            : window.location.origin + "/signup-login/post.html"

        const { error } = await merg.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirect,
                queryParams: { access_type: 'offline', prompt: 'consent' },
            },
        });
        if (error) throw error
    } catch (error) {
        console.log("Google error", error);
        alert(error.message || "Google login error")
    }
})

// profile sec
async function disProf() {
    try {
        const { data: { user }, error, } = await merg.auth.getUser();
        console.log(user);
        if (error) throw error
        if (user) {
            if (document.querySelector(".prof-avatar")) {
                document.querySelector(".prof-avatar").src = user.user_metadata?.avatar_url || 'https://www.gravatar.com/avatar/?d=mp'
                document.querySelector(".user-name").textContent = user.user_metadata?.full_name || user.email
                document.querySelector(".user-email").textContent = user.email
                if (window.location.pathname.includes("index.html")) {
                    window.location.href = "post.html"
                } else if (!window.location.pathname.includes("index.html") && window.location.pathname.includes("login.html")) {
                    window.location.href = "index.html"
                }
            }
        }
    } catch (error) {
        console.log("error", error);

        if (!window.location.pathname.includes("index.html") && window.location.pathname.includes("login.html")) {
            window.location.href = "index.html"
        }
    }
}

// returning Google redirect
document.addEventListener("DOMContentLoaded", async () => {
    if (window.location.href.includes("access_token")) {

        const { data: { session }, } = await merg.auth.getSession();
        if (session) {
            window.location.href = "post.html"
        }
        if (!window.location.pathname.includes("index.html") && window.location.pathname.includes("login.html")) {
            window.location.href = "index.html"
            // disProf()
        }
    }
    disProf()
})


// add post 
let submitPost = document.querySelector(".submitPost")

submitPost && submitPost.addEventListener("click", async () => {

    let userTitt = document.getElementById("post-title").value.trim()
    let userDes = document.getElementById("post-desc").value.trim()

    // console.log(posTitt, posDes);
    try {
        const { data: { user } } = await merg.auth.getUser();
        console.log(user.id);

        const { data, error } = await merg.from('post').insert([
            {
                uid: user.id,
                tittle: userTitt,
                description: userDes
            },
        ])
        if (data) {
            alert("posy successdully createf")
            window.location.href = "my-blog.html"
        }
        else {
            console.log(error.message);

            document.getElementById("post-title").value = '';
            document.getElementById("post-desc").value = '';
        }
    }
    catch (error) {
        // console.log(error?.message);

    }
})

// read all post



if (window.location.pathname == "/all-blog.html") {

    if (window.location.pathname.includes("my-blog.html")) {
        document.querySelector(".myblog")?.classList.add("active");
    } else if (window.location.pathname.includes("all-blog.html")) {
        document.querySelector(".allblog")?.classList.add("active");
    }
    try {
        const readAllPso = async () => {
            const { data, error } = await merg.from('post').select();
            if (data) {
                console.log(data);
                const box = document.querySelector("#container")
                box.innerHTML = data.map(({ id, tittle, description }) => {
                    console.log(tittle, description);

                    return (`
                        <div id='${id}' class="card " style="width: 18rem;">
                        <div class="card-body ">
                            <h5 class="card-title">${tittle}</h5>
                            <p class="card-text">${description}</p>
                        </div>


                        </div>`)
                }).join("")

            } else {
                console.log(error);

            }
        }
        readAllPso()
    } catch (error) {
        console.log(error.message);

    }
}
// const current = document.getElementById('current');
// current.style.textDecoration.remove() = 'underline red';

// my all post
const myPost = async () => {
    // document.addEventListener("DOMContentLoaded", () => {
    //     if (window.location.pathname.includes("my-blog.html")) {
    //         document.querySelector(".myblog")?.classList.add("active");
    //     } else if (window.location.pathname.includes("all-blog.html")) {
    //         document.querySelector(".allblog")?.classList.add("active");
    //     }
    // })

    const { data: { user } } = await merg.auth.getUser();
    const { data, error } = await merg
        .from('post')
        .select()
        .eq("uid", user.id)
    if (data) {
        console.log(data);

        let myAllPost = document.querySelector("#myallPost")
        myAllPost.innerHTML = data.map(({ id, tittle, description }) => {

            console.log(tittle, description);

            return (`<div id='${id}' class="card  card1" style="width: 18rem   background: #3d629bff; ; ">
                        <div class="card-body">
                            <h5 class="card-title">${tittle}</h5>
                            <p class="card-text">${description}</p>
                        </div>

                        <div>
                            <button class="delbtn" onclick="deletePost('${id}','${tittle}','${description}')">Delete</button>
                              <button class="editbtn" onclick="edit('${id}')">Edit</button>
                          </div>
                    </div>`)
        })

    } else {
        console.log(error);

    }
}
myPost()

if (window.location.pathname == "/my-blog.html") {
    const current = document.getElementById('active');
    current.style.textDecoration = 'underline red';
    try {
        myPost()
    } catch (error) {
        console.log(error);
    }
}

// if (window.location.pathname.includes("my-blog.html")){
//     document.getElementById("active").classList.add("active")
// }else if(window.location.pathname.includes("all-blog.html")){
//      document.getElementById("current").classList.add("current")
// }

// delete button

async function deletePost(postId) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const { error } = await merg
                    .from('post')
                    .delete()
                    .eq('id', postId)

                if (error) {
                    console.log(error.message);
                    Swal.fire("Error", "Failed to delete post", "error");
                } else {
                    swalWithBootstrapButtons.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                    myPost(); // Refresh posts
                }
            } catch (error) {
                console.log("Delete Error:", error.message);
                Swal.fire("Error", "Something went wrong", "error");
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
                title: "Cancelled",
                text: "Your post has not be deleted",
                icon: "error"
            });
        }
    });
}




// update post edit


async function edit(postId, postTitle, postDescription) {
    const { value: formValues } = await Swal.fire({
        title: 'Update post',
        html: `
    <label > post title
	<input id="swal-input1" class="swal1-input"  value = '${postTitle}' ></label>
    <label > post description
	<input id="swal-input2" class="swal2-input" style="margin: 0 !important;"   value = '${postDescription}' ></label>
  `,
        focusConfirm: false,
        preConfirm: () => {
            return [document.getElementById('swal-input1').value,
            document.getElementById('swal-input2').value];
        },
    });
    try {
        if (formValues) {

            // console.log(formValues);

            const [updattittle, updatdesc] = formValues
            const { error } = await merg
                .from('post')
                .update({ tittle: updattittle, description: updatdesc })
                .eq('id', postId);

            if (error) {
                console.log(error);
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'your post has been updated',
                    confirmButtonColor: '#125b9a',
                });
                readMyPosts();
            }
        }

    } catch (error) {
        console.log(error);

    }
}



