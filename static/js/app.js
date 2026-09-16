import { renderAnalysisResults, renderCategoryCheckboxes } from "./render.js";
import { fetchCategoryDefinitions, fetchRdapData } from "./api.js";
import { runDebugAnalysis } from "./debug.js";

document.getElementById('runButton').addEventListener('click', runAnalysis);
document.getElementById('runDebugButton').addEventListener('click', runDebugAnalysis);
document.addEventListener('DOMContentLoaded', renderCategoryCheckboxes); 

async function collectSelectedResults(ipData) {
    let categoryDefinitions = await fetchCategoryDefinitions();
    let selectedResults = [];

    for (let i = 0; i < categoryDefinitions.keys.length; i++) {
        let isChecked = document.getElementById(`settingsBox${i}`).checked;
        if (isChecked === true) {
            let fieldMap = categoryDefinitions.categories[categoryDefinitions.keys[i]];
            
            for (let [key, fieldLabel] of Object.entries(fieldMap)) {
                let pathParts = key.split(".");
                let matches = [];
                
                resolvePath(fieldLabel, pathParts, ipData, matches);
                if (matches != "") {
                    selectedResults.push(matches);
                }
            }

        }
    }
    return selectedResults;
}

function resolvePath(fieldLabel, pathParts, current, matches) {
    
    if (current === null || current === undefined) {
        return;
    }
    if (typeof current !== "object" && !Array.isArray(current)) {
        matches.push({[fieldLabel]:current});
        return;
    }

    let pathSegment = pathParts[0];
    let remainingPath = pathParts.slice(1);

    if (pathSegment === "(key)") {
        for (const i of Object.keys(current)) {
            matches.push({"(key)":i});
            resolvePath(fieldLabel, remainingPath, current[i], matches)
        }
    } else if (!isNaN(Number(pathSegment))) {
        for (let i = 0; i < current.length; i++) {
            resolvePath(fieldLabel, remainingPath, current[i], matches)
        }
    } else {
        resolvePath(fieldLabel, remainingPath, current[pathSegment], matches)
    }
}

async function renderAllResults(rdapData, queryIp) {
    document.getElementById('analysisResults').innerHTML = "";
    for (let i = 0; i < rdapData.length; i++) {
        let selectedResults = await collectSelectedResults(rdapData[i]);
        renderAnalysisResults(selectedResults, queryIp[i]);   
    }
}

async function runAnalysis() {
    let rdapData = await fetchRdapData();
    if (rdapData !== undefined){
        await renderAllResults(rdapData["resultsRdap"], rdapData["validIPs"]);
    } else {
        document.getElementById('analysisResults').innerHTML = "We have an error!!! Check the console.";
    }
}