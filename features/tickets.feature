Feature: Ticket booking
    Scenario: Successful booking of a single ticket
        Given user open the cinema website
        When user select the first available seances
        And user book a single ticket
        Then user should see a confirmation with the text "Вы выбрали билеты:"

    Scenario: Booking multiple tickets
        Given user open the cinema website
        When user select the first available seances
        And user book three tickets
        Then user should see a confirmation with the text "Вы выбрали билеты:"

    Scenario: No available sessions and switching days
        Given user open the cinema website
        When no seances are available for today
        And user navigate to the next day
        Then user should see available sessions