# Footprint Calculator

This is a http based application that calculates the amount of Co2 emissions of a product, depending on how it was shipped. In order to calculate the Co2 emissions, the application uses certain assumptions which are mentioned below, along with the possible improvements and execution steps.

## Execution steps
### Pre-requisites
- Requires node v22.11.0 or higher.
- Requires typescript version 5.8.3.
- Requires express version 5.1.0.

### Build and execute tests
* To build the application: `npm run build`
* To run tests: `npm test`

### Execute the application
* Running the application: `npm start` or `npm run start`
* Once application is running, use any API development tool to call the POST endpoint `http://localhost:3000/calculate`
* Provide the proper payload in the request body to get the result. Example payload:
    ```
    {
       "footprint": "FLOUR_4717",
       "transport": "AIR",
       "targetCountry": "DE"
    }
    ```
  <img width="1102" alt="Screenshot 2025-05-17 at 10 15 04" src="https://github.com/user-attachments/assets/33178408-8513-4403-964a-39a4b52e063a" />

## Thought process
The application uses the following steps to calculate the Co2 emissions:
* "footprint", "transport" and "targetCountry" are mandatory inputs. If payload doesn't match the expected schema, the payload validation fails and displays the appropriate message to the user.
* If no data is found for the provided "footprint" input, the request fails with Bad request error and displays appropriate message to the user.
* If no data is found for the provided "transport" or "targetCountry" input, the request fails with Bad request error and displays appropriate message to the user.
* The solution currently offers only Open Route Service API to get the data from external services. As the solution abstracts the external service behind an interface, it is possible to easily integrate with other service providers.
    
## Possible improvements
* Introduce unit tests for all classes including External services. 
* Introduce a retry and back-off mechansim if there is an internal error while trying to fetch the data from the Open Route Service API (external services).

