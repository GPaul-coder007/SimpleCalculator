from flask import Flask, request, jsonify
from flask_cors import CORS  # This is the "Security Pass"
import sqlite3
app = Flask(__name__
CORS(app)
API_KEY = "my-secret-calculator-key-2024"

if __name__ == '__main__':
    app.run(debug=True, port=5000, ssl_context='adhoc')

# 1. Setup the Database (The Memory)
def init_db():
    conn = sqlite3.connect('calculator.db')
    cursor = conn.cursor()
    cursor.execute('''
                   CREATE TABLE IF NOT EXISTS history
                   (
                       id
                       INTEGER
                       PRIMARY
                       KEY
                       AUTOINCREMENT,
                       expression
                       TEXT,
                       result
                       TEXT
                   )
                   ''')
    conn.commit()
    conn.close()


init_db()


@app.route('/calculate', methods=['POST'])
def calculate():
    user_key = request.headers.get('X-API-KEY')
    
    if user_key != API_KEY:
        return jsonify({"error": "Unauthorized"}), 401
        
    # Get the data from JS
    data = request.json
    expression = data.get('expression')

    try:
        # DATA MANIPULATION:
        # 1. Handle the Power symbol
        clean_expression = expression.replace('^', '**')

        # 2. Handle the Percent symbol
        clean_expression = clean_expression.replace('%', '/100')

        # 3. Calculate the math
        result = eval(clean_expression)

        # 4. Round the result to 2 decimal places so it fits the CSS display
        result = round(float(result), 2)

        # STORAGE: Save to Database
        conn = sqlite3.connect('calculator.db')
        cursor = conn.cursor()
        cursor.execute('INSERT INTO history (expression, result) VALUES (?, ?)', (expression, str(result)))
        conn.commit()
        conn.close()

        # Send the answer back to the JS
        return jsonify({'result': result})

    except Exception as e:
        return jsonify({'result': 'Error'}), 400


# Route to get history
@app.route('/history', methods=['GET'])
def get_history():
    conn = sqlite3.connect('calculator.db')
    cursor = conn.cursor()
    cursor.execute('SELECT expression, result FROM history ORDER BY id DESC LIMIT 10')
    rows = cursor.fetchall()
    conn.close()
    return jsonify(rows)


if __name__ == '__main__':

    app.run(debug=True, port=5000)

