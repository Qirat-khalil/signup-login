
const supabaseUrl = "https://xtjuukzhvksfolnjwvzr.supabase.co"

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0anV1a3podmtzZm9sbmp3dnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0Mzk5NTcsImV4cCI6MjA2NzAxNTk1N30.6CUBA7UDHtJ5md2ci1NKJ-40wGBp-oV803es5_pUCs4"

const { createClient } = supabase;
let merg = createClient(supabaseUrl, supabaseKey);
console.log(merg);


let logpass = document.querySelector(".logpass")
let logemail = document.querySelector(".logemail")
let logbtn = document.querySelector(".logbtn")

// login button
 
logbtn && logbtn.addEventListener("click", async () => {
    if (logemail && logpass) {
        try {
            const loader = document.getElementById("load")
            loader.style.display = "block"
            const { data, error } = await merg.auth.signInWithPassword({
                email: logemail.value,
                password: logpass.value,
            })
            if (error) {
                if (error.message.includes("Invalid login credentials")) {
                    alert("Email or Password is incorrect");
                } else {
                    alert("Something went wrong: " + error.message);
                }
                return; // stop function here if error
            }
            if (data) {
                 window.location.href ="post.html"
            }
          
        } catch(error){
            console.log(error.message);
        alert("Something went wrong: " + error.message);
            }
    }else{
        alert("please fill the field")
    }
})


