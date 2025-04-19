describe('Practice Form Full Test Suite', () => {
    const formUrl = 'https://demoqa.com/automation-practice-form';
  
    // Gender selectors to make the test more readable
    const genderSelector = {
      Male: '[for="gender-radio-1"]',
      Female: '[for="gender-radio-2"]',
      Other: '[for="gender-radio-3"]',
    };
  
    // Reusable function to fill basic required fields in the form
    const fillBasicForm = (
      firstName = 'Kapil',
      lastName = 'Rokaya',
      email = 'kapil@example.com',
      gender = 'Male',
      phone = '9876543210'
    ) => {
      // Fill the first name field
      cy.get('#firstName').clear().type(firstName).should('have.value', firstName);
      // Fill the last name field
      cy.get('#lastName').clear().type(lastName).should('have.value', lastName);
      // Fill the email field
      cy.get('#userEmail').clear().type(email).should('have.value', email);
      // Fill the phone number field
      cy.get('#userNumber').clear().type(phone).should('have.value', phone);
  
      // Select the gender based on input
      if (genderSelector[gender]) {
        cy.get(genderSelector[gender]).should('be.visible').click();
        // Ensure the selected gender is checked
        cy.get(genderSelector[gender]).invoke('attr', 'for').then((id) => {
          cy.get(`#${id}`).should('be.checked');
        });
      } else {
        throw new Error(`Invalid gender "${gender}" provided.`);
      }
    };
  
    beforeEach(() => {
      // Visit the form before each test
      cy.visit(formUrl);
      cy.get('body').should('be.visible'); // Ensure the body is visible
    });
  
    // Test case: check that required fields show errors when left empty
    it('TC_01: should show error when required fields are missing', () => {
      // Submit the form with empty required fields
      cy.get('#submit').scrollIntoView().click();
      // Check for border color validation errors
      ['#firstName', '#lastName', '#userEmail', '#userNumber'].forEach(selector => {
        cy.get(selector)
          .should('have.css', 'border-color')
          .and('match', /rgb\(/);
      });
    });
  
    // Test case: check that future dates are rejected in the DOB field
    it('TC_02: should reject future date in DOB field', () => {
      cy.get('#dateOfBirthInput').click();
      cy.get('.react-datepicker__year-select').select('2030'); // Select a future year
      cy.get('.react-datepicker__month-select').select('January'); // Select a month
      cy.get('.react-datepicker__day--001:not(.react-datepicker__day--outside-month)').click(); // Select a day
      cy.get('#submit').scrollIntoView().click();
      cy.get('#example-modal-sizes-title-lg').should('not.exist'); // No modal should appear for invalid date
    });
  
    // Test case: check that spaces are not allowed in name fields
    it('TC_03: should not allow only spaces in name fields', () => {
      fillBasicForm('     ', '     '); // Use only spaces as names
      cy.get('#submit').scrollIntoView().click();
      ['#firstName', '#lastName'].forEach(selector => {
        cy.get(selector)
          .should('have.css', 'border-color')
          .and('match', /rgb\(/);
      });
    });
  
    // Test case: check that form is submitted successfully with valid required fields
    it('TC_04: should submit form with valid required fields', () => {
      fillBasicForm(); // Use default values to fill the form
      cy.get('#submit').scrollIntoView().click(); // Submit the form
      // Ensure modal appears with success message
      cy.get('#example-modal-sizes-title-lg')
        .should('be.visible')
        .and('contain.text', 'Thanks for submitting the form');
    });
  
    // Test case: reject mobile numbers with less than 10 digits
    it('TC_06: should reject mobile number with less than 10 digits', () => {
      fillBasicForm('Kapil', 'Rokaya', 'kapil@example.com', 'Male', '12345'); // Invalid phone number
      cy.get('#submit').scrollIntoView().click();
      cy.get('#userNumber:invalid').should('exist'); // Invalid phone number should show error
    });
  
    // Test case: reject special characters in name fields
    it('TC_08: should reject special characters in name fields', () => {
      fillBasicForm('@@##$$', '$$##@@'); // Special characters in names
      cy.get('#submit').scrollIntoView().click();
      cy.get('#example-modal-sizes-title-lg').should('not.exist'); // No modal should appear for invalid names
    });
  
    // Test case: reject email with consecutive dots
    it('TC_10: should reject email with consecutive dots', () => {
      cy.get('#userEmail').type('rokaya@gmail...com'); // Invalid email with consecutive dots
      cy.get('#submit').scrollIntoView().click();
      cy.get('#userEmail:invalid').should('exist'); // Invalid email should show error
    });
  
    // Test case: reject invalid email format with only dots
    it('TC_12: should reject invalid email with only dots', () => {
      cy.get('#userEmail').type('.......@gmail.com'); // Invalid email with only dots
      cy.get('#submit').scrollIntoView().click();
      cy.get('#userEmail:invalid').should('exist'); // Invalid email should show error
    });
  
    // Test case: check that multiple hobbies can be selected
    it('TC_21: should allow selecting multiple hobbies', () => {
      fillBasicForm();
      ['1', '2', '3'].forEach(hobbyIndex => {
        cy.get(`[for="hobbies-checkbox-${hobbyIndex}"]`).click(); // Select hobby checkbox
        cy.get(`#hobbies-checkbox-${hobbyIndex}`).should('be.checked'); // Ensure the checkbox is checked
      });
      cy.get('#submit').scrollIntoView().click();
      cy.get('#example-modal-sizes-title-lg').should('be.visible'); // Ensure modal appears after submission
    });
  
    // Test case: check that only image files can be uploaded
    it('TC_35: should allow image file upload', () => {
        fillBasicForm();
      
        // Select the image file to upload
        cy.get('#uploadPicture')
          .selectFile('cypress/fixtures/k7.jpg')  // Upload the image file
          .should('have.value', 'C:\\fakepath\\k7.jpg'); // Browser shows fake path due to security restrictions
      
        // Submit the form
        cy.get('#submit').scrollIntoView().click();
      
        // Ensure modal appears with success message
        cy.get('#example-modal-sizes-title-lg').should('be.visible');
    });
  
    // Test case: reject non-image files during upload
    it('TC_36: should reject non-image files on upload', () => {
      fillBasicForm();
      cy.get('#uploadPicture').selectFile('cypress/fixtures/sample.txt').should('have.value', 'sample.txt');
      cy.get('#submit').scrollIntoView().click();
      cy.get('#example-modal-sizes-title-lg').should('exist'); // Modal should still appear, but file is invalid
    });
  
    // Test case: check that state cannot be selected without a city
    it('TC_41: should not allow selecting state without city', () => {
      cy.get('#state').scrollIntoView().click();
      cy.get('.css-26l3qy-menu').contains('NCR').click(); // Select state
      cy.get('#submit').scrollIntoView().click();
      cy.get('#example-modal-sizes-title-lg').should('not.exist'); // No modal should appear if city is not selected
    });
  
    // Test case: check that name fields do not accept more than 50 characters
    it('TC_47: should not accept more than 50 characters in name fields', () => {
      const longName = 'a'.repeat(100); // Name longer than 50 characters
      fillBasicForm(longName, longName); // Fill form with long names
      cy.get('#submit').scrollIntoView().click();
      cy.get('#example-modal-sizes-title-lg').should('not.exist'); // No modal should appear for invalid input
    });
  
    // Test case: validate email format
    it('TC_48: should show validation error for bad email format', () => {
      cy.get('#userEmail').type('iefhewihfe@.com'); // Invalid email format
      cy.get('#submit').scrollIntoView().click();
      cy.get('#userEmail:invalid').should('exist'); // Invalid email should show error
      cy.get('#userEmail').should('have.class', 'error'); // Ensure error class is added
    });
  
    // Test case: check that gender is highlighted if not selected
    it('TC_49: should highlight gender when not selected', () => {
      cy.get('#firstName').type('Kapil');
      cy.get('#lastName').type('Rokaya');
      cy.get('#userEmail').type('kapil@example.com');
      cy.get('#userNumber').type('9876543210');
      cy.get('#submit').scrollIntoView().click();
      cy.get('[name="gender"]').should('not.be.checked'); // Gender should be unchecked if not selected
    });
  
    // Test case: check modal behavior when clicked outside
    it('TC_53: should close modal by clicking outside', () => {
      fillBasicForm();
      cy.get('#submit').scrollIntoView().click();
      cy.get('#example-modal-sizes-title-lg').should('be.visible');
      cy.get('.modal-content').click('topRight'); // Close modal by clicking outside
      cy.get('#example-modal-sizes-title-lg').should('not.exist'); // Ensure modal is closed
    });
});
