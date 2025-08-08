# API Tests with Playwright

This directory contains comprehensive test cases for the Users API using Playwright.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Run all tests:
```bash
npm run test:playwright
```

### Run tests with UI mode:
```bash
npm run test:playwright:ui
```

### Run tests in headed mode (visible browser):
```bash
npm run test:playwright:headed
```

## Test Coverage

The `create.spec.js` file covers:

- ✅ Successful user creation with valid data
- ✅ Invalid JSON handling
- ✅ Validation errors for missing fields (name, email, age, address, dob)
- ✅ Multiple validation errors
- ✅ Duplicate email conflict (409)
- ✅ Database connection errors (500)
- ✅ Empty and null request body handling

## Test Structure

Each test follows the AAA pattern:
- **Arrange**: Set up test data and conditions
- **Act**: Execute the function under test
- **Assert**: Verify the expected outcomes

## Database Cleanup

Tests automatically clean up the database before and after each test to ensure isolation.