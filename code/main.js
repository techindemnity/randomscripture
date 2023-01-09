//document.getElementById("output").style.width = document.getElementById("header").offsetWidth + "px"

const _length = 600
const _bestof = 3
const _size = "256x256"
const _format = "b64_json"
const _n = 2

const _urlBible = "https://rhmqa2opd3d7t6w4gu4gh4mwk40hwmgi.lambda-url.us-west-1.on.aws/"
const _urlText = "https://hfxpk3gadabqzobfu6fnczky4i0ggynd.lambda-url.us-west-1.on.aws/"
const _urlImg = "https://74xpx6m7khppxg4avsp5w667lq0vqqbk.lambda-url.us-west-1.on.aws/"
const _urlWrite = "https://jvosl2e25sieg7vx6jkugnv4z40jnjwl.lambda-url.us-west-1.on.aws/"
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

showIframe("cdnFooter")

makeSameWidthLarger(document.getElementById("btnDetails"),document.getElementById("btnGet"))


document.getElementById("activity1").style.display = 'none'
document.getElementById("btnDetails").disabled = true;

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
                    //dont wait for the response
                    //.then(data => {
                    //    resolve(data)
                    //}).catch(e => 
                    //    {
                    //        console.log("error. " + e) 
                    //    reject("error. " + e)
                    //})
                    resolve()    
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
                    document.getElementById("exampleModalLabel").innerHTML=addendum
                    OpenaiFetchAPIIMG(addendum).then(data => {
                        img = data
                        OpenaiFetchAPIText(addendum).then(data => {
                            inter = data
                            document.getElementById("btnDetails").disabled = false;   
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
            body: JSON.stringify({ "vid": vid, "book_name": book_name, "iter": inter, "verse": verse, "img": img }),
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
    document.getElementById("exampleModalLabel").innerHTML = book_name
    document.getElementById("btnDetails").disabled = false;
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
    document.getElementById("btnDetails").disabled = true;
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


//GENERIC STUFF TO MOVE
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

function makeSameWidthLarger(el1, el2) {
  // Get the client rectangles for each element
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();

  // Determine which element is wider
  let widerElement, narrowerElement;
  if (rect1.width > rect2.width) {
    widerElement = el1;
    narrowerElement = el2;
  } else {
    widerElement = el2;
    narrowerElement = el1;
  }

  // Set the width of the narrower element to match the wider element
  narrowerElement.style.width = `${widerElement.offsetWidth}px`;
}
function showIframe(e) {
    var iframe = document.getElementById(e);

    // Get the iframe's content window
    var contentWindow = iframe.contentWindow;

    // Get the iframe's document
    var doc = contentWindow.document;

    // Get the iframe's body element
    var body = doc.body;

    // Set the height and width of the iframe to match the body element's height and width
    iframe.height = body.scrollHeight;
    iframe.width = body.scrollWidth;
}