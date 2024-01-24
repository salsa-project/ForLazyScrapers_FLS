let data = {
    "idSelector": [],
    "classNamesSelector": [
        {
            "name": "card",
            "index": 2,
            "count": 4,
            "types": {
                "query": ".card:nth-of-type(2)"
            }
        },
        {
            "name": "card",
            "index": 2,
            "count": 4,
            "types": {
                "query": ".card:nth-of-type(2)"
            }
        }
    ],
    "tagNameSelector": [
        {
            "name": "div",
            "index": 9,
            'count': 0,
            "types": {
                "query": "div:nth-of-type(9)"
            }
        }
    ],
    "xpathSelector": "/#cardsContainer/div:nth-child(3)"
}

let arr1 = ["idSelector", "classNamesSelector", "tagNameSelector", "xpathSelector"]
let arr2 = ["name", "index", "count"]
let arr3 = [];
for (let i = 0; i < arr1.length; i++) {
    const selector = data[arr1[i]];
    
    if(Array.isArray(selector)){

        for (let j = 0; j < selector.length; j++) {
            const currentItem = selector[j];

            for (let k = 0; k < arr2.length; k++) {
                let key = arr2[k]
                arr3.push(currentItem[key])
            }
                        
        }
    }
    
}
console.log(arr3)
