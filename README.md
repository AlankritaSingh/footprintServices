# Footprint Calculator

Transport Footprint Calculation

This is a http based application that calculates the amount of Co2e emissions of a product, depending on how it was shipped. In order to calculate the Co2e emissions, the application uses certain approximations and assumptions which are mentioned below, along with the possible improvements and execution steps.

# Execution steps
### Pre-requisites
- Requires node v22.11.0 or higher.
- Requires typescript version 5.8.3 or higher.
- Requires express version 5.1.0 or higher.

### Build and execute tests
* To build the application: npm run build
* To run tests: npm test

### Execute the application
* Running the application: npm start/ npm run start
* Once application is running, use any API development tool to call the POST endpoint http://localhost:3000/calculate
* Provide the proper payload in the request body. Example payload:
    * {
        "footprint": "FLOUR_4717",
	    "transport": "AIR",
        "targetCountry": "DE"
      }
    

