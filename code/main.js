//document.getElementById("output").style.width = document.getElementById("header").offsetWidth + "px"

const _length = 600
const _bestof = 3
const _size = "256x256"
const _format = "b64_json"
const _n = 2

const _urlBible = "https://rhmqa2opd3d7t6w4gu4gh4mwk40hwmgi.lambda-url.us-west-1.on.aws/"
const _urlText = "https://hfxpk3gadabqzobfu6fnczky4i0ggynd.lambda-url.us-west-1.on.aws/"
const _urlImg = "https://74xpx6m7khppxg4avsp5w667lq0vqqbk.lambda-url.us-west-1.on.aws/"
const _urlWrite = "https://dj2ej4notnmxnlblhfjn66pk2m0ajbrc.lambda-url.us-west-1.on.aws/"
const _urlCache = "https://tiacolll2fvdc6rb6ygcyab3x40mhlia.lambda-url.us-west-1.on.aws/"


var _book_name
var _inter
var _img

const b = document.getElementById("btnGet")
if (!b) {
    console.log("btn not found")
}
else {
    document.getElementById("btnGet").addEventListener("click", async () => {
        document.getElementById("activity1").style.display = 'inline'
        document.getElementById("btnShow1").style.display = 'none'
        getPassage().then(
            d =>{
                document.getElementById("activity1").style.display = 'none'
                document.getElementById("btnShow1").style.display = 'inline'
            }
        ).catch(e => {
            console.log(e)
        })
    })
}

document.getElementById("activity1").style.display = 'none'

OpenaiFetchCache()
.then(data => {
    console.log("done.")
}).catch(e => {
    console.log("error. "  + e)
})

async function getPassage() {
    return new Promise((resolve, reject)=>{
        try{
            clearContent()
            OpenaiFetchRandomBible().then(data => {
                OpenaiFetchWriteCache(data.vid, data.verse, data.book_name, data.inter, data.img)
                    .then(data => {
                        resolve(data)
                    }).catch(e => 
                        {
                            console.log("error. " + e) 
                        reject("error. " + e)
                    })
                autoResize("output")
            }).catch(e => {
                console.log("error. " + e)
                reject(e)
            })
        }
        catch(e){
            console.log("error. " + e)
            reject(e)
        }
    })
}

function sameSize(element, el2) {
    const tA = document.getElementById(el2)
    document.getElementById(element).style.height = 'auto';
    document.getElementById(element).style.height = tA.scrollHeight + 'px';
    document.getElementById(element).style.width = 'auto';
    document.getElementById(element).style.width = tA.scrollHeight + 'px';
}

function autoResize(element) {
    const tA = document.getElementById(element)
    tA.style.height = 'auto';
    tA.style.height = tA.scrollHeight + 'px';
}
function hide(element) {
    const x = document.getElementById(element)
    try {
        x.style.display = "none";
    }
    catch {
        x.style.visibility = "hidden"
    }

}

function show(element) {
    const x = document.getElementById(element)
    try {
        x.style.display = "block";
    }
    catch {
        x.style.visibility = "visible"
    }
}

async function OpenaiFetchRandomBible() {
    var inter, img, verse, vid
    return new Promise((resolve, reject) => {
        var url = _urlBible
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => {

            return response.json()

        }).then(data => {
            const addendum = data.book_name
            _book_name = data.book_name
            const p = document.getElementById("output")
            if (p) {
                //console.log(data)
                p.innerHTML = data.verse;
                verse = data.verse
                const b = document.getElementById("book")
                if (b) {
                    b.innerHTML = addendum
                    OpenaiFetchAPIText(addendum).then(data => {
                        inter = data
                        OpenaiFetchAPIIMG(addendum).then(data => {
                            img = data   //_img = data
                            resolve(
                                {
                                    book_name: _book_name,
                                    verse: verse,
                                    inter: inter,
                                    img: img,
                                    vid: 1
                                }
                            )
                        })
                    }
                    )
                }
                else {
                    //console.log("Unknown Error.")
                    reject("Error retrieving data.")
                }
            }
            else {
                //console.log("Unknown Error.")
                reject("Error retrieving data.")
            }
        }).catch(error => {
            reject("Error retrieving data." + error)
        });
    })
}
async function OpenaiFetchAPIText(inputMsg) {
    return new Promise((resolve, reject) => {
        inputMsg = "What is the meaning of " + inputMsg + " in the bible?"
        console.log("Calling GPT3 with: " + inputMsg)
        var url = _urlText
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "prompt": inputMsg, "length": _length, "bestof": _bestof }),
        }).then(response => {

            return response.json()

        }).then(data => {
            const p = document.getElementById("ai")
            if (p) {
                console.log(data)
                p.innerHTML = data;
                _inter = data
                resolve(_inter)
            }
            else {
                const p = document.getElementById("ai")
                if (p) {
                    p.innerHTML = "Unknown Error";
                    reject("Error retrieving data.")
                }
            }
        }).catch(error => {
            //console.log('Something bad happened ' + error)
            reject("Error retrieving data.")
        });
    })
}
async function OpenaiFetchAPIIMG(inputMsg) {
    return new Promise((resolve, reject) => {
        inputMsg = "A landscape of an image of a scene in the Middle East representing: " + inputMsg + " by Winslow Homer"
        console.log("Calling GPT3 with: " + inputMsg)
        var url = _urlImg;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "prompt": inputMsg, "n": _n, "size": _size, "response_format": _format }),
        }).then(response => {

            return response.json()

        }).then(data => {
            const p = document.getElementById("aiImg")
            if (p) {
                p.src = "data:image/png;base64," + data;
                _img = "data:image/png;base64," + data
                resolve(data)
            }
            else {
                const p = document.getElementById("ai")
                if (p) {
                    console.log("Unknown Error")
                    reject("Error retrieving data.")
                }
            }
        }).catch(error => {
            console.log('Something bad happened ' + error)
            reject("Error retrieving data.")
        })
    })
}

async function OpenaiFetchWriteCache(vid, verse, book_name, inter, img) {
    //console.log(JSON.stringify({ "vid": vid, "book_name": book_name, "verse": verse, "inter": inter, "img": img }))
    return new Promise((resolve, reject) => {
        var url = _urlWrite
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "vid": vid, "book_name": book_name, "verse": verse, "inter": inter, "img": img }),
        }).then(response => {

            return response.json()

        }).then(data => {
            console.log('cache written ')
            resolve()
        }
        ).catch(error => {
                console.log('error with cache write ' + error)
            reject('error with cache write ' + error)
            });
    })
}

function setContent(img, inter, verse, book_name){
    const imgElement = document.getElementById("aiImg")
    imgElement.src = "data:image/png;base64," + img
    const interElement = document.getElementById("output")
    interElement.innerHTML = verse
    const interVerseElement = document.getElementById("ai")
    interVerseElement.innerHTML = inter
    const bnElement = document.getElementById("book")
    bnElement.innerHTML = book_name
    //show("jtHeader")
    //show("Content")
    //show("imgContent")
}
function clearContent(){
    const imgElement = document.getElementById("aiImg")
    imgElement.src = ""
    const interElement = document.getElementById("output")
    interElement.innerHTML = ""
    const interVerseElement = document.getElementById("ai")
    interVerseElement.innerHTML = ""
    const bnElement = document.getElementById("book")
    bnElement.innerHTML = ""
    //hide("jtHeader")
    //hide("Content")
    //hide("imgContent")
}

async function OpenaiFetchCache() {
    return new Promise((resolve, reject) => {
        var url = _urlCache;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => {

            return response.json()

        }).then(data => {
            setContent(data.img, data.inter, data.verse, data.book_name)
            resolve()
        }).catch(error => {
            console.log('Something bad happened ' + error)
            reject("Error retrieving data.")
        })
    })
}
