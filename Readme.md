
# Cypress Test Suite for DemoQA Automation Practice Form

## Overview

This repository contains a comprehensive **Cypress test suite** designed to validate the functionality and behavior of the **DemoQA Automation Practice Form**. The suite tests various aspects of the form, including field validation, image file upload, form submission, and error handling.

The tests ensure that the form works as expected across different scenarios, including edge cases and invalid inputs.

## Features

- **Field Validation:** Ensures required fields are validated correctly (e.g., first name, last name, email, phone number).
- **Email Validation:** Verifies that the email field accepts only valid email formats.
- **Phone Number Validation:** Tests if the phone number field accepts only valid numbers with correct formatting.
- **File Upload:** Validates the file upload functionality, including handling both valid and invalid files.
- **Modal Behavior:** Ensures that the success modal appears after form submission and can be closed by clicking outside the modal.
- **State/City Selection Logic:** Verifies that a state cannot be selected without a corresponding city.

## Test Cases

### Test Case 1: Required Field Validation
- **Description:** Tests if an error message is displayed when any of the required fields are missing.
- **Steps:**
  1. Leave all required fields empty.
  2. Click the submit button.
  3. Verify that the fields are highlighted with a border indicating an error.

### Test Case 2: Reject Future Date in Date of Birth
- **Description:** Ensures that selecting a future date in the Date of Birth field is rejected.
- **Steps:**
  1. Open the date picker and select a future date.
  2. Click submit and verify that the form does not submit and no modal appears.

### Test Case 3: Reject Spaces in Name Fields
- **Description:** Ensures that the name fields do not accept only spaces as input.
- **Steps:**
  1. Enter only spaces in the first name and last name fields.
  2. Click submit and verify that the fields are not accepted.

### Test Case 4: Successful Form Submission
- **Description:** Tests form submission when all required fields are filled with valid data.
- **Steps:**
  1. Fill out all required fields with valid data.
  2. Submit the form and verify that the success modal appears with a confirmation message.

### Test Case 35: Image File Upload
- **Description:** Verifies that only image files can be uploaded.
- **Steps:**
  1. Select a valid image file (e.g., `.jpg`) from the fixture folder.
  2. Verify that the file is uploaded successfully, and the correct file name is displayed in the file input.
  3. Submit the form and verify that the success modal appears.

### Test Case 36: Reject Non-Image File Upload
- **Description:** Ensures that non-image files cannot be uploaded.
- **Steps:**
  1. Select a non-image file (e.g., `.txt`) from the fixture folder.
  2. Verify that the non-image file is not accepted.
  3. Submit the form and verify that the correct validation behavior occurs.

### Test Case 53: Close Modal by Clicking Outside
- **Description:** Verifies that clicking outside the modal closes it after a successful form submission.
- **Steps:**
  1. Fill out the form and submit it successfully.
  2. Click outside the modal window to close it.
  3. Verify that the modal closes and is no longer visible.

## Installation

### Prerequisites

Before running the tests, ensure that you have the following installed:

- [Node.js](https://nodejs.org/) (version 12 or later)
- [Cypress](https://www.cypress.io/)

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Open Cypress test runner:
   ```bash
   npx cypress open
   ```

4. This will launch Cypress in interactive mode, where you can select the test files to run.

### Running Tests

To run the tests in **headless mode** (without the Cypress UI), use the following command:
```bash
npx cypress run
```

## Conclusion

This test suite ensures the correct behavior of the DemoQA Automation Practice Form by testing various form fields and their validation rules. It also handles file uploads, modal behaviors, and state/city selection logic. The tests offer a comprehensive validation approach for the form's functionality.
