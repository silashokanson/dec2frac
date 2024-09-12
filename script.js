// script.js

document.getElementById('calculateBtn').addEventListener('click', function() {
  const input = document.getElementById('numberInput').value;
  
  // Import the function from another script
  import('./mathFunctions.js').then(module => {
    const result = module.prettyPrintResult(input);
    document.getElementById('resultDisplay').textContent = result;
  }).catch(err => {
    console.error('Error importing the module:', err);
  });
});