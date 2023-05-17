
var app = new Vue({
  el: "#app",
  data: {
    customers: [],
    selectedCustomer: null,
    istrue: false,
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
      console.log('Entered showDetails');
      // Fetch the customer data for the selected customer number
      fetch("http://127.0.0.1:5000/customerNumber/" + customer.customerNumber)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          this.selectedCustomer = data;
          console.log(this.selectedCustomer.cosutmerName);
        })
        .catch(error => {
          console.log('There was a problem with the fetch operation:', error);
          this.selectedCustomer = [];
        });
    },
  },

})