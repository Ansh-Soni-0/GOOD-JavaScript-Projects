const passwordInput = document.querySelector('#input-field');
const eyeIcon = document.querySelector('#eye-icon');
const requirementList = document.querySelectorAll('.list li');

//an array of password requirement with corresponding 
//regular expression and index of the requiremnet list item
const requirements = [
    { regex: /.{8,}/, index:0}, //minimum length of eight
    { regex: /[0-9]/, index:1}, //at least on number
    { regex: /[a-z]/, index:2}, //at least one lowercase eng latter
    { regex: /[^A-Za-z0-9]/, index:3}, //at least one speacial char
    { regex: /[A-Z]/, index:4}, //at least one uppercase eng latter
]

passwordInput.addEventListener('keyup' , (event) => {
    requirements.forEach(item => {
        //check if the password match the requrement regex
        const isValid = item.regex.test(event.target.value);
        const requirementItems = requirementList[item.index];

        // update the icon of requirement items matched or not
        if(isValid){
            requirementItems.firstElementChild.className = "fa-solid fa-check";

            requirementItems.classList.add("valid")
        } else {
            requirementItems.firstElementChild.className = "fa-solid fa-circle";
            requirementItems.classList.remove("valid")
        }
    })
})

eyeIcon.addEventListener("click" , () => {
    console.log("clicked")
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";

    eyeIcon.className = `fa-solid fa-eye${passwordInput.type === "password" ? "" : "-slash"}`
})