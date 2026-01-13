@login
Feature: Login and Logout
  As a user
  I want to log in and log out
  So that I can access my finances securely

  Background:
    Given I am on the login page

  Rule: System warns when fields are empty or incorrect (US01)
    
    Scenario Outline: Unsuccessful login with incorrect password
      When I login with "<username>" and "<password>"
      Then I see a message "Error Invalid credentials or access not granted due to user account status or an existing user session."
      And I am on the "login" page

      Examples:
        | username | password | 
        | jsmith3  | wrongpassword |
        | wrongusername  | Demo123! |
        | jsmith3  |           |
        |           | Demo123! |
        |           |           |

  Rule: System redirects and greets after entering correct credentials (US01)

    Scenario: Successful login with valid credentials
      When I login with "jsmith3" and "Demo123!"
      Then I am on the "home" page
      And I see the welcome message
      And I see the left side menu

  Rule: System logs out securely when logging out (US06)

    Scenario: Logout from menu
      Given I am logged in
      When I log out
      Then I am redirected to the "login" page
      And I see a message "Success Logout completed."
