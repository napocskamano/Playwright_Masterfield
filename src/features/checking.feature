@checking
Feature: Checking Account Management
  As a user
  I want to manage my checking accounts
  So that I can handle my daily transactions

  Background:
    Given I am logged in

  Rule: New checking account creation form functionality

    Scenario: Reset form to default state
      Given I am on the "New Checking" page
      And I fill out the checking form with data
      When I reset the checking form
      Then all checking fields are cleared

    Scenario: Successful checking account opening with valid data
      Given I am on the "New Checking" page
      When I create a new checking account with account type "Checking", ownership "Individual", account name "My Checking" and initial deposit "100"
      Then I see the "success" message
      And I am on the "View Checking" page

  Rule: Display created checking account data and transactions

    Scenario: Verify new checking account data in the list
      Given I have successfully created a new checking account
      And I am on the "View Checking" page
      Then I see the following checking data on a green card:
        | Account  | Ownership  | AccountNumber | InterestRate | Balance |
        | Checking | Individual | *             | 0.0%         | $100.00 |

    Scenario: Initial deposit appears in checking transactions
      Given I have successfully created a new checking account
      And I am on the "View Checking" page
      Then I see the initial checking deposit in the transactions with the correct amount

