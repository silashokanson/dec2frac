document.addEventListener('DOMContentLoaded', () => {
  // Function to handle calculation
  function performCalculation(input) {
    import('./mathFunctions.js').then(module => {
      const result = module.prettyPrintResult(input);
      document.getElementById('resultDisplay').textContent = result;
    }).catch(err => {
      console.error('Error importing the module:', err);
    });
  }

  // Extract the number from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const numberFromUrl = urlParams.get('number'); // Get the 'number' query parameter
  
  if (numberFromUrl) {
    // Set the input value and perform the calculation
    document.getElementById('numberInput').value = numberFromUrl;
    performCalculation(numberFromUrl);
  }

  // Set up the event listener for the button
  document.getElementById('calculateBtn').addEventListener('click', () => {
    const input = document.getElementById('numberInput').value;
    performCalculation(input);
  });
});
