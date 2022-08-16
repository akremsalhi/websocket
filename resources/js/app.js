import "./bootstrap";

Echo.channel(`channel-messages`).listen("MessageCreatedEvent", (e) => {
    createMessage(e.data);
});
Echo.channel(`channel-user`).listen("UserJoinEvent", (e) => {
    createUser(e.id);
});

const textInput = document.querySelector("#text-msg");
const btn = document.querySelector("#btn");
const error = document.querySelector("#error");
const messagesList = document.querySelector("#messages");
const usersList = document.querySelector("#users");
const currentIdElem = document.querySelector("#id");

const currentUserId = currentIdElem.value;

function senMessage(e) {
    e.preventDefault();
    const body = { message: textInput.value, from: currentUserId };

    error.classList.add("hidden");
    error.classList.remove("block");
    error.textContent = "";

    jsonFetch("/api/store", {
        method: "POST",
        body,
        headers: {
            "X-Socket-ID": Echo.socketId(),
        },
    })
        .then(({ data }) => {
            createMessage(data);

            textInput.value = "";
        })
        .catch((error) => {
            displayErrorMessage(error?.errors?.message[0] ?? "");
        });
}

function handleKeyUp(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        senMessage(e);
    }
}

function displayErrorMessage(value) {
    error.textContent = value;
    error.classList.remove("hidden");
    error.classList.add("block");
}

function createMessage({ message, from }) {
    const newMessage = document.createElement("li");

    newMessage.classList.add(
        ...`px-3 py-2 ${
            from === currentUserId ? "bg-indigo-600" : "bg-slate-300"
        } rounded-xl`.split(" ")
    );
    newMessage.textContent = `User (${from}) : ${message}`;

    messagesList.appendChild(newMessage);
}

function createUser(id) {
    const newUser = document.createElement("div");

    newUser.classList.add(
        ..."bg-white rounded-lg p-4 w-96 shadow-md".split(" ")
    );
    newUser.textContent = `User (${id})`;

    usersList.appendChild(newUser);
}

function jsonFetch(url, options) {
    const DEFAULT_OPTIONS = {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    };

    options.body = JSON.stringify(options.body);
    return fetch(url, {
        ...DEFAULT_OPTIONS,
        ...options,
        headers: {
            ...DEFAULT_OPTIONS.headers,
            ...options.headers,
        },
    }).then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
    });
}

btn.addEventListener("click", senMessage);
textInput.addEventListener("keyup", handleKeyUp);
