👷 WIP 👷

# CLI Summary for YNAB

Get an overview of your YNAB budget information straight from your terminal.

<img width="375" alt="image" src="https://user-images.githubusercontent.com/18588917/148914272-3277b193-43aa-4387-bc86-e1a5b88d56ff.png">

## Usage
```
npx cli-summary-for-ynab budget -t <your-ynab-personal-access-token>
```

Or

```
export YNAB_TOKEN=<your-ynab-personal-access-token>
yarn global add cli-summary-for-ynab

ynabsummary budget
```

## CLI Reference

### budget
```
Usage: ynabr budget [options]

review your budget at a glance.

Options:
  -t, --token <ynab-token>     token used to authenticate w/YNAB if a YNAB_TOKEN env variable is not set. (default: "")
  -b, --budget-id <budget-id>  the budget id. (default: "last-used")
  -m, --month <month>          get results for a specific months (YYYY-MM-DD) (default: "current")
  -h, --help                   display help for command
```

### report
TODO
