from flask import Flask, render_template, request, jsonify
from ipwhois import IPWhois

app = Flask(__name__)

@app.route('/')
def home_page():
    return render_template('index.html')

@app.route('/api/ipAnalyze', methods=["POST"])
def ip_analyze():
    data = request.get_json()

    ips = data.get('ips')
    depth = int(data.get('depth'))

    obj = IPWhois(ips)
    
    results = obj.lookup_rdap(depth=depth)
    return results

if __name__ == "__main__":
    app.run(debug=True, port=5000)