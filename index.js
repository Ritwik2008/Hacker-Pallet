let unit = 1
let language = "JavaScript"
// let hideLangNav = () => {langNav.style.display =  'none';console.log(langNav.style.display);}
const save_popup = document.getElementById("save-popup");
const setting_popup = document.getElementById("setting-popup");

const editor = document.getElementById("code-prompt");

const save_btn = document.getElementById("save-btn");
const run_btn = document.getElementById("run-btn");
const fileNav = document.getElementById("file-nav");
const loadBtn = document.getElementById("load-btn");
const settingBtn = document.getElementById("setting-btn");
const settingSubmitBtn = document.getElementById("setting-submit-btn");

const BackColorInput = document.getElementById("back-color-input");
const ForeColorInput = document.getElementById("fore-color-input");
const UnitValueInput = document.getElementById("unit-value-input");
const saveInput = document.getElementById("save-name-input");
const langSelect = document.getElementById("lang-select");
const fileDialog = document.getElementById("file-popup");
// const fileDialog = document.getElementById("file-popup");
const langNav = document.getElementById("lang-nav");
window.onresize = () => {document.documentElement.style.setProperty('--unit', unit * unit/window.innerWidth+"px")}
editor.addEventListener('keydown', function(e) {
    if (e.key == 'Tab') {
      e.preventDefault();
      var start = this.selectionStart;
      var end = this.selectionEnd;
  
      // set textarea value to: text before caret + tab + text after caret
      this.value = this.value.substring(0, start) +
        "\t" + this.value.substring(end);
  
      // put caret at right position again
      this.selectionStart =
        this.selectionEnd = start + 1;
    }

  });
save_btn.addEventListener("click", () => save_popup.showModal())
save_popup.addEventListener("close", () => SaveCode(saveInput.value))
run_btn.addEventListener("click", () => {
    if (language == "JavaScript" || language == "HTML") {
        // let Scripts = ((language === "JavaScript" || language === "HTML")) `let func = new Function(${editor.value});`
        if (language === "JavaScript") Scripts = `let func = new Function(${editor.value});func()`
        else if (language === "HTML") Scripts = `document.write(${"`"+editor.value+"`"});`
        else Scripts = `let Scripts = ${editor.value};`
        try {
            let newWindow = window.open()
            newWindow.document.write(
            `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            </head>
            <body>
            
            </body>
            <script>
                ${Scripts}
            </script>
            <script>console.log("Hello, World")</script>
            </html>
            `
            )
        } catch (e) {
            alert(`Error Caught during Execution :\n${e.message}`)
        }
    }
})
loadBtn.addEventListener('click', () => {loadCode();fileDialog.showModal()})
settingBtn.addEventListener('click', () => setting_popup.showModal())
settingSubmitBtn.addEventListener('click', settings)
langSelect.addEventListener('click', () => {langNav.style.display = langNav.style.display !== 'flex' ? 'flex': 'none';editor.classList.toggle("z-hide")})
langNav.children[0].addEventListener('click', () => {langNav.style.display = 'none';language = "JavaScript"})
langNav.children[1].addEventListener('click', () => {langNav.style.display = 'none';language = "HTML"})
const file_key = "hacker-prompt-saved-files-key-code"
if (localStorage.getItem(file_key) === null) {localStorage.setItem(file_key,JSON.stringify({"html demo":`<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<meta http-equiv="X-UA-Compatible" content="IE=edge">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<title>Document</title>\n</head>\n<body>\n\t<h1>Hello, World!</h1>\n</body>\n</html>\n`,"JS demo":"let name = prompt(\"enter your name\");\nalert(\"Hello, \" + name)"}))}
// localStorage.geItem(file_key,'{}')

function SaveCode(_save_name){
    _save_value = JSON.parse(localStorage.getItem(file_key))
    _save_value[_save_name] = editor.value;
    localStorage.setItem(file_key, JSON.stringify(_save_value))
    console.log("File saved :"+_save_name)
    loadCode()
}
function loadCode(){
    let fileList = JSON.parse(localStorage.getItem(file_key))
    for(let i=0; i<Object.keys(fileList).length; i++){
        let filename = Object.keys(fileList)[i]
        let code = fileList[filename]
        for (let i = 0; i < fileNav.children.length; i++) {
            let child = fileNav.children[i]
            if (child.getAttribute("data-filebar") === filename) break
            else if (i === fileNav.children.length -1){
                let item = document.createElement("li");
                fileNav.append(item);
                item = fileNav.children[fileNav.children.length-1]
                item.setAttribute("data-filebar",filename)
                item.classList.add("file-select-btn")
                item.innerHTML = `<button class="file-nav-li-btn">${filename}</button>`
                item.innerHTML += `
                    <div class="flex">
                    \t<i class="fa-solid fa-plus add-icon""></i>
                    \t<i class="fa-solid fa-trash-can delete-icon"}></i>
                    </div>
                    `
                // item.innerHTML = `<button class="file-nav-li-btn" onclick="getFile(${"`"+filename+"`"})">${filename}</button><i class="fa-solid fa-trash-can delete-icon" onclick=deleteFile(${"`"+filename+"`"})></i>`
                item.children[0].onclick = () => editor.value = code
                item.children[1].children[1].onclick = () => deleteFile(filename)
                item.children[1].children[0].onclick = () => addCode(filename)
            }
        }
    }
}
function getFile(filename) { 
    let fileList = JSON.parse(localStorage.getItem(file_key))
    code = fileList[filename]
    editor.value = code
}
function settings() { 
    let root = document.querySelector(':root')
    root.style.setProperty('--fore', ForeColorInput.value);
    root.style.setProperty('--back', BackColorInput.value);
    unit = UnitValueInput.value;
    window.onresize();
}
function deleteFile(filename) {
    let fileList = JSON.parse(localStorage.getItem(file_key))
    delete fileList[filename]
    localStorage.setItem(file_key, JSON.stringify(fileList))
    for (child of fileNav.children) {
        if (child.getAttribute('data-filebar') === filename) {
            fileNav.removeChild(child)
            loadCode()
        }
    }
}
function addCode(filename) {
    let fileList = JSON.parse(localStorage.getItem(file_key))
    editor.value += fileList[filename]
}
const giveDemo = (lang) => {return {"html demo":`<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<meta http-equiv="X-UA-Compatible" content="IE=edge">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<title>Document</title>\n</head>\n<body>\n\t<h1>Hello, World!</h1>\n</body>\n</html>\n`,"JS demo":"let name = prompt(\"enter your name\");\nalert(\"Hello, \" + name)"}[lang]}
const addText = (newText, el = editor) => {
    const [start, end] = [el.selectionStart, el.selectionEnd];
    el.setRangeText(newText, start, end, 'select');
}
document.getElementsByClassName("add-icon")[document.getElementsByClassName("add-icon").length - 1].onclick = editor.value += giveDemo(`html demo`)
document.getElementsByClassName("add-icon")[document.getElementsByClassName("add-icon").length - 2].onclick = editor.value += giveDemo(`JS demo`)
window.onresize()