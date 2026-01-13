@dashboard
Feature: Financial Dashboard
  As a user
  I want to see my financial charts on the dashboard
  So that I can understand my financial situation

  Rule: Display charts on the main page (US03)
    
    Scenario: Verify charts on Dashboard page
      Given I am logged in
      And I am on the "Dashboard" page
      Then I see the chart "Account Balance Summary"
      And I see the chart "Deposit vs. Withdraw (Last 3 Months)"

