const { workerData, parentPort } = require('worker_threads');

let name = workerData.name;
let nameSpaceInput = (name.join(" ").match(/ /g) || []).length;
let nameSpaceCount;
let item;
let items;
try {
    items = require(`../../data/items/${name.join(" ").split("")[0].toLowerCase()}`);
} catch {
    return parentPort.postMessage(1);
}

for (let i = 0; i < Object.keys(items).length; i++) {
    let itemData = items[Object.keys(items)[i]];

    let itemName = itemData.name.replace(/-/g, " "),
        itemId = itemData.id.replace(/-/g, " ");


    let spacesInName = (itemName.match(/ /g) || []).length,
        spacesInId = (itemId.match(/ /g) || []).length;

    if (nameSpaceInput >= spacesInName) if (itemName.toLowerCase() == name.slice(0, spacesInName + 1).join(" ").toLowerCase()) {
        item = itemData;
        nameSpaceCount = spacesInName;
        break;
    } else if (nameSpaceInput >= spacesInId) if (itemId.toLowerCase() == name.slice(0, spacesInId + 1).join(" ").toLowerCase()) {
        item = itemData;
        nameSpaceCount = spacesInId;
        break;
    };
}

if (!item) return parentPort.postMessage(1);
parentPort.postMessage({
    "item": item,
    "nameSpaceCount": nameSpaceCount || nameSpaceCount == 0 ? nameSpaceCount : 0
});
