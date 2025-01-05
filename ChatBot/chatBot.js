const messageInput = document.querySelector(".message-input");
const chatBody = document.querySelector(".chat-body");
const sendMessageButton = document.querySelector("#send-message"); 
const fileInput = document.querySelector('#file-input');
const fileUploadWrapper = document.querySelector('.file-upload-wrapper');
const cancelFileButton = document.querySelector('#file-cancel');
const chatbotToggler = document.querySelector('#chatbot-toggle');
const closeChatbot = document.querySelector('#close-chatbot');

//API setup
// gemini api key 
const API_KEY = "use you api key";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// string the user massage in this object 
const userData = {
    message: null,
    file : {
        data : null,
        mime_type : null
    }
}

// array for storing chat history 
const chatHistory = [];

const initialInputHeight = messageInput.scrollHeight;

//create message element with dynamic classes and return it
const createMessageElement = (content , ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message" , ...classes);
    div.innerHTML = content;
    return div;
}

// generate bot responce using api 
const generateBotResponce = async (incomingMessageDiv) => {

    const messageElement = incomingMessageDiv.querySelector(".message-text")

    // add user message to chat history 
    chatHistory.push({
        role: "user",
        "parts":[{"text": userData.message } , ...(userData.file.data ? [{inline_data : userData.file}] : [])]
        });

    // api request options
    requestOption = {
        method : "POST",
        headers : { "Content-Type" :  "application/json" },
        body : JSON.stringify({
            contents : chatHistory
        })
    }

    try {
        // fetch bot responce from api 
        const responce = await fetch(API_URL , requestOption);
        const data = await responce.json();
        if(!responce.ok) throw new Error(data.error.message);

        // extract and responce bot's responce text 
        const apiResponceText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g , "$1").trim();
        messageElement.innerText = apiResponceText;

        // add bot responce for chat history 
        chatHistory.push({
            role: "model",
            "parts":[{"text": userData.message }]});

    } catch (error) {
        // handle error in API responce 
        console.log(error);
        messageElement.innerText = error.message;
        messageElement.style.color = "#ff0000";
    } finally{
        //reset user file , removing thinking indicator and scroll cchat to bottom in this finally block.
        userData.file = {}; 

        incomingMessageDiv.classList.remove("thinking");
        chatBody.scrollTo({
            top:chatBody.scrollHeight , behavior: "smooth"
        })
        
    }
}

// handle outgoin user message
const handelOutgoingMesage = (e) => {
    e.preventDefault();
    userData.message = messageInput.value.trim();
    //do empty after sending the message 
    messageInput.value = "";
    //remove file after upload
    fileUploadWrapper.classList.remove("file-uploaded");

    messageInput.dispatchEvent(new Event("input"));

    // create and diplay user message 
    const messageContent = `<div class="message-text"></div>
        ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />` : ""}`;
    
    
    const outgoingMessageDiv = createMessageElement(messageContent, "user-message")

    //  handle to send all html tags also 
    outgoingMessageDiv.querySelector('.message-text').textContent = userData.message

    chatBody.appendChild(outgoingMessageDiv);
    //to scroll down smoothly
    chatBody.scrollTo({
        top:chatBody.scrollHeight , behavior: "smooth"
    })

    //simulate bot response with thinking indicator after a delay
    setTimeout(() => {
        const messageContent = `<svg
                class="bot-avatar"
             xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
    <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
                </svg>

                <div class="message-text">
                    <div class="thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>`;
        
        const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking")

        chatBody.appendChild(incomingMessageDiv);
        chatBody.scrollTo({
            top:chatBody.scrollHeight , behavior: "smooth"
        })
        generateBotResponce(incomingMessageDiv);
    }, 600)
}

//handel enter key press for sending message
messageInput.addEventListener('keydown' , (e) => {
    const userMessage = e.target.value.trim();

    if(e.key === "Enter" && userMessage && !e.shiftKey && window.innerWidth > 768){
        handelOutgoingMesage(e);
    }
});

//adjust text area height based on the content dynamically
messageInput.addEventListener('input' , () => {
    messageInput.style.height = `${initialInputHeight}px`;
    messageInput.style.height = `${messageInput.scrollHeight}px`;

    document.querySelector('.chat-form').style.borderRadius = messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
});

sendMessageButton.addEventListener('click' , (e) => handelOutgoingMesage(e))


//handle file input change and preview the selected file
fileInput.addEventListener('change' , () => {
    const file = fileInput.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        fileUploadWrapper.querySelector("img").src = e.target.result;
        fileUploadWrapper.classList.add("file-uploaded");
        const base64string = e.target.result.split(",")[1];

        // store file data in userData
        userData.file = {
            data : base64string,
            mime_type : file.type
        }
        // userData.file.data = base64string;
        // userData.file.mime_type = file.type;

        //clear the file input to store other file
        fileInput.value = "";
        // console.log(userData)
    }

    reader.readAsDataURL(file);
})

//cancle uploaded file
cancelFileButton.addEventListener('click' , () => {
    userData.file = {};
    fileUploadWrapper.classList.remove("file-uploaded");
});

//initialize imoji picker
const picker = new EmojiMart.Picker({
    theme : "light",
    skinTonePosition : "none",
    previewPosition : "none",
    onEmojiSelect: (emoji) => {
        const { selectionStart : start , selectionEnd : end} = messageInput;
        messageInput.setRangeText(emoji.native , start , end , "end");
        messageInput.focus();
    },
    onClickOutside: (e) => {
        if(e.target.id === "emoji-picker"){
            document.body.classList.toggle("show-emoji-picker");
        } else {
            document.body.classList.remove("show-emoji-picker");
        }
    }
});

document.querySelector(".chat-form").appendChild(picker);


//click the atteched files
document.querySelector('#file-upload').addEventListener('click' , () => fileInput.click())

chatbotToggler.addEventListener('click' , () => document.body.classList.toggle("show-chatbot"));

closeChatbot.addEventListener('click' , () => {
    document.body.classList.remove("show-chatbot")
})