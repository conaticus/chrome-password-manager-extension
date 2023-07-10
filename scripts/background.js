chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ passwords: [] });
})

chrome.webNavigation.onCompleted.addListener(({ tabId, frameId }) => {
    if (frameId !== 0) return;

    chrome.scripting.executeScript({
        target: { tabId },
        function: newPageLoad,
    })
})

const newPageLoad = async () => {
    let inputs = document.getElementsByTagName("input");
    const inputLength = inputs.length;
    for (let i = 0; i < inputLength; i++) {
        const input = inputs.item(i);
        if (input.type !== "password") continue;

        const { passwords } = await chrome.storage.sync.get("passwords"); 
        const pagePassword = passwords.find(password => password.url === location.href);

        if (pagePassword !== undefined) {
            input.value = pagePassword.password;
        } else {
            const popupDiv = document.createElement("div");
            popupDiv.style.position = "absolute";
            const inputRect = input.getBoundingClientRect();
            popupDiv.style.left = inputRect.left + "px";
            popupDiv.style.top = inputRect.top - (inputRect.height + 120) + "px";
            popupDiv.style.backgroundColor = "white";
            popupDiv.style.width = "250px";
            popupDiv.style.height = "120px";
            popupDiv.style.padding = "10px";
            popupDiv.style.borderRadius = "5px";
            popupDiv.style.border = "solid 1px black";
            
            const title = document.createElement("p");
            title.innerText = "Enter password for this page";

            const passwordInput = document.createElement("input");
            passwordInput.type = "password";

            const addPasswordButton = document.createElement("button");
            addPasswordButton.innerText = "Add password";

            const goAwayButton = document.createElement("button");
            goAwayButton.innerText = "fuck off";
            goAwayButton.addEventListener("click", () => {
                popupDiv.remove();
            });

            popupDiv.appendChild(title);
            popupDiv.appendChild(passwordInput);
            popupDiv.appendChild(addPasswordButton);
            popupDiv.appendChild(goAwayButton);

            document.body.appendChild(popupDiv);

            addPasswordButton.addEventListener("click", () => {
                if (passwordInput.value.length < 8) {
                    alert("Password must be at least 8 characters.");
                    return;
                }

                passwords.push({ password: passwordInput.value, url: location.href });
                chrome.storage.sync.set({ passwords });

                popupDiv.remove();
                input.value = passwordInput.value;
            })
        }
    }
}