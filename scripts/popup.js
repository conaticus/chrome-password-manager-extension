const clearPasswordsBtn = document.getElementById("clear-passwords-btn");
let passwordsDiv = document.getElementById("passwords-div");

clearPasswordsBtn.addEventListener("click", () => {
    chrome.storage.sync.set({ passwords: [] });
    passwordsDiv.remove();
    passwordsDiv = document.createElement("div");
    passwordsDiv.id = "passwords-div";
    document.body.appendChild(passwordsDiv);
})

const getUrls = async () => {
    const { passwords } = await chrome.storage.sync.get("passwords");
    passwords.forEach(password => {
        const wrapper = document.createElement("div");
        wrapper.className = "passwords-item";

        const linkEl = document.createElement("a");
        linkEl.href = password.url;
        linkEl.innerText = extractNameFromUrl(password.url);
        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";

        wrapper.appendChild(linkEl);
        wrapper.appendChild(deleteBtn);
        passwordsDiv.appendChild(wrapper);
        
        deleteBtn.addEventListener("click", () => {
            const updatedPasswords = passwords.filter(pwd => pwd !== password);
            chrome.storage.sync.set({ passwords: updatedPasswords });

            linkEl.remove();
            deleteBtn.remove();            
        })
    })
}

function extractNameFromUrl(url) {
    var match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^/?]+)/i);
    var domain = match && match[1];
  
    if (domain) {
      var parts = domain.split('.');
      if (parts.length > 1) {
        var name = parts[parts.length - 2];
        return name.charAt(0).toUpperCase() + name.slice(1);
      }
    }
  
    return null;
}

getUrls();