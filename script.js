document.addEventListener('DOMContentLoaded', () => {
  // Function to handle calculation
  async function performCalculation(input) {
    try {
      const module = await import('./mathFunctions.js');
      const [integerPart, fractionNumerator, fractionDenominator] = module.dec2frac(input);
      
      // Format the result as a mixed fraction with a horizontal line
      let result = formatFraction(integerPart, fractionNumerator, fractionDenominator);
      document.getElementById('resultDisplay').innerHTML = result;
    } catch (err) {
      console.error('Error importing the module:', err);
    }
  }

  // Function to format the mixed fraction as HTML with a horizontal line
  function formatFraction(integerPart, numerator, denominator) {
    let result = '';

    // Use a flexbox container to center the integer part vertically with the fraction
    result += `<div style="display: flex; align-items: center; justify-content: center;">`;

    if(integerPart !== 0n) {
      result += `<div style="margin-right: 10px;">${integerPart}`;
      if(numerator !== 0n) {
        result += ` + </div>`;
      }
      else
        result += `</div>`;
    }


    // If there's a fractional part, display it
    if (numerator !== 0n) {
      result += `<div style="display: inline-block; text-align: center;">
                    <div>${numerator}</div>
                    <div style="border-top: 1px solid black;">${denominator}</div>
                 </div>`;
    }

    // Close the flex container
    result += `</div>`;

    return result.trim();  // Ensure no trailing whitespace
}


  // Extract the number from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const numberFromUrl = urlParams.get('num');
  
  if (numberFromUrl) {
    document.getElementById('numberInput').value = numberFromUrl;
    performCalculation(numberFromUrl);
  }

  // Set up the event listener for the input field
  const numberInput = document.getElementById('numberInput');
  if (numberInput) {
    numberInput.addEventListener('input', (event) => {
      const input = event.target.value;
      performCalculation(input);
    });
  }
});
