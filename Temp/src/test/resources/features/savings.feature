@savings
Feature: Savings Management
  As a user
  I want to manage my savings accounts
  So that I can grow my wealth

  Background:
    Given I am logged in

  Rule: New savings account creation form functionality (US04)

    Scenario: Reset form to default state
      Given I am on the "New Saving" page
      And I fill out the form with data
      When I reset the form
      Then all fields are cleared

  Scenario: Successful account opening with valid data
    Given I am on the "New Saving" page
    When I create a new saving account with account type "Saving", ownership "Individual", account name "My Savings" and initial deposit "100"
    Then I see the "success" message
    And I am on the "View Saving" page

  Rule: Display created account data and transactions (US05)

    Scenario: Verify new account data in the list
      Given I have successfully created a new savings account
      And I am on the "View Saving" page
      Then I see the following data on a green card:
        | Account | Ownership  | AccountNumber | InterestRate | Balance |
        | Saving  | Individual | *             | 1.85%        | $25.00  |

    Scenario: Initial deposit appears in transactions
      Given I have successfully created a new savings account
      And I am on the "View Saving" page
      Then I see the initial deposit in the transactions with the correct amount
