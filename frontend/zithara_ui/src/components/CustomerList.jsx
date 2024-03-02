import React, { useState, useEffect } from 'react';

function CustomerList() {
  const customersPerPage = 20;

  const [customers, setCustomers] = useState([]);
  
  // this is used to store the original list of customers
  const [globalCustomers, setGlobalCustomers] = useState([]); 

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  // Sorting
  const [sortByName, setSortByName] = useState('');

  // Initial fetch of customers
  useEffect(() => {
    fetch('http://localhost:3000/getUsers')
      .then((response) => response.json())
      .then((data) => setCustomers(data))
      .catch((error) => console.error(error));
      setGlobalCustomers(customers);
  }, []); // empty array to run only once when initially loaded

  // Sorting the customers based on opted value
  useEffect(() => {
    if(sortByName === 'sortBy')  { // reset the customers to the original list
      setCustomers(globalCustomers);
      return;
    }
    const sortedCustomers = [...customers].sort((a, b) => {
      if (sortByName === 'date') {
        const dateA = new Date(a.created_at).toLocaleDateString();
        const dateB = new Date(b.created_at).toLocaleDateString();
        return new Date(dateA) - new Date(dateB);
      } else if (sortByName === 'time') {
        const timeA = new Date(a.created_at).toLocaleTimeString();
        const timeB = new Date(b.created_at).toLocaleTimeString();
        return timeA.localeCompare(timeB);
      }
      return 0;
    });
    setCustomers(sortedCustomers);
    console.log(" value: " + sortByName + " " + sortedCustomers);
    setCurrentPage(1);
  }, [sortByName]); // this will run when the sortByName value changes

  // Search Functionality
  const handleSearch = async () => {
    const res = await fetch('http://localhost:3000/getSearchUsers?searchTerm=' + searchTerm, );
    const data = await res.json();
    setCustomers(data);
    setCurrentPage(1);// here we are resetting the page value to 1
  };

  // Pagination
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h1>Customer List</h1>
      <div>
        <div> 
          <label>
            Search by name or location: &nbsp;
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </label>
        </div>
        <div>
          <label>
            Sort by: &nbsp;
            <select value={sortByName} onChange={(e)=>{
              console.log(" value: " + e.target.value);
              setSortByName(e.target.value);
              console.log(" value: " + sortByName);
              }}>
              
              <option value="sortBy">Sort By</option>
              <option value="date">Date</option>
              <option value="time">Time</option>
            </select>
          </label>
        </div>
      </div>
      <hr></hr>
      <table align="center">
        <thead>
          <tr>
            <th>Serial No</th>
            <th>Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map((customer, index) => (
            <tr key={index}>
              <td>{customer.sno}</td>
              <td>{customer.customer_name}</td>
              <td>{customer.age}</td>
              <td>{customer.phone}</td>
              <td>{customer.location}</td>
              <td>{new Date(customer.created_at).toLocaleDateString()}</td>
              <td>{new Date(customer.created_at).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(customers.length / customersPerPage) }, (_, index) => (
          <div key={index} className={currentPage === index + 1 ? 'active' : ''}>
            <button onClick={() => paginate(index + 1)}>{index + 1}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerList;