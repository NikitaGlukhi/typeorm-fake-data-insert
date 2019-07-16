#How it works
First of all run `npm install` and `npm run start`. Then go to `localhost:3000` and reload page. All data will be 
generated

## 1. List of companies
You can generate the number of companies names as you need.
Go to `./fixtures/company.yml` and set the number of range as you need
```
etity: EntityName
processor: processorName
items:
  company{1..n}: <-----
    ...
```
**Note**:
Company name generates by random.
For each company one criteria with 'custom' state will be generated and will save into database and 
`./fixtures/criteria.yml`

## 2. List of criteria
All criteria with 'default' and 'additional' states you can load from csv-file that you can find and update into 
`./src/mockup-data/criteria.csv`. All loaded data will be saved into database and `./fixtures/criteria.yml`

## 3. Select criteria for the company
All criteria with 'default' will be selected for each company.
The criteria with 'additional' state will be selected by random.

New data will be saved into database
