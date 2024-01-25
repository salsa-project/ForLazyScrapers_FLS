let data = {
    "idSelector": {
        "type": "id",
        "name": "showcase",
        "index": 0,
        "count": 1,
        "types": {
            "query": "#showcase"
        }
    },
    "classNamesSelector": [
        {
            "type": "class",
            "name": "card",
            "index": 2,
            "count": 4,
            "types": {
                "query": ".card:nth-of-type(2)"
            }
        },
        {
            "type": "class",
            "name": "gggg",
            "index": 2,
            "count": 4,
            "types": {
                "query": ".card:nth-of-type(2)"
            }
        },
        {
            "type": "class",
            "name": "kkkk",
            "index": 2,
            "count": 4,
            "types": {
                "query": ".card:nth-of-type(2)"
            }
        },
    ],
    "tagNameSelector": {
        "type": "tag",
        "name": "div",
        "index": 9,
        "count": 0,
        "types": {
            "query": "div:nth-of-type(9)"
        }
    },
    "xpathSelector": "/#cardsContainer/div:nth-child(3)"
}


function htmlTagTemplate(obj){
    return `
        <div class="tag">
        <p class="tagType tagText">${obj.type}</p>
        <p class="tagValue tagText">${obj.name}</p>
        <p class="tagCount tagText">${obj.count}</p>
        </div>
    `
}

selectorTagsHTML = "";
let idData = data.idSelector;
let classesData = data.classNamesSelector;
let tagData = data.tagNameSelector;


// generate ID html tags
if(idData){
    selectorTagsHTML+= htmlTagTemplate(idData)
}
// generate CLASS html tags
if (Array.isArray(classesData)) {
    classesData.forEach(obj => {
        selectorTagsHTML+= htmlTagTemplate(obj)
    });
}
// generate TAG html tags
selectorTagsHTML+= htmlTagTemplate(tagData)




console.log(selectorTagsHTML)