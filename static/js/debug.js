import { fetchRdapData } from "./api.js";
import { renderDebugTree } from "./render.js";

export async function runDebugAnalysis() {
    let rdapData = await fetchRdapData();
    await renderAllResultsDebug(rdapData["resultsRdap"]);
}


async function renderAllResultsDebug(rdapData) {
    let path="";
    document.getElementById('analysisResults').innerHTML = "";
    for (let i = 0; i < rdapData.length; i++) {
        renderDebugTree(rdapData[i], path);   
    }
}