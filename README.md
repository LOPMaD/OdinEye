# 👁️ OdinEye
<img width="1871" height="547" alt="image" src="https://github.com/user-attachments/assets/1b0a259e-fc50-4e44-af1a-6bfcb1926322" />

> Local RDAP analyzer for IP addresses, built for SOC teams.
 
## 🔍 What it is
 
RDAP lookup tool for IP contact and ownership data — abuse email, registrant, ASN, region. No scraping, no third-party API keys.
 
## 🚀 Setup
 
```bash
git clone https://github.com/LOPMaD/OdinEye.git
cd OdinEye
python -m venv .venv
```
 
Activate the virtual environment:
 
| Platform | Shell | Command |
|---|---|---|
| POSIX | bash/zsh | `source .venv/bin/activate` |
| POSIX | fish | `source .venv/bin/activate.fish` |
| POSIX | csh/tcsh | `source .venv/bin/activate.csh` |
| Windows | cmd.exe | `.venv\Scripts\activate.bat` |
| Windows | PowerShell | `.venv\Scripts\Activate.ps1` |
 
Install dependencies and run:
 
```bash
pip install -r requirements.txt
python app.py
```
 
Open `http://127.0.0.1:5000` in your browser.
 
## ⚙️ Usage
 
1. Paste one or more IP addresses into the input field.
2. Select the categories you need (ASN, network, entity, contact, etc.). At least one required.
3. Set `depth` — how deep nested RDAP data is resolved. `2`–`3` covers most cases; avoid large values, they slow down the lookup significantly. Default (empty) is `0` — top-level data only.
4. Click **Analyze** and wait. More IPs = longer lookup time.
## 🚧 Roadmap
 
- [ ] CSV and PDF export
- [ ] Domain analysis
 
