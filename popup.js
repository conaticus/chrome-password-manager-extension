const clearPasswordsBtn = document.getElementById("clear-passwords-btn");
let passwordsDiv = document.getElementById("passwords-div");

clearPasswordsBtn.addEventListener("click", () => {
    chrome.storage.sync.set({ passwords: [] });
    passwordsDiv.remove();
    passwordsDiv = document.createElement("div");
    document.body.appendChild(passwordsDiv);
})

const getUrls = async () => {
    const { passwords } = await chrome.storage.sync.get("passwords");
    passwords.forEach(password => {
        const linkEl = document.createElement("a");
        linkEl.href = password.url;
        linkEl.innerText = password.url;
        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";

        passwordsDiv.appendChild(linkEl);
        passwordsDiv.appendChild(deleteBtn);
        
        deleteBtn.addEventListener("click", () => {
            const updatedPasswords = passwords.filter(pwd => pwd !== password);
            chrome.storage.sync.set({ passwords: updatedPasswords });

            linkEl.remove();
            deleteBtn.remove();            
        })
    })
}

getUrls();