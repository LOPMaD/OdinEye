export async function fetchRdapData() {
    const ipAddress = document.getElementById('ipInput').value;
    if (ipAddress == "") {
        return ""   
    }
    document.getElementById('analysisResults').innerHTML = "LOADING";
    let ips = ipAddress.split(/[\s,]+/).filter(ip => ip !== "").map(ip => ip.split("/")[0]);
    let lookupDepth = Number(document.getElementById('depth').value);
    
    const response = await fetch('/api/analyzeIP', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ips: ips, depth: lookupDepth})
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("ERROR:", errorData.error);
        return;
    }

    const rdapData = await response.json();

    return rdapData;
}

export async function fetchCategoryDefinitions() {
    const response = await fetch('/api/fetchCategoryDefinitions');
    return response.json();
}