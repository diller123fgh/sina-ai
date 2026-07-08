const chatBox = document.getElementById("chatBox");
const promptInput = document.getElementById("prompt");
const sendBtn = document.getElementById("send");
const newChatBtn = document.getElementById("newChat");


function createMessage(text, sender) {

    const message = document.createElement("div");
    message.className = `message ${sender}`;


    if (sender === "bot") {

        const avatar = document.createElement("div");
        avatar.className = "avatar";
        avatar.textContent = "🤖";


        const bubble = document.createElement("div");
        bubble.className = "bubble";
        bubble.textContent = text;


        message.appendChild(avatar);
        message.appendChild(bubble);

        chatBox.appendChild(message);

        chatBox.scrollTop = chatBox.scrollHeight;

        return bubble;

    }


    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;


    message.appendChild(bubble);

    chatBox.appendChild(message);

    chatBox.scrollTop = chatBox.scrollHeight;

    return bubble;

}



async function sendMessage() {

    const text = promptInput.value.trim();

    if (!text) return;


    createMessage(text, "user");

    promptInput.value = "";


    const loading = createMessage(
    "🤖",
    "bot"
);

loading.innerHTML = `
<div class="typing">
<span></span>
<span></span>
<span></span>
</div>
`;


    try {


        const response = await fetch(
            "http://localhost:3000/chat",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    message:text
                })
            }
        );


        if(!response.ok){

            throw new Error("Server Error");

        }


        const data = await response.json();


        loading.textContent = "";


        const words = data.reply.split(" ");

        let index = 0;


        const timer = setInterval(()=>{


            if(index >= words.length){

                clearInterval(timer);

                return;

            }


            loading.textContent += words[index] + " ";

            chatBox.scrollTop = chatBox.scrollHeight;

            index++;


        },30);



    }catch(err){


        loading.textContent =
        "❌ ارتباط با سرور برقرار نشد.";

        console.error(err);

    }

}




sendBtn.addEventListener(
    "click",
    sendMessage
);



promptInput.addEventListener(
    "keydown",
    function(e){

        if(e.key === "Enter"){

            sendMessage();

        }

    }
);



newChatBtn.addEventListener(
    "click",
    function(){

        chatBox.innerHTML = "";

        createMessage(
            "👋 خوش اومدی\n\nهر سوالی داری بپرس.",
            "bot"
        );

    }
);



window.onload = function(){

    chatBox.innerHTML = "";

    createMessage(
        "👋 خوش اومدی\n\nهر سوالی داری بپرس.",
        "bot"
    );

};



// حالت تاریک و روشن 🌙

const themeBtn = document.getElementById("theme");


if(themeBtn){

    themeBtn.addEventListener(
        "click",
        ()=>{


            document.body.classList.toggle("light");


            if(document.body.classList.contains("light")){

                themeBtn.innerHTML="☀️";

                localStorage.setItem(
                    "theme",
                    "light"
                );

            }else{

                themeBtn.innerHTML="🌙";

                localStorage.setItem(
                    "theme",
                    "dark"
                );

            }

        }
    );



    if(localStorage.getItem("theme") === "light"){

        document.body.classList.add("light");

        themeBtn.innerHTML="☀️";

    }

}