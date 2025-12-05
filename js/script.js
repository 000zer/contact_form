/* ===================================
   DOM ELEMENTS SELECTION
   =================================== */
const form = document.querySelector('.contact-form');

/* ===================================
   ERROR HANDLING FUNCTIONS
   =================================== */
// Show error message for field
function showError(input) {
  const errorSpan = input.parentElement.querySelector('.error-message');
  if (errorSpan) {
    errorSpan.style.display = 'block';
  }
  input.classList.add('error');
}

// Hide error message for field
function hideError(input) {
  const errorSpan = input.parentElement.querySelector('.error-message');
  if (errorSpan) {
    errorSpan.style.display = 'none';
  }
  input.classList.remove('error');
}

/* ===================================
   FIELD VALIDATION FUNCTIONS
   =================================== */
// Validate individual form field
function validateField(field) {
  const fieldId = field.id || field.name;
  
  switch(fieldId) {
    // First Name and Last Name validation
    case 'first-name':
    case 'last-name':
      if (!field.value.trim()) {
        showError(field);
        return false;
      }
      hideError(field);
      return true;
      
    // Email validation
    case 'email':
      const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
      if (!field.value.trim()) {
        showError(field);
        return false;
      }
      if (!emailPattern.test(field.value)) {
        showError(field);
        return false;
      }
      hideError(field);
      return true;
      
    // Message validation
    case 'message':
      if (!field.value.trim()) {
        showError(field);
        return false;
      }
      hideError(field);
      return true;
      
    // Consent checkbox validation
    case 'consent':
      if (!field.checked) {
        showError(field);
        return false;
      }
      hideError(field);
      return true;
  }
  return true;
}

// Validate radio button group (Query Type)
function validateRadioGroup(name) {
  const checkedRadio = form.querySelector(`input[name="${name}"]:checked`);
  const radioGroup = form.querySelector(`input[name="${name}"]`)?.closest('.radio-group');
  const errorSpan = radioGroup?.querySelector('.error-message');
  
  if (!checkedRadio) {
    if (errorSpan) {
      errorSpan.style.display = 'block';
    }
    radioGroup?.classList.add('error');
    return false;
  }
  
  if (errorSpan) {
    errorSpan.style.display = 'none';
  }
  radioGroup?.classList.remove('error');
  return true;
}

// Validate entire form
function validateForm() {
  let isValid = true;
  
  // Validate text fields
  const fieldsToValidate = ['first-name', 'last-name', 'email', 'message', 'consent'];
  fieldsToValidate.forEach(fieldId => {
    const field = form.querySelector(`#${fieldId}`);
    if (field && !validateField(field)) {
      isValid = false;
    }
  });
  
  // Validate radio buttons
  if (!validateRadioGroup('queryType')) {
    isValid = false;
  }
  
  return isValid;
}

/* ===================================
   REAL-TIME VALIDATION LISTENERS
   =================================== */
form.querySelectorAll('input, textarea').forEach(field => {
  
  // On blur event
  field.addEventListener('blur', () => {
    if (field.type === 'radio') {
      validateRadioGroup(field.name);
    } else {
      validateField(field);
    }
  });
  
  // On input event (text fields only)
  if (field.type !== 'radio' && field.type !== 'checkbox') {
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) {
        validateField(field);
      }
    });
  }
  
  // On change event (checkbox)
  if (field.type === 'checkbox') {
    field.addEventListener('change', () => {
      validateField(field);
    });
  }
  
  // On change event (radio buttons)
  if (field.type === 'radio') {
    field.addEventListener('change', () => {
      validateRadioGroup(field.name);
    });
  }
});

/* ===================================
   FORM SUBMISSION
   =================================== */
form.addEventListener('submit', function(event) {
  event.preventDefault();
  
  if (validateForm()) {
    // Form is valid - proceed with submission
    console.log('Form is valid! Submitting...');
    
    // Show success message
    showSuccessMessage();
  } else {
    console.log('Form has errors!');
  }
});

/* ===================================
   SUCCESS MESSAGE DISPLAY
   =================================== */
function showSuccessMessage() {
  const successMessage = document.querySelector('.success-message');
  
  if (successMessage) {
    // Display success message
    successMessage.style.display = 'block';
    
    // Scroll to message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Reset form
    form.reset();
    
    // Hide all error messages
    document.querySelectorAll('.error-message').forEach(error => {
      error.style.display = 'none';
    });
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 5000);
  }
}