from flask import Flask, jsonify, request, render_template
import mysql.connector
from flask_cors import CORS


app=Flask(__name__)
cors = CORS(app)


@app.route("/")
def index():
    return render_template('index.html', visibility="hidden")

#connect to the MySQL database
db = mysql.connector.connect(
    host="127.0.0.1",
    user="user",
    password="for-user-test-only",
    database="classicmodels",
    port="3306"
)

#GET http://127.0.0.1:5000/query
#route to search by first name or last name & order by creditLimit
@app.route('/query')
def search_customers():
    query = "SELECT * FROM customers"

    #execute the query and fetch the results
    cursor = db.cursor(dictionary=True)
    cursor.execute(query)
    customers = cursor.fetchall()

    #request.args.get retrieve the arg in path
    first_name = request.args.get('first_name')
    last_name = request.args.get('last_name')

    if first_name:
        customers = [c for c in customers if 
                     c['contactFirstName'] == first_name]
    if last_name:
        customers = [c for c in customers if 
                     c['contactLastName'] == last_name]
        
    #sort by creditLimit
    customers = sorted(customers, key=lambda c: c['creditLimit'])

    #creditLimit is Decimal, need to be converted into string before jsonify
    for customer in customers:
        customer['creditLimit'] = str(customer['creditLimit'])

    return jsonify(customers)

#GET http://127.0.0.1:5000/customerNumber/125
#route to search by customerNumber
@app.route('/customerNumber/<int:customer_number>')
def list_customers(customer_number):
    query = f"SELECT * FROM customers WHERE customerNumber = {customer_number}"

    #execute the query and fetch the results
    cursor = db.cursor(dictionary=True)
    cursor.execute(query)
    #this time only expect to have null or one record
    customer = cursor.fetchone()

    if not customer:
        return jsonify({'error': 'Customer not found'}), 404
    
    customer['creditLimit'] = str(customer['creditLimit'])

    return jsonify(customer)

#PUT http://127.0.0.1:5000/customerNumber/125
'''
    {
    "firstName": "Kate",
    "lastName": "Doe",
    "creditLimit": 20000
    }

'''
@app.route('/customers/<int:customer_number>', methods=['PUT'])
def update_customer(customer_number):
    # Get the updated data from the request body
    data = request.get_json()
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    credit_limit = data.get('creditLimit')

    # Update the customer record in the database
    query = f"UPDATE customers SET contactFirstName = '{first_name}', contactLastName = '{last_name}', creditLimit = {credit_limit} WHERE customerNumber = {customer_number}"
    cursor = db.cursor()
    cursor.execute(query)
    db.commit()

    # Check if the customer record was updated successfully
    if cursor.rowcount == 0:
        return jsonify({'error': 'Customer not found'}), 404

    return jsonify({'success': 'Customer updated successfully'})

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)