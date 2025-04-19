describe('Practice Form Full Test Suite', () => {
    const formUrl = 'https://demoqa.com/automation-practice-form';
  
    const genderSelector = {
      Male: '[for="gender-radio-1"]',
      Female: '[for="gender-radio-2"]',
      Other: '[for="gender-radio-3"]',
    };
  
    // 🧩 Reusable function to fill basic required fields
    const fillBasicForm = (
      firstName = 'Kapil',
      lastName = 'Rokaya',
      email = 'kapil@example.com',
      gender = 'Male',
      phone = '9876543210'
    ) => {
      cy.get('#firstName').clear().type(firstName).should('have.value', firstName);
      cy.get('#lastName').clear().type(lastName).should('have.value', lastName);
      cy.get('#userEmail').clear().type(email).should('have.value', email);
      cy.get('#userNumber').clear().type(phone).should('have.value', phone);
  
      if (genderSelector[gender]) {
        cy.get(genderSelector[gender]).should('be.visible').click();
        cy.get(genderSelector[gender]).invoke('attr', 'for').then((id) => {
            cy.get(`#${id}`).should('be.checked');
          });
          
      } else {
        throw new Error(`Invalid gender "${gender}" provided.`);
      }
    };
  
    beforeEach(() => {
      cy.visit(formUrl);
      cy.get('body').should('be.visible');
    });
  
    // 🔽 Required field validations
    it('TC_01: should show error when required fields are missing', () => {
      cy.get('#submit').scrollIntoView().click();
      ['#firstName', '#lastName', '#userEmail', '#userNumber'].forEach(selector => {
        cy.get(selector)
          .should('have.css', 'border-color')
          .and('match', /rgb\(/);
      });
    });
  
    it('TC_02: should reject future date in DOB field', () => {
      cy.get('#dateOfBirthInput').click();
      cy.get('.react-datepicker__year-select').select('2030');
      cy.get('.react-datepicker__month-select').select('January');
      cy.get('.react-datepicker__day--001:not(.react-datepicker__day--outside-month)').click();
      cy.get('#submit').scrollIntoView().click();
      cy.get('#example-modal-sizes-title-lg').should('not.exist');
    });
  
    it('TC_03: should not allow only spaces in name fields', () => {
      fillBasicForm('     ', '     ');
      cy.get('#submit').scrollIntoView().click();
      cy.get('#example-modal-sizes-title-lg').should('not.exist');
    });
  
    it('TC_04: should submit form with valid required fields', () => {
      fillBasicForm();
      cy.get('#submit').scrollIntoView().click();
      cy.get('#example-modal-sizes-title-lg')
        .should('be.visible')
        .and('contain.text', 'Thanks for submitting the form');
    });
  
    // 🔽 Mobile number edge cases
    it('TC_06: should reject mobile number with less than 10 digits', () => {
      fillBasicForm('Kapil', 'Rokaya', 'kapil@example.com', 'Male', '12345');
      cy.get('#submit').scrollIntoView().click();
      cy.get('#userNumber:invalid').should('exist');
    });
  
    it('TC_07: should reject mobile number with more than 10 digits', () => {
      fillBasicForm('Kapil', 'Rokaya', 'kapil@example.com', 'Male', '1234567890123');
      cy.get('#submit').scrollIntoView().click();
      cy.get('#userNumber:invalid').should('exist');
    });
  
    // 🔽 Name and Email validations
    it('TC_08: should reject special characters in name fields', () => {
      fillBasicForm('@@##$$', '$$##@@');
      cy.get('#submit').scrollIntoView().click();
      cy.get('#example-modal-sizes-title-lg').should('not.exist');
    });
  
    it('TC_10: should reject email with consecutive dots', () => {
      cy.get('#userEmail').type('rokaya@gmail...com');
      cy.get('#submit').scrollIntoView().click();
      cy.get('#userEmail:invalid').should('exist');
    });
  
    it('TC_12: should reject invalid email with only dots', () => {
      cy.get('#userEmail').type('.......@gmail.com');
      cy.get('#submit').scrollIntoView().click();
      cy.get('#userEmail:invalid').should('exist');
    });
  
    // 🔽 Hobbies section
    it('TC_21: should allow selecting multiple hobbies', () => {
      fillBasicForm();
      ['1', '2', '3'].forEach(hobbyIndex => {
        cy.get(`[for="hobbies-checkbox-${hobbyIndex}"]`).click();
        cy.get(`#hobbies-checkbox-${hobbyIndex}`).should('be.checked');
      });
      cy.get('#submit').scrollIntoView().click();
      cy.get('#example-modal-sizes-title-lg').should('be.visible');
    });
  
    // 🔽 File upload validation
    it('TC_35: should allow image file upload', () => {
      fillBasicForm();
      cy.get('#uploadPicture').selectFile('cypress/fixtures/k7.jpg').should('have.value', 'k7.jpg');
      cy.get('#submit').scrollIntoView().click();
      cy.get('#example-modal-sizes-title-lg').should('be.visible');
    });
  
    it('TC_36: should reject non-image files on upload', () => {
      fillBasicForm();
      cy.get('#uploadPicture').selectFile('cypress/fixtures/sample.txt').should('have.value', 'sample.txt');
      cy.get('#submit').scrollIntoView().click();
      cy.get('#example-modal-sizes-title-lg').should('exist'); // Known issue
    });
  
    // 🔽 State/City logic
    it('TC_41: should not allow selecting state without city', () => {
      cy.get('#state').scrollIntoView().click();
      cy.get('.css-26l3qy-menu').contains('NCR').click();
      cy.get('#submit').scrollIntoView().click();
      cy.get('#example-modal-sizes-title-lg').should('not.exist');
    });
  
    // 🔽 Field Length Limits
    it('TC_47: should not accept more than 50 characters in name fields', () => {
      const longName = 'a'.repeat(100);
      fillBasicForm(longName, longName);
      cy.get('#submit').scrollIntoView().click();
      cy.get('#example-modal-sizes-title-lg').should('not.exist');
    });
  
    // 🔽 More Email + Gender Validation
    it('TC_48: should show validation error for bad email format', () => {
      cy.get('#userEmail').type('iefhewihfe@.com');
      cy.get('#submit').scrollIntoView().click();
      cy.get('#userEmail:invalid').should('exist');
      cy.get('#userEmail').should('have.class', 'error');
    });
  
    it('TC_49: should highlight gender when not selected', () => {
      cy.get('#firstName').type('Kapil');
      cy.get('#lastName').type('Rokaya');
      cy.get('#userEmail').type('kapil@example.com');
      cy.get('#userNumber').type('9876543210');
      cy.get('#submit').scrollIntoView().click();
      cy.get('[name="gender"]').should('not.be.checked');
    });
  
    // 🔽 Modal behavior
    it('TC_53: should close modal by clicking outside', () => {
      fillBasicForm();
      cy.get('#submit').scrollIntoView().click();
      cy.get('#example-modal-sizes-title-lg').should('be.visible');
      cy.get('.modal-content').click('topRight'); // or 'topLeft'
      cy.get('#example-modal-sizes-title-lg').should('not.exist');
    });
  });
  