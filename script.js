document.addEventListener('DOMContentLoaded', () => {
  //console.log('DOM fully loaded and parsed');

  // Function to handle calculation
  async function performCalculation(input) {
    try {
      const module = await import('./mathFunctions.js');
      const result = module.prettyPrintResult(input);
      document.getElementById('resultDisplay').textContent = result;
    } catch (err) {
      //console.error('Error importing the module:', err);
    }
  }

  // Extract the number from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const numberFromUrl = urlParams.get('num'); // Get the 'number' query parameter
  
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
