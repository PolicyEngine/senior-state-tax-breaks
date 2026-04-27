# Initial Senior Tax Gap Scan

Date: 2026-04-27

## Scope

This pass looked for current state-level senior-targeted tax breaks that appear to be absent from the local `policyengine-us` checkout and that look reasonably modelable with inputs PolicyEngine already has.

I did not find the promised CSV in this repo, so this scan uses the local checkout at `../policyengine-us` as the baseline for "already modeled."

## Method

- Searched `../policyengine-us/policyengine_us/variables` and `../policyengine-us/policyengine_us/parameters` for senior-, retirement-, social-security-, property-tax-, rent-, and medical-related state tax rules.
- Prioritized programs that can likely be built from existing variables such as `age`, `filing_status`, `medical_out_of_pocket_expenses`, `rent`, `pre_subsidy_rent`, `real_estate_taxes`, pension income, and AGI.
- Cross-checked candidate gaps against current official state sources for tax year 2025 or currently active 2026 application pages.

## Recommended First Pass

### 1. Pennsylvania Property Tax/Rent Rebate Program

- Why it looks missing:
  No `property tax rebate`, `rent rebate`, or `PTRR` matches showed up under `policyengine_us/variables/gov/states/pa` or `parameters/gov/states/pa`.
- Why it looks modelable:
  PolicyEngine already has `rent` ([rent.py](/Users/daphnehansell/Documents/GitHub/policyengine-us/policyengine_us/variables/household/expense/housing/rent.py)), `pre_subsidy_rent` ([pre_subsidy_rent.py](/Users/daphnehansell/Documents/GitHub/policyengine-us/policyengine_us/variables/household/expense/housing/pre_subsidy_rent.py)), and `real_estate_taxes` ([real_estate_taxes.py](/Users/daphnehansell/Documents/GitHub/policyengine-us/policyengine_us/variables/household/expense/tax/real_estate_taxes.py)).
- Why it is a strong first target:
  The current official page gives current eligibility, current 2025 rebate brackets, and the supplemental kicker rules directly on the site.
- Main caveat:
  The full program includes widows/widowers age 50+ and disability eligibility. For a senior-focused first pass, you could still implement the 65+ path first, but the full rule also looks feasible.
- Official source:
  [Pennsylvania PTRR program page](https://www.pa.gov/agencies/revenue/ptrr)

### 2. Oregon special medical subtraction

- Why it looks missing:
  Oregon has an existing retirement income credit and federal pension subtraction in `policyengine-us`, but no Oregon medical subtraction variable showed up under the Oregon tax directories.
- Why it looks modelable:
  PolicyEngine already has `medical_out_of_pocket_expenses` ([medical_out_of_pocket_expenses.py](/Users/daphnehansell/Documents/GitHub/policyengine-us/policyengine_us/variables/household/expense/health/medical_out_of_pocket_expenses.py)) and the federal `medical_expense_deduction`. The Oregon rule is also explicitly worksheet-based in the official OR-17 guide.
- Why it is a strong first target:
  This is exactly the kind of worksheet-style state subtraction PolicyEngine handles well: current-year age, current-year AGI, and current-year medical expenses.
- Main caveat:
  You would need to parameterize Table 11 by filing status and federal AGI.
- Official source:
  [2025 Oregon Publication OR-17](https://www.oregon.gov/dor/forms/FormsPubs/publication-or-17_101-431_2025.pdf)

### 3. Utah homeowner/renter circuit breaker relief

- Why it looks missing:
  No Utah `circuit breaker`, `renter refund`, `rent rebate`, or similar property-tax relief matches showed up under the Utah state tax directories.
- Why it looks modelable:
  The program mostly relies on age or surviving-spouse status, household income, rent, and property taxes, which are all concepts PolicyEngine already models or can derive.
- Why it is promising:
  Utah publishes current eligibility thresholds and refund caps clearly on the official tax site.
- Main caveat:
  The renter refund and homeowner relief are administered differently, and the final refund is based on income plus a share of rent/property tax, so it is a little less turnkey than Pennsylvania.
- Official sources:
  [Utah Homeowner's or Renter's Relief](https://tax.utah.gov/relief/homeowner-renter-relief/)
  [Utah Publication 36](https://tax.utah.gov/forms-pubs/pubs/pub-36/)

## Good Second-Tier Candidates

### 4. Colorado Property Tax/Rent/Heat (PTC) Rebate

- Why it looks missing:
  No `PTC rebate`, `property tax/rent/heat`, or similar Colorado program matches showed up under the Colorado tax directories.
- Why it looks partly modelable:
  Age, income, rent, and property taxes are already available.
- Why it is not quite as easy:
  Heat expenses appear to be part of the rule, and I did not find a clean Colorado heat-expense input already sitting in `policyengine-us`. Also, for tax year 2025 the disability path moved into a separate DAC process, so the senior path is cleaner than the full historical program.
- Official source:
  [Colorado PTC Rebate page](https://tax.colorado.gov/PTC-rebate)

### 5. California Senior Head of Household Credit

- Why it looks missing:
  I found California aged/blind exemptions but no California senior head of household credit implementation in the California tax code.
- Why it looks only medium priority:
  The formula itself is simple, but eligibility depends on prior-year head-of-household qualification and the death of the qualifying person in one of the prior two years. That historical household-state information may not be available in current-year microdata.
- Official source:
  [California Senior Head of Household Credit](https://www.ftb.ca.gov/file/personal/credits/senior-hoh-credit.html)

## Not A Great First Build

### North Carolina Bailey retirement deduction

- Why I would not start here:
  It matters for senior comparisons, but it likely needs historical vesting/service information and retirement-plan-type detail that is much harder to support cleanly than the programs above.
- Official source:
  [North Carolina Bailey settlement deduction](https://www.ncdor.gov/taxes-forms/individual-income-tax/bailey-settlement-retirement-benefits)

## Bottom Line

If we want fast, high-signal additions, I would start in this order:

1. Pennsylvania PTRR
2. Oregon special medical subtraction
3. Utah circuit breaker relief

Colorado PTC is still attractive, but I would keep it just behind Utah because of the extra heat-expense wrinkle.
