
var app = new Vue({
    el: "#app",
    data: {
      customers: [],
      selectedCustomer: {},
      searchTerm: '',
      show: false,
    },
    delimiters: ['{', '}']
    ,
    created() {
      //const table = document.getElementById('customersTable');
      //table.classList.add('invisible');
      fetch('http://127.0.0.1:5000/query')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          this.customers = data;
          console.log(this.customers);
        })
        .catch(error => {
          console.log('There was a problem with the fetch operation:', error);
        });
    },
    methods: {
      showDetails(customer) {
        fetch("http://127.0.0.1:5000/customerNumber/" + customer.customerNumber)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            this.selectedCustomer = data;
            this.show = true;
          })
          .catch(error => {
            console.log('There was a problem with the fetch operation:', error);
            this.selectedCustomer = {};
            this.show = false;
          });
      },
      fetchCustomers() {
        fetch('http://127.0.0.1:5000/query')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            this.customers = data;
            console.log(this.customers);
          })
          .catch(error => {
            console.log('There was a problem with the fetch operation:', error);
          });
      },
      updateCustomer() {
        fetch(`http://127.0.0.1:5000/customers/${this.selectedCustomer.customerNumber}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firstName: this.selectedCustomer.contactFirstName,
            lastName: this.selectedCustomer.contactLastName,
            creditLimit: this.selectedCustomer.creditLimit
          })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          console.log(response.json());
          // fetch the updated customer data from the server
          this.fetchCustomers();
          this.show = false;
        })
        .catch(error => {
          console.log('There was a problem with the fetch operation:', error);
        });
      },
      shows(){
        this.show = !this.show;
      }
    },
    computed: {
      filteredCustomers() {
        return this.customers.filter(c => {
          const name = c.customerName.toLowerCase();
          const term = this.searchTerm.toLowerCase();
          return name.includes(term);
        });
      },
    },
  
  })