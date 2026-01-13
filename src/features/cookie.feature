@cookie
Feature: Cookie Banner Management
  As a user
  I want to be notified about cookie usage
  So that my privacy is protected

  Rule: Cookie banner appears in new browser session (US02)

    Scenario: Accept cookie banner
      When I open the "home" page
      Then I see the cookie banner
      And I accept the cookies
      Then the cookie banner disappears

