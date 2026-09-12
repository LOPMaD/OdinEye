document.getElementById('runButton').addEventListener('click', analyzeIP);
document.getElementById('runDebugButton').addEventListener('click', analyzeIPDebug);
document.addEventListener('DOMContentLoaded', renderSettings); 

function createPerfectIpData(dictValue, dictKey, current, results) {
    
    if (current === null || current === undefined) {
        return;
    }
    if (typeof current !== "object" && !Array.isArray(current)) {
        results.push({[dictValue]:current});
        return;
    }

    let step = dictKey[0];
    let sliceDictKey = dictKey.slice(1);

    if (step === "(key)") {
        for (const i of Object.keys(current)) {
            createPerfectIpData(dictValue, sliceDictKey, current[i], results)
        }
    } else if (!isNaN(Number(step))) {
        for (let i = 0; i < current.length; i++) {
            createPerfectIpData(dictValue, sliceDictKey, current[i], results)
        }
    } else {
        createPerfectIpData(dictValue, sliceDictKey, current[step], results)
    }
}

async function getCategories(ipData) {
    let dictCategories = await getDictCategories();
    let categoriesValue = [];

    for (let i = 0; i < dictCategories.keys.length; i++) {
        let checkbox = document.getElementById(`settingsBox${i}`).checked;
        if (checkbox === true) {
            let dict = dictCategories.categories[dictCategories.keys[i]];
            
            for (let [key, value] of Object.entries(dict)) {
                let dictKey = key.split(".");
                let results = [];
                
                createPerfectIpData(value, dictKey, ipData, results);
                if (results != "") {
                    categoriesValue.push(results);
                }
            }

        }
    }
    return categoriesValue;
}


async function analyzeIP() {
    let ipData = await fetchIpData();
    let categories = await getCategories(ipData);
    renderResult(categories);
}

function renderResult(categories) {
    document.getElementById('analysisResults').innerHTML = "";

    for (let i = 0; i < categories.length; i++) {
        for (let j = 0; j < categories[i].length; j++) {
            let results = Object.entries(categories[i][j])[0];
            console.log(results);
            if (categories[i].length > 1) {
                document.getElementById('analysisResults').innerHTML += `<p>[${j+1}] - ${results[0]} - ${results[1]}</p>`;
            } else {
                document.getElementById('analysisResults').innerHTML += `<p>${results[0]} - ${results[1]}</p>`;  
            }
        } 
    }
}

async function fetchIpData() {
    const ipInput = document.getElementById('ipInput').value;
    let depth = Number(document.getElementById('depth').value);

    const response = await fetch('/api/analyzeIP', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ips: ipInput, depth: depth})
    });

    const ipData = await response.json();
    return ipData;
}

async function renderSettings() {
    let dict = await getDictCategories();
    let render = "";

    for (let i = 0; i < dict.keys.length; i++) {
        render += `<label>
            <input id="settingsBox${i}" type="checkbox">
            ${dict.keys[i]}
        </label>`;
    }
    document.getElementById('settingsMenu').innerHTML += render;
}

async function getDictCategories() {
    const response = await fetch('/api/getDictCategories');
    return response.json();
}

async function analyzeIPDebug() {
    let ipData = await fetchIpData();
    document.getElementById('analysisResults').innerHTML = "";
    renderAllValue(ipData, path="");
}

function renderAllValue(ipData, path) {
    Object.entries(ipData).forEach(([key, value]) => {
        const currentPath = path ? `${path} -> ${key}` : key;

        if (typeof(value) === "object" && value !== null) {
            renderAllValue(value, currentPath);
        }
        else {
            document.getElementById('analysisResults').innerHTML += `<p>${currentPath}: ${value}</p>`;
        }
    });
}