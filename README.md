Payroll App
-----------

Personal income tax rate is now found here:

https://www.ato.gov.au/Rates/Individual-income-tax-rates/

I've imported the tax rates including the "Medicare levy" and the "Temporary Budget Repair Levy", so in some cases the calculations may be a little bit different.

I've made some small assumtions, but that is mainly to do with date ranges outside of 1 month. there's a few comments in the code and tests which point this out. On the whole there was not a lot which was vague or not defined.

To run this you need to do the following:

* Visit https://github.com/damienwhaley/myob-payroll (you should already be here)
* Clone the repo to your local machine
* Run npm install
* Run npm start (see below)


```
cd /tmp
git clone https://github.com/damienwhaley/myob-payroll.git
npm cd myob-payroll
npm install
npm start
```

I've also included test suites. you just run npm test to run them (see below)

```
npm test
```

I've also got my code being linted. You run the following (see below)

```
npm run lint
```

I'm happy to talk through this with you. Thanks for taking the time to look over this.

Cheers,

/Damien
