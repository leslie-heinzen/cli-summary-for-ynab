👷 WIP 👷

# CLI Summary for YNAB

Get an overview of your YNAB budget information straight from the command line.

<img width="375" alt="image" src="https://user-images.githubusercontent.com/18588917/148914272-3277b193-43aa-4387-bc86-e1a5b88d56ff.png">

## Usage
```sh
> npx cli-summary-for-ynab budget -t <your-ynab-personal-access-token>
```

Or

```sh
> export YNAB_TOKEN=<your-ynab-personal-access-token>
> yarn global add cli-summary-for-ynab

> ynabsummary budget
```

## CLI Reference

### budget
```
Usage: ynabsummary budget [options]

review your budget at a glance.

Options:
  -t, --token <ynab-token>     token used to authenticate w/YNAB if a YNAB_TOKEN env variable is not set. (default: "")
  -b, --budget-id <budget-id>  the budget id. (default: "last-used")
  -m, --month <month>          get results for a specific month (YYYY-MM-DD) (default: "current")
```

### transactions
```
Usage: ynabsummary transactions [options]

review your transactions.

Options:
  -t, --token <ynab-token>      token used to authenticate w/YNAB if a YNAB_TOKEN env variable is not set. (default: "")
  -b, --budget-id <budget-id>   the budget id. (default: "last-used")
  -d, --date <start-date>       the start date for the returned transactions (YYYY-MM-DD).
  -a, --account <account-name>  get results for a single account.
  -c, --category <category>     filter the results by a single category.
```

### accounts
```
Usage: ynabsummary accounts [options]

review your budget accounts.

Options:
  -t, --token <ynab-token>     token used to authenticate w/YNAB if a YNAB_TOKEN env variable is not set. (default: "")
  -b, --budget-id <budget-id>  the budget id. (default: "last-used")
  -c, --closed                 include closed accounts.
  -o, --off-budget             include off-budget accounts.
```

### report
TODO
