from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# SECURITY: The API Key
API_KEY = "my-secret-calculator-key-2026"

def init_db():
    conn = sqlite3.connect('calculator.db')
    cursor = conn.cursor()
    cursor.execute('CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT, expression TEXT, result TEXT)')
    conn.commit()
    conn.close()

init_db()

@app.route('/calculate', methods=['POST'])
def calculate():
    # 1. Check API Key
    user_key = request.headers.get('X-API-KEY')
    if user_key != API_KEY:
        return jsonify({"result": "Unauthorized"}), 401

    # 2. Process Math
    data = request.json
    expression = data.get('expression', '')
    try:
        clean_expr = expression.replace('^', '**').replace('%', '/100')
        result = round(float(eval(clean_expr)), 2)
        
        # 3. Save to DB
        conn = sqlite3.connect('calculator.db')
        cursor = conn.cursor()
        cursor.execute('INSERT INTO history (expression, result) VALUES (?, ?)', (expression, str(result)))
        conn.commit()
        conn.close()
        
        return jsonify({'result': result})
    except:
        return jsonify({'result': 'Error'}), 400

@app.route('/history', methods=['GET'])
def get_history():
    conn = sqlite3.connect('calculator.db')
    cursor = conn.cursor()
    cursor.execute('SELECT expression, result FROM history ORDER BY id DESC LIMIT 10')
    rows = cursor.fetchall()
    conn.close()
    return jsonify(rows)

if __name__ == '__main__':
    # Starts the server with HTTPS enabled
    app.run(debug=True, port=5000, ssl_context='adhoc')
