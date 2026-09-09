document.getElementById('runButton').addEventListener('click', ipAnalyzeDebug);

async function getIP() {
    const ipInput = document.getElementById('ipInput').value;
    const depth = document.getElementById('depth').value;

    const response = await fetch('/api/ipAnalyze', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ips: ipInput, depth: depth})
    });

    const data = await response.json();
    return data;
}

async function ipAnalyze() {
    data = await getIP()
    document.getElementById('analysisResults').innerHTML = "";
    document.getElementById('analysisResults').innerHTML = data.network.events[0].timestamp;
}

async function ipAnalyzeDebug() {
    data = await getIP()
    document.getElementById('analysisResults').innerHTML = "";
    renderAllValue(data, path="")
}

function renderAllValue(data, path) {
    Object.entries(data).forEach(([key, value]) => {
        const currentPath = path ? `${path} -> ${key}` : key;

        if (typeof(value) === "object" && value !== null) {
            renderAllValue(value, currentPath);
        }
        else {
            document.getElementById('analysisResults').innerHTML += `<p>${currentPath}: ${value}</p>`;
        }
    });
}