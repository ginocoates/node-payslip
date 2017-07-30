# node-payslip

A small utility to generate payslip information.
Input the employees details: first name, last name, annual salary (positive integer)
and super rate(0% - 50% inclusive), payment start date, and the program will generate
payslip information with name, pay period, gross income, income tax, net income and super.

## Instructions
* [Install yarn](https://yarnpkg.com/lang/en/docs/install/)
* Install dependencies - in the source directory run `yarn`
* Demo - in the source directory run `yarn demo`
* Run Tests/Coverage - in the source directory run `yarn test`
* Build - in the source directory run `yarn build`

### Executing the apply
The app id designed to take three parameters.
Run the app without parameters to get the usage information.

Usage:
node index.js inputFile outputFile [taxYear]

inputFile   - The input csv file
outputFile  - The output payroll file
taxYear     - The tax rules to use (optional - defaults to 2012-13)

The app can also be run from yarn. In the source directory run
`yarn start -- inputfile outputfile taxrules`

## Additional info
The app is designed to have a configurable set of tax rules. Take a look at taxes/index.js where the 2012-13
rules are configured.

## Assumptions
* The application should continue if there are invalid rows, but these should be reported
* Input and Output are CSV
