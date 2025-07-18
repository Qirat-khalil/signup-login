

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
                // window.location.href = "post.html"; // Uncomment if redirect needed
                window.location.href = "login.html"
            }
        } catch {
            console.log(error.message);
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
        const { error } = await merg.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/post.html',
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