from flask import Flask, render_template, request, jsonify
from ipwhois import IPWhois
from src import categories_maps
import ipaddress

app = Flask(__name__)

def is_valid_ip(value):
    try:
        ipaddress.ip_address(value)
        return True
    except ValueError:
        return False

@app.route('/')
def home_page():
    return render_template('index.html')

@app.route('/api/fetchCategoryDefinitions')
def get_dict_categories():
    categories = categories_maps.categories
    categories_keys = list(categories_maps.categories.keys())
    return jsonify({"keys": categories_keys, "categories": categories})

@app.route('/api/analyzeIP', methods=["POST"])
def ip_analyze():
    data = request.get_json()

    ips = data.get('ips')
    depth = data.get('depth')


    
    validIPs = []
    resultsRdap = []
    obj = []

    try:
        for i in ips:
            if is_valid_ip(i) == True:
                validIPs.append(i)

        for i in validIPs:
            obj.append(IPWhois(i))

        for i in obj:
            resultsRdap.append(i.lookup_rdap(depth=depth))

        return jsonify({"validIPs":validIPs, "resultsRdap":resultsRdap})
    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run(debug=True, port=5000)