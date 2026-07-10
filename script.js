const chatBox = document.getElementById("chatBox");
const promptInput = document.getElementById("prompt");
const sendBtn = document.getElementById("send");
const newChatBtn = document.getElementById("newChat");
const themeBtn = document.getElementById("theme");
const attachBtn = document.getElementById("attach");

const API_URL = "http://localhost:3000/chat";
// اگر بعداً سرور را آنلاین کردی فقط همین خط را عوض می‌کنیم.

function scrollBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

function createMessage(text, sender) {

    const message = document.createElement("div");
    message.className = `message ${sender}`;

    if (sender === "bot") {

        message.innerHTML = `
            <div class="avatar">🤖</div>
            <div class="bubble"></div>
        `;

        chatBox.appendChild(message);

        typeText(
            message.querySelector(".bubble"),
            text
        );

    } else {

        message.innerHTML = `
            <div class="bubble">${text}</div>
        `;

        chatBox.appendChild(message);

    }

    scrollBottom();

}

function typeText(element, text) {

    element.innerHTML = "";

    let i = 0;

    const timer = setInterval(() => {

        if (i >= text.length) {

            clearInterval(timer);

            return;

        }

        element.innerHTML += text.charAt(i);

        scrollBottom();

        i++;

    }, 15);

}

function showTyping() {

    const loading = document.createElement("div");

    loading.className = "message bot";

    loading.id = "typing";

    loading.innerHTML = `
        <div class="avatar">🤖</div>

        <div class="bubble">

            <div class="typing">

                <span></span>
                <span></span>
                <span></span>

            </div>

        </div>
    `;

    chatBox.appendChild(loading);

    scrollBottom();

}

function hideTyping() {

    const t = document.getElementById("typing");

    if (t) {

        t.remove();

    }

}

async function sendMessage() {

    const text = promptInput.value.trim();

    if (!text) return;

    createMessage(text, "user");

    promptInput.value = "";

    showTyping();

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                message: text

            })

        });

        const data = await response.json();

        hideTyping();

        createMessage(

            data.reply || "پاسخی دریافت نشد.",

            "bot"

        );

    } catch (err) {

        hideTyping();

        createMessage(

            "❌ ارتباط با سرور برقرار نشد.",

            "bot"

        );

        console.error(err);

    }

}
/* ===========================
   Events
=========================== */

sendBtn.addEventListener("click", sendMessage);

promptInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        sendMessage();

    }

});

/* ===========================
   Theme
=========================== */

if (localStorage.getItem("theme") === "light") {

    document.body.classList.add("light");

    if (themeBtn) {

        themeBtn.innerHTML = "☀️";

    }

}

if (themeBtn) {

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("light");

        if (document.body.classList.contains("light")) {

            localStorage.setItem("theme", "light");

            themeBtn.innerHTML = "☀️";

        } else {

            localStorage.setItem("theme", "dark");

            themeBtn.innerHTML = "🌙";

        }

    });

}

/* ===========================
   New Chat
=========================== */

newChatBtn.addEventListener("click", () => {

    chatBox.innerHTML = `
        <div class="welcome">

            <div class="welcome-logo">
                🤖
            </div>

            <h1>سلام 👋</h1>

            <p>
                من Sina AI هستم.
                <br>
                هر سوالی داری بپرس.
            </p>

        </div>
    `;

    localStorage.removeItem("chatHistory");

});

/* ===========================
   Save History
=========================== */

const observer = new MutationObserver(() => {

    localStorage.setItem(

        "chatHistory",

        chatBox.innerHTML

    );

});

observer.observe(chatBox, {

    childList: true,

    subtree: true

});

window.addEventListener("load", () => {

    const saved = localStorage.getItem("chatHistory");

    if (saved) {

        chatBox.innerHTML = saved;

    }

});

/* ===========================
   Attach Button
=========================== */

if (attachBtn) {

    attachBtn.addEventListener("click", () => {

        alert("📎 ارسال فایل در نسخه بعدی فعال می‌شود.");

    });

}

/* ===========================
   Auto Scroll
=========================== */

setInterval(scrollBottom, 300);

/* ===========================
   Finish
=========================== */

console.log("🚀 Sina AI v5 Ready");