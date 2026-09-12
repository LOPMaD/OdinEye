from flask import Flask, render_template, request, jsonify
from ipwhois import IPWhois
from src import categories_maps

app = Flask(__name__)

@app.route('/')
def home_page():
    return render_template('index.html')

@app.route('/api/getDictCategories')
def get_dict_categories():
    categories = categories_maps.categories
    categories_keys = list(categories_maps.categories.keys())
    return jsonify({"keys": categories_keys, "categories": categories})

@app.route('/api/analyzeIP', methods=["POST"])
def ip_analyze():
    data = request.get_json()

    ips = data.get('ips')
    depth = data.get('depth')

    obj = IPWhois(ips)
    
    results = obj.lookup_rdap(depth=depth)
    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True, port=5000)