document.addEventListener('DOMContentLoaded', () => {
  const resultDisplay = document.getElementById('resultDisplay');
  const toggleSwitch = document.getElementById('toggleSwitch');
  const toggleLabel = document.getElementById('toggleLabel');
  let copyHandler = null;  // Ensure this is defined at the start

  // Default state
  let displayMode = 'mixed'; // Default to Mixed Number

  // Function to handle calculation
  async function performCalculation(input) {
    try {
      const module = await import('./mathFunctions.js');
      const [integerPart, fractionNumerator, fractionDenominator] = module.dec2frac(input);

      // Format the result based on the current display mode
      let result;
      if (displayMode === 'mixed') {
        result = formatFraction(integerPart, fractionNumerator, fractionDenominator);
      } else {
        result = formatFractionAsFraction(integerPart, fractionNumerator, fractionDenominator);
      }

      resultDisplay.innerHTML = result;

      // Set the text for copying and manage click event
      setCopyableText(integerPart, fractionNumerator, fractionDenominator, displayMode);
    } catch (err) {
      console.error('Error importing the module:', err);
    }
  }

  // Function to format the mixed fraction as HTML with a horizontal line
  function formatFraction(integerPart, numerator, denominator) {
    let result = '';

    // Use a flexbox container to center the integer part vertically with the fraction
    result += `<div style="display: flex; align-items: center; justify-content: center;">`;

    result+=`<div style="margin-right: 10px;">`;
    if (integerPart !== 0n) {
        result += `${integerPart}`;
      if (numerator !== 0n) {
        if ((numerator < 0n && denominator > 0n) || (numerator > 0n && denominator < 0n)) {
          result += ` - `;
        } else {
          result += ` + `;
        }
      }
    } else {
      if ((numerator < 0n && denominator > 0n) || (numerator > 0n && denominator < 0n)) {
        result += `-`;
      }
    }
    result += `</div>`;

    // If there's a fractional part, display it
    if (numerator !== 0n) {
      numerator = numerator < 0n ? -numerator : numerator;
      denominator = denominator < 0n ? -denominator : denominator;
      result += `<div style="display: inline-block; text-align: center;">
                    <div>${numerator}</div>
                    <div style="border-top: 1px solid black;">${denominator}</div>
                 </div>`;
    }

    if(numerator == 0n && integerPart == 0n){
      result += '0';
    }

    // Close the flex container
    result += `</div>`;

    return result.trim(); // Ensure no trailing whitespace
  }

  // Function to format the fraction as a simple fraction (e.g., 7/4)
  function formatFractionAsFraction(integerPart, numerator, denominator) {
    let result = '';
    result += `<div style="display: flex; align-items: center; justify-content: center;">`;
    if(integerPart < 0n) {
      result += `<div style="margin-right: 10px;">-</div>`;
    } else if (integerPart == 0 && ((numerator < 0 && denominator > 0) || (numerator > 0 && denominator < 0))) {
      result += `<div style="margin-right: 10px;">-</div>`;
    }
    numerator += denominator * integerPart;
    numerator = numerator < 0n ? -numerator : numerator;
    denominator = denominator < 0n ? -denominator : denominator;
    result += `<div style="display: inline-block; text-align: center;">
                    <div>${numerator}</div>
                    <div style="border-top: 1px solid black;">${denominator}</div>`;
    return result.trim(); // Ensure no trailing whitespace
  }

  // Function to set the string to be copied to clipboard
  function setCopyableText(integerPart, numerator, denominator, displayMode) {
    let text = '(';
    if (integerPart !== 0n) {
      if(displayMode == `mixed`){
        text += `${integerPart}`;
      } else {
        numerator += denominator*integerPart;
      }
      if (numerator !== 0n) {
        if ((numerator < 0n && denominator > 0n) || (numerator > 0n && denominator < 0n)) {
          text += `-`;
        } else {
          if(displayMode == `mixed`){
            text += `+`;
          }
        }
      }
    } else {
      if ((numerator < 0n && denominator > 0n) || (numerator > 0n && denominator < 0n)) {
        text += `-`;
      }
    }
    if (numerator !== 0n) {
      numerator = numerator < 0n ? -numerator : numerator;
      denominator = denominator < 0n ? -denominator : denominator;
      text += `${numerator}/${denominator}`;
    }
    text += `)`;

    // Define the click event handler
    const newCopyHandler = () => {
      copyToClipboard(text);
    };

    // Remove previous click event listener, if any
    if (copyHandler) {
      resultDisplay.removeEventListener('click', copyHandler);
    }
    
    // Add the new click event listener
    copyHandler = newCopyHandler;
    resultDisplay.addEventListener('click', copyHandler);
  }

  // Function to copy text to clipboard
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${text} copied to clipboard`);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  }

  // Function to show a brief overlay message
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 1000); // Duration of fade-out animation
    }, 1000); // Duration of toast visibility
  }

  // Handle the toggle switch change
  toggleSwitch.addEventListener('change', () => {
    displayMode = toggleSwitch.checked ? 'mixed' : 'fraction';
    toggleLabel.innerText = toggleSwitch.checked ? 'Mixed Number' : 'Fraction';
    performCalculation(document.getElementById('numberInput').value); // Recalculate with the new mode
  });

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
