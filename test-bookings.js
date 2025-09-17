const axios = require('axios');

axios.get('http://localhost:5000/api/admin/bookings', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzA5ZjQzYzQ0YzQ0ZjAwMTUxMzQ0YzQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Mjg3MzU4MDQsImV4cCI6MTcyODgyMjIwNH0.5J5s5K5s5K5s5K5s5K5s5K5s5K5s5K5s5K5s5K5s5K5'
  }
})
.then(res => console.log('Success:', res.data))
.catch(err => console.log('Error:', err.response ? err.response.data : err.message));