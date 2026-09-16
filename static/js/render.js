import {fetchCategoryDefinitions} from "./api.js"

export function renderDebugTree(ipData, path) {
    Object.entries(ipData).forEach(([key, value]) => {
        const currentPath = path ? `${path} -> ${key}` : key;

        if (typeof(value) === "object" && value !== null) {
            renderDebugTree(value, currentPath);
        }
        else {
            document.getElementById('analysisResults').innerHTML += `<p>${currentPath}: ${value}</p>`;
        }
    });
}

export async function renderCategoryCheckboxes() {
    let dict = await fetchCategoryDefinitions();
    let render = "";

    for (let i = 0; i < dict.keys.length; i++) {
        render += `<label>
            <input id="settingsBox${i}" type="checkbox">
            ${dict.keys[i]}
        </label>`;
    }
    document.getElementById('settingsMenu').innerHTML += render;
}

export function renderAnalysisResults(categories, queryIp) {
    document.getElementById('analysisResults').innerHTML += `<div id="${queryIp}RdapInfo" class="ip-rdap-info"><div class="ip-rdap-info__title">${queryIp}</div></div>`;
    const container = document.getElementById(`${queryIp}RdapInfo`)

    for (let i = 0; i < categories.length; i++) {
        const fieldGroup = categories[i];
        const valueItems = fieldGroup.filter(item => Object.keys(item)[0] !== "(key)");
        const needsNumbering = valueItems.length > 1;

        // let currentKey = "";
        let index = 0;
        let groupPosition = 0;
        let branches = "";
        let hasEntityKey = "";
        let entityKeyValue = "";
        
        for (const item of fieldGroup) {
            const [label, value] = Object.entries(item)[0];
            groupPosition++

            if (label === "(key)") {
                hasEntityKey = "(key)";
                entityKeyValue = value;
                
                continue;
            }

            index++
            
            if (hasEntityKey === "(key)" && needsNumbering) {
                if (groupPosition === fieldGroup.length) {
                    branches += buildEntityBranchHtml(value, index, entityKeyValue)
                    renderArrayNode(container, label, branches);
                } else {
                    branches += buildEntityBranchHtml(value, index, entityKeyValue)
                }
            } else if (hasEntityKey === "(key)") {
                renderEntityNode(container, label, value, entityKeyValue);
            } else if (needsNumbering) {
                if (groupPosition === fieldGroup.length) {
                    branches += buildBranchHtml(value, index)
                    renderArrayNode(container, label, branches);
                } else {
                    branches += buildBranchHtml(value, index)
                }
            } else {
                renderSimpleNode(container, label, value);
            }
        }
    }
}



function renderSimpleNode(container, label, value) {
    container.innerHTML += `<div class="node">
                                <span class="node__label">${label}</span>
                                <div class="node__row">
                                    <span class="node__value">${value}</span>
                                </div>
                            </div>`
}

function renderArrayNode(container, label, branches) {
    container.innerHTML += `<div class="node node--array">
                                <span class="node__label">${label}</span>
                                <div class="node__branches">
                                ${branches}
                                </div>
                            </div>`
}

function renderEntityNode(container, label, value, entityKeyValue) {
    container.innerHTML += `<div class="node">
                                <span class="node__label">${label}</span>
                                <div class="node__row">
                                    <span class="node__value">${value}</span>
                                    <span class="node__badge">${entityKeyValue}</span>
                                </div>
                            </div>`
}

function buildEntityBranchHtml(value, index, entityKeyValue) {
    let branches = "";

    branches += `<div class="node__branch">
        <span class="node__index">[${index}]</span> ${value} <span class="node__badge">${entityKeyValue}</span>
    </div>`

    return branches;
}

function buildBranchHtml(value, index) {
    let branches = "";

    branches += `<div class="node__branch">
        <span class="node__index">[${index}]</span> ${value}
    </div>`

    return branches;
}