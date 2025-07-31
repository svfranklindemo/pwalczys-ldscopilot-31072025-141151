export default function decorate(block) {
  // Create the mortgage calculator form
  const form = document.createElement('form');
  form.className = 'mortgage-calculator-form';

  // Create main calculator section
  const calculatorMain = document.createElement('div');
  calculatorMain.className = 'calculator-main';

  // Purchase Price Input
  const purchasePrice = document.createElement('div');
  purchasePrice.className = 'form-group purchase-price';
  purchasePrice.innerHTML = `
    <label for="purchase-price">Purchase price</label>
    <div class="slider-container">
      <div class="value-display">$<span id="purchase-price-value">240,000</span></div>
      <input type="range" id="purchase-price" min="25000" max="2500000" value="240000" step="1000">
      <div class="range-limits">
        <span>$25,000</span>
        <span>$2,500,000</span>
      </div>
    </div>
  `;

  // Down Payment Input
  const downPayment = document.createElement('div');
  downPayment.className = 'form-group down-payment';
  downPayment.innerHTML = `
    <label for="down-payment">Down payment</label>
    <div class="slider-container">
      <div class="value-display">$<span id="down-payment-value">35,000</span></div>
      <input type="range" id="down-payment" min="0" max="500000" value="35000" step="1000">
      <div class="range-limits">
        <span>$0</span>
        <span>$500,000</span>
      </div>
    </div>
    <small>5% or more of purchase price</small>
  `;

  // Create a row for Mortgage Term and ZIP Code
  const termAndZipRow = document.createElement('div');
  termAndZipRow.className = 'form-row';

  // Mortgage Term Select
  const mortgageTerm = document.createElement('div');
  mortgageTerm.className = 'form-group';
  mortgageTerm.innerHTML = `
    <label for="mortgage-term">Mortgage term</label>
    <select id="mortgage-term">
      <option value="30">30 year fixed</option>
      <option value="15">15 year fixed</option>
      <option value="10">10 year fixed</option>
    </select>
  `;

  // ZIP Code Input
  const zipCode = document.createElement('div');
  zipCode.className = 'form-group';
  zipCode.innerHTML = `
    <label for="zip-code">ZIP code</label>
    <input type="text" id="zip-code" value="94115" pattern="[0-9]{5}" maxlength="5">
  `;

  // Add mortgage term and zip code to the row
  termAndZipRow.appendChild(mortgageTerm);
  termAndZipRow.appendChild(zipCode);

  // Result Section
  const result = document.createElement('div');
  result.className = 'mortgage-result';
  result.innerHTML = `
    <div class="monthly-payment">
      <h2>$<span id="monthly-payment-value">1,333</span></h2>
      <p>Monthly Payment</p>
    </div>
    <button type="button" class="apply-now">Apply Now</button>
    <p class="estimate-text">Estimate how much you could be paying monthly for your mortgage.</p>
  `;

  // Append elements to calculator main
  calculatorMain.appendChild(purchasePrice);
  calculatorMain.appendChild(downPayment);
  calculatorMain.appendChild(termAndZipRow);

  // Append calculator main and result to form
  form.appendChild(calculatorMain);
  form.appendChild(result);

  // Add event listeners
  form.querySelectorAll('input[type="range"]').forEach((slider) => {
    slider.addEventListener('input', updateValues);
    // Initialize the gradient
    updateSliderGradient(slider);
  });

  form.querySelector('.apply-now').addEventListener('click', handleApplyNow);
  form.querySelector('#mortgage-term').addEventListener('change', calculateMortgage);
  form.querySelector('#zip-code').addEventListener('input', validateZipCode);

  // Clear the block and append the form
  block.textContent = '';
  block.appendChild(form);

  // Initial calculation
  calculateMortgage();
}

function updateValues(e) {
  const value = parseInt(e.target.value, 10);
  const formattedValue = new Intl.NumberFormat('en-US').format(value);
  
  document.getElementById(`${e.target.id}-value`).textContent = formattedValue;
  updateSliderGradient(e.target);
  calculateMortgage();

  // Update down payment minimum if purchase price changes
  if (e.target.id === 'purchase-price') {
    const downPaymentSlider = document.getElementById('down-payment');
    const minDownPayment = Math.max(0, Math.floor(value * 0.05));
    downPaymentSlider.min = minDownPayment;
    if (parseInt(downPaymentSlider.value, 10) < minDownPayment) {
      downPaymentSlider.value = minDownPayment;
      document.getElementById('down-payment-value').textContent = 
        new Intl.NumberFormat('en-US').format(minDownPayment);
      updateSliderGradient(downPaymentSlider);
    }
  }
}

function updateSliderGradient(slider) {
  const percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.background = `linear-gradient(to right, #0891B2 0%, #0891B2 ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`;
}

function validateZipCode(e) {
  const input = e.target;
  input.value = input.value.replace(/\D/g, '').slice(0, 5);
}

function calculateMortgage() {
  const purchasePrice = parseFloat(document.getElementById('purchase-price').value);
  const downPayment = parseFloat(document.getElementById('down-payment').value);
  const mortgageTerm = parseInt(document.getElementById('mortgage-term').value, 10);
  
  // Assuming 6% annual interest rate
  const annualRate = 0.06;
  const monthlyRate = annualRate / 12;
  const numberOfPayments = mortgageTerm * 12;
  const principal = purchasePrice - downPayment;

  const monthlyPayment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  document.getElementById('monthly-payment-value').textContent = 
    new Intl.NumberFormat('en-US').format(Math.round(monthlyPayment));
}

function handleApplyNow() {
  // Handle the apply now button click
  console.log('Apply Now clicked');
} 