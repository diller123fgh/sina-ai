import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const MODEL = "gemma3:1b"; // اگر qwen2.5:3b نصب کردی، این را تغییر بده.

let history = [];

const SYSTEM_PROMPT = `
تو Sina AI هستی.

قوانین:

- فقط فارسی صحبت کن.
- اگر کاربر انگلیسی نوشت، انگلیسی جواب بده.
- عربی ننویس.
- مودب باش.
- اگر جواب را نمی‌دانی بگو نمی‌دانم.
- اگر سؤال برنامه‌نویسی بود کد کامل بنویس.
`;

app.post("/chat", async (req, res) => {

    try {

        const { message } = req.body;

        history.push({
            role: "user",
            content: message
        });

        const response = await fetch(
            "http://127.0.0.1:11434/api/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({

                    model: MODEL,

                    stream: false,

                    messages: [

                        {
                            role: "system",
                            content: SYSTEM_PROMPT
                        },

                        ...history

                    ]

                })
            }
        );

        if (!response.ok) {

            throw new Error("Ollama Error");

        }

        const data = await response.json();

        const reply =
            data.message?.content ||
            "متأسفم، پاسخی دریافت نشد.";

        history.push({
            role: "assistant",
            content: reply
        });

        // فقط 20 پیام آخر نگه داشته شود
        if (history.length > 20) {

            history = history.slice(-20);

        }

        res.json({
            reply
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            reply: "❌ ارتباط با Ollama برقرار نشد."
        });

    }

});

app.get("/", (req, res) => {

    res.send("Sina AI Server Running 🚀");

});

app.listen(3000, () => {

    console.log("🚀 Sina AI Server Started");
    console.log("🌐 http://localhost:3000");

});