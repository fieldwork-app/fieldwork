# Apply ruleset

_Created 2026-11-08 · Updated 2026-11-28_

**Rules over records.** Each rule says *if* some conditions hold *then* a record gets a category, such as a band, or a
new value computed from its columns. The rules are written in the step's dialog, or read from a published ruleset.

## What it does

It checks every rule against every record and gives each record what the rules concluded, as new columns. A record no
rule matched keeps no conclusion, and the run says how many.

## What you connect

**Records**: a table, points or polygons. Choose which under *Records arrive as*, in **Configure…**, then the step that
feeds it under *Inputs*. A table imported **wide**, one row per subject and a column per variable,
is read that way: one record per subject, its columns as the file named them. It gives back the same records with the
new columns.

## How to use it

**Configure…** opens the step's dialog. On a new step, choose a published ruleset, or *Write rules for this step*, and
**Apply**: rules of your own open in the rules dialog. There, **Records and columns** comes first: how the records
arrive, each column's kind and its unit. Then the settings, the rules, and the otherwise. Nothing changes until
**Apply**.

**A published ruleset reads named columns.** Under **Which column holds each**, each input the ruleset declares has a
menu of your records' columns; left as it is, the ruleset's own column name is read. *7-1-7 timeliness* reads four
dates, emergence, detection, notification and early response complete: on a line list such as MERS-CoV, South Korea,
2015, choose `dt_onset`, `dt_diag` and `dt_report` for the first three. A chosen column the records do not carry stops
the run, naming the columns they do. The run's record states which column was read for each input.

**Each part of a rule is a block**, with its word and its colour, so a rule's shape reads at a glance:

| Block | What it decides |
| --- | --- |
| **if** (blue) | A column, a comparison (see *Comparisons* below) and a value: a typed number or one of the step's settings |
| **+ and** | Conditions in one *if* block, which must all hold |
| **or** (purple) | An alternative *if* block, any of which will do |
| **then** (green), a category | A new column and the value a matching record gets: *band* is *Short* |
| **then**, a computed value | A new column and a sum: *houses without a death* is *houses* minus *deaths*. Plus, minus, times or divided by; each side a column, a value another rule computed, or a typed number |
| **otherwise** (amber) | A column's value for a record no rule gave one: *class* is *Cannot be classified* |

**Make bands…** writes the rules for bands of a number: choose the number column, the value the first band starts at,
and the cut points, rising. *0* and *1, 5, 10, 15* write five rules, *0*, *1 to 4*, *5 to 9*, *10 to 14* and *15 and
over*, each at least its lower bound and less than its upper: no gap and no overlap. Whole numbers are labelled as age
bands are written; decimals *1.5 to under 3*. The rules are then ordinary rules, to read and change; a value below the
start gets no band.

Each block also has its own edge, solid, dotted, double or dashed, so the blocks are told apart without colour.
**The comparison in a condition is keyed by its family** the same way: comparisons of numbers (*is more than*, *is at
most*, *is less than*, *is at least*) teal; *is* and *is not* slate; *is recorded* and *is not recorded* rose, with a
dotted edge.

**A rule can read a category another rule gave.** Once a rule concludes *lab* is *positive*, *lab* is offered as a
column a condition can read, by that name. A category reads in the table as it was typed: *Cannot be classified*.

**Is not** matches a recorded value that differs: *rash is not No* matches *Yes* and *Unknown*. A value not recorded
never matches *is not*; ask *is not recorded* for that.

**Otherwise**, one per column, gives the column a value where no rule did. It waits for the columns its rules read: a
*class* read from *lab result* takes its otherwise only after *lab result* has had its own. So an ordered
classification, such as WHO's for measles, is written as columns in stages, each a few rules and an otherwise. The
rulesets worked example builds one, *Which suspected cases meet the case definition?* An
otherwise never settles two rules that disagree: that record stays without a value, and is named.

**+ Add a value computed for every record** writes a rule with no condition: every record gets the value.

**A new column states its unit**, and what it measures, in the two boxes after the sum: *deaths per 10,000 houses*.
The table the step gives out carries both. A new column without a unit is said in the dialog and the run.

**Settings.** *+ Add a setting* gives the step a number the rules compare against, such as a fever threshold of 38
degrees Celsius: a name, a value and a unit. A condition then reads *temperature_c is more than fever*, and the
threshold can be changed without rewriting a rule.

**Kinds.** Each column is read as a number, a date, a category, or true or false, offered from its values and changed
under *Records and columns*. **A date** is written year-month-day; one date minus another gives **days**, said as the new
column's unit: a serial interval, or the days from onset to report. A date is not added to, multiplied, or compared with
a number, and a day that does not exist, such as 1861-02-30, is reported unreadable rather than moved into March. A file that stores counts as text, "34", offers them as a category: say they are a number, and
the text is reported unreadable at the run, where **Data quality** can read it as numbers.

**A date and time.** A column can be read as a date and time, written `1940-04-19T00:30`. Where a line list writes the
date and the time apart, and not in that form, a rule puts them together: choose **a date and time** as the
conclusion, then the date column and how it writes dates (*month/day*, *day/month*, either with the year, or
*year-month-day*), the year where the column has none, and the time column on its clock (*12-hour*, as `8:00 PM`, or
*24-hour*, as `20:00`). Where every record shares one date the source gives, such as the evening of a church supper,
choose *one date for every record* and type it. A value that does not fit what was declared is never guessed: the
record gets no date and time, and the step says which record and what it saw, such as `"12:00 AM*" is not a 12-hour
time`. Times have no time zone: they are the record's local times, as written. One date and time minus another names
its unit, **days, hours or minutes**: Oswego's hours from the meal to onset, a median of 4. A date is not taken from a
date and time, which would read the date as midnight.

**Units.** Each column the rules read states its unit, under *Records and columns*. A setting compared with a
column must be in the column's unit, and a sum or difference must be of two columns in the same unit; either is refused
while the rule is written. Columns the rules do not read need no unit.

**One rule can read what another computed.** *deaths per house* is deaths divided by houses; *deaths per 10,000
houses* is deaths per house times 10,000. The order the rules are listed in does not matter.

**A rule can read the previous row.** *new cases* is *cumulative_cases* minus *cumulative_cases in the previous
row*. Such a rule needs the records sorted, which is set above the rules:

| Setting | What it decides |
| --- | --- |
| **Sort by** | The column the rows are put in order by. Date columns are offered first. The file's own order is never used |
| **Within each** | The columns that say whose rows these are, such as the place: each place's rows are sorted, and a row's previous one is its own place's |
| **The previous row is** | *The row recorded before*, or *the day*, *the week* or *the month before*. Where that period has no row, the value is empty, and counted |

The table comes out in this order. The preview is then **Before**, **Sorted** and **After**.

**Before and after.** The dialog's Preview shows the records as they arrive and as these rules would leave
them, on every edit: each new column, and which rule each record matched. Each rule's heading says how many records it
matched. The first 50 records are drawn; the counts are of all of them.

## Comparisons

| In the editor | Means | Example | Matches |
| --- | --- | --- | --- |
| **is (=)** | equal to | *rash* is *Yes* | records whose rash is Yes |
| **is not (≠)** | a recorded value other than this | *rash* is not *No* | Yes and Unknown; not a rash left blank |
| **is more than (>)** | greater than | *temperature_c* is more than *38* | 38.1 and over; not 38 |
| **is at least (≥)** | greater than or equal to | *days_to_detect* is at least *8* | 8 and over |
| **is less than (<)** | less than | *age* is less than *5* | 4.9 and under; not 5 |
| **is at most (≤)** | less than or equal to | *days_to_detect* is at most *7* | 7 and under: 7-1-7's target met |
| **contains any of** | the text holds one of the words, ignoring capitals | *chief_complaint* contains any of *vomit, n/v, diarrh* | "N/V/D", "Vomitting x2" |
| **contains none of** | the text holds none of the words | *chief_complaint* contains none of *pregnan* | every complaint not naming pregnancy |
| **has an item starting with any of** | some code or word in the text, between `;`, `/`, `&` or spaces, begins with one of the words | *discharge_diagnosis* has an item starting with any of *J10, J11* | "R50.9;J10.1"; not "XJ10" |
| **has no item starting with any of** | no code or word in the text begins with one of the words | *discharge_diagnosis* has no item starting with any of *J10, J11* | "A08.1"; not "A08.1;J11.1" |
| **is recorded** | the column has a readable value | *dt_diag* is recorded | records with a diagnosis date |
| **is not recorded** | the column is blank or unreadable | *dt_diag* is not recorded | records with no diagnosis date |

The four comparisons of size, >, ≥, < and ≤, are offered for numbers, and for the days between two dates; *is* and
*is not* for categories and for true or false too; *contains any of*, *contains none of* and the two *item* comparisons
for text, the words separated by commas. A word matches inside a longer one: *diarrh* finds *diarrhea* and *diarrhoea*.
Put a word in double quotes to keep its spaces: *" flu "* finds *stomach flu today* and not *influenza*. The start and end of the text are not spaces, so *" flu "* does not find *stomach flu* alone. A starting word for the two *item* comparisons holds no spaces, `;`, `/` or `&`, since those separate the items. A record whose column is not recorded matches none of the first
six: it is neither more nor less than 7. Ask *is not recorded* for it.

## The rules as JSON

**JSON** beside **Rules** shows the same ruleset as text: its title, the columns it reads with their kinds, its
settings, its rules and each column's default. Type in it, or **Upload (JSON)** a file; **Download (JSON)** keeps one.

- **Checked as you type.** After a pause, the text is read and checked: where the JSON breaks (*line 20: a comma is
  missing after the value of "comparator"*), then whether the rules can run (a field not declared, a comparison that
  does not exist, words left out). Each problem is listed with its line and marked beside it; choosing one goes there.
- **The two views are one ruleset.** Valid JSON is the rules, at once. While it has a problem, the rules stay as they
  were last valid, Apply waits, and the Rules view says so.
- **Brackets close themselves.** Typing `{`, `[` or `"` adds its partner; typing the partner steps over it; Backspace
  between a pair removes both; Enter between them opens an indented line; selected text is wrapped.
- **Colours.** Names are bold and blue, text green, numbers brown, *true*, *false* and *null* purple; a line with a
  problem is tinted. Every colour is readable in both themes. **Colours** turns them off.
- **Start from a template…** loads a small ruleset that runs as it is, on this step's own columns where it has the kind
  each needs: categories from words, bands from a number, days between two dates against a target, or one column
  divided by another.
- **Arriving columns**, beside the text: each column the connected step sends, with its kind and a few of its values,
  marked *declared* where `fields` names it. **Add to fields** writes its entry, spelled as the column is. A declared
  column that does not arrive is listed under *Declared but not arriving*, and the check names it, with the nearest
  arriving column.

A file is a ruleset a person wrote: what it must not be read as goes with it.

## Writing rules as JSON

A ruleset is one object with these parts. **Bold** ones are required.

| Part | What it holds |
| --- | --- |
| **title** | What the rules decide, in words |
| **mustNotBeReadAs** | What the result must not be taken to mean, such as *a diagnosis* |
| **fields** | The columns the rules read: `attribute` as the file spells it, `predicate` the name the rules use (`fwa:` and the column), and `kind`: `number`, `boolean`, `term` (text or a category), `date` or `datetime`. A number also gives its `unit` |
| parameters | Settings: numbers a person can change without rewriting a rule, each with a `name`, its `meaning` and unit |
| **rules** | The rules, below |
| otherwise | A column's value where no rule gave it one |
| order | The order records are read in, where a rule reads the previous row |

A downloaded file starts with `"$schema"`, the address of the [schema](../../schemas/authored-ruleset.schema.json): an
editor such as VS Code reads it and offers the parts, kinds and comparisons as you type.

### A rule

A rule says **when** and **then**. `any` lists alternatives, and the rule holds when any one of them does; each
alternative's `all` lists conditions that must all hold. `then` says what the rule gives.

```json
{
  "title": "Syndrome from the chief complaint",
  "mustNotBeReadAs": "a diagnosis",
  "fields": [{"attribute": "chief_complaint", "predicate": "fwa:chief_complaint", "kind": "term"}],
  "rules": [
    {"any": [{"all": [{"field": "fwa:chief_complaint", "comparator": "contains", "value": "vomit, diarrh, n/v"}]}],
     "then": [{"predicate": "fwa:syndrome", "value": "gastrointestinal"}]}
  ],
  "otherwise": [{"predicate": "fwa:syndrome", "value": "other"}]
}
```

Visits whose complaint holds *vomit*, *diarrh* or *n/v* are gastrointestinal; every other visit is other.

### Every comparison

| `comparator` | Means | For |
| --- | --- | --- |
| `equals` | is | every kind |
| `notEquals` | is not: a recorded value other than this one | every kind |
| `greaterThan`, `notGreaterThan` | is more than; is at most | numbers |
| `lessThan`, `notLessThan` | is less than; is at least | numbers |
| `contains` | holds any of the words, separated by commas, ignoring capitals | text |
| `notContains` | holds none of the words | text |
| `startsWith` | has an item starting with any of the words: each part of the text between `;`, `/`, `&` or spaces is an item, such as each code in a list of diagnoses | text |
| `notStartsWith` | has no item starting with any of the words | text |

A word in double quotes keeps its spaces. `" flu "` finds *stomach flu today* and not *influenza*, which holds *flu* with no
space either side. The start and end of the text are not spaces: `" flu "` does not find *stomach flu* alone. A starting word
for `startsWith` and `notStartsWith` holds no spaces, `;`, `/` or `&`: those separate the items, so it could start none.

### Codes in a list

A column of discharge diagnoses holds several codes, such as `J10.1;R50.9`. `startsWith` reads each code on its own, so
`J10, J11` finds a visit with any influenza code and not one with a code that only contains those letters.

```json
{
  "title": "Influenza by diagnosis",
  "mustNotBeReadAs": "a diagnosis made here: the codes are the ones the visit was given",
  "fields": [{"attribute": "chief_complaint", "predicate": "fwa:chief_complaint", "kind": "term"},
             {"attribute": "discharge_diagnosis", "predicate": "fwa:discharge_diagnosis", "kind": "term"}],
  "rules": [
    {"any": [{"all": [{"field": "fwa:discharge_diagnosis", "comparator": "startsWith", "value": "J10, J11"}]},
             {"all": [{"field": "fwa:chief_complaint", "comparator": "contains", "value": "influenza, \" flu \""}]}],
     "then": [{"predicate": "fwa:influenza", "value": "yes"}]}
  ]
}
```

### Two conditions, and an alternative

Conditions in one `all` must all hold; another object in `any` is an alternative. A fever with a cough, or the word
*influenza*:

```json
{
  "title": "Influenza-like illness",
  "mustNotBeReadAs": "a diagnosis",
  "fields": [{"attribute": "chief_complaint", "predicate": "fwa:chief_complaint", "kind": "term"}],
  "rules": [
    {"any": [
       {"all": [{"field": "fwa:chief_complaint", "comparator": "contains", "value": "fever, fevr"},
                {"field": "fwa:chief_complaint", "comparator": "contains", "value": "cough"}]},
       {"all": [{"field": "fwa:chief_complaint", "comparator": "contains", "value": "influenza"}]}],
     "then": [{"predicate": "fwa:ili", "value": "yes"}]}
  ],
  "otherwise": [{"predicate": "fwa:ili", "value": "no"}]
}
```

### A setting in place of a number

Write `{"setting": "name"}` where a number would go, and declare the setting: the number is then set on the step, and
changed without touching the rule.

```json
{
  "title": "A fever",
  "mustNotBeReadAs": "a diagnosis",
  "fields": [{"attribute": "temperature_c", "predicate": "fwa:temperature_c", "kind": "number",
              "unit": "http://qudt.org/vocab/unit/DEG_C", "unitLabel": "degrees Celsius"}],
  "parameters": [{"name": "fever_from", "meaning": "The lowest temperature counted as a fever",
                  "unit": "http://qudt.org/vocab/unit/DEG_C", "unitLabel": "degrees Celsius"}],
  "rules": [
    {"any": [{"all": [{"field": "fwa:temperature_c", "comparator": "notLessThan", "value": {"setting": "fever_from"}}]}],
     "then": [{"predicate": "fwa:fever", "value": "yes"}]}
  ]
}
```

### When two rules disagree

A record two rules give different values to gets none, and the step names it. Keep rules apart with a condition that
rules the other out: a fever that is not gastrointestinal.

```json
{
  "title": "Syndromes, kept apart",
  "mustNotBeReadAs": "a diagnosis",
  "fields": [{"attribute": "chief_complaint", "predicate": "fwa:chief_complaint", "kind": "term"}],
  "rules": [
    {"any": [{"all": [{"field": "fwa:chief_complaint", "comparator": "contains", "value": "vomit, diarrh"}]}],
     "then": [{"predicate": "fwa:syndrome", "value": "gastrointestinal"}]},
    {"any": [{"all": [{"field": "fwa:chief_complaint", "comparator": "contains", "value": "fever"},
                      {"field": "fwa:chief_complaint", "comparator": "notContains", "value": "vomit, diarrh"}]}],
     "then": [{"predicate": "fwa:syndrome", "value": "influenza-like"}]}
  ]
}
```

### Rules in stages

A later rule can read a column an earlier one gave, by its name: here a band first, then whether the band is a child.

```json
{
  "title": "Children",
  "mustNotBeReadAs": "a finding: the cut points are a choice",
  "fields": [{"attribute": "age", "predicate": "fwa:age", "kind": "number",
              "unit": "http://qudt.org/vocab/unit/YR", "unitLabel": "years"}],
  "rules": [
    {"any": [{"all": [{"field": "fwa:age", "comparator": "lessThan", "value": 18}]}],
     "then": [{"predicate": "fwa:band", "value": "under 18"}]},
    {"any": [{"all": [{"field": "fwa:band", "comparator": "equals", "value": "under 18"}]}],
     "then": [{"predicate": "fwa:child", "value": "yes"}]}
  ]
}
```

### What the editor says, and what to do

| It says | Do |
| --- | --- |
| *A comma is missing after the value of "title"* | Put a comma at the end of that line |
| *A comma is left before "]"* | Remove the comma after the last item |
| *JSON writes names and strings in double quotes* | Change `'` to `"` |
| *fwa:age is not a declared field* | Add the column to `fields`, or correct the name |
| *"Age" is not a column of … Did you mean "age"?* | Spell `attribute` as the column arrives, or choose **Add to fields** |
| *"comparator" is one of …* | Use one of the comparisons above |
| *write the words to look for* | Give `contains` its words, separated by commas |
| *… is a number, so it holds no words* | Look for words in a text column (`kind` `term`) |


## Combining conditions

**+ and** puts conditions in one *if* block, all of which must hold; **or** adds another *if* block, any of which will
do. Every rule is one or more *if* blocks joined by *or*, each holding conditions joined by *and*. Any combination of
*and*, *or* and *not* can be written that way:

| You want | Write it as | In the editor |
| --- | --- | --- |
| A and B | one *if* block | *if* A **+ and** B |
| A or B | two *if* blocks | *if* A **or** *if* B |
| (A and B) or (C and D) | two *if* blocks of two conditions | *if* A **+ and** B **or** *if* C **+ and** D |
| A and (B or C) | the A repeated in each block | *if* A **+ and** B **or** *if* A **+ and** C |
| a range, 5 ≤ x ≤ 10 | two conditions in one block | *if* x is at least 5 **+ and** x is at most 10 |
| outside a range, x < 5 or x > 10 | two blocks | *if* x is less than 5 **or** *if* x is more than 10 |
| not (A and B) | each condition turned round, joined by *or* | *if* not-A **or** *if* not-B |
| not (A or B) | each condition turned round, joined by *and* | *if* not-A **+ and** not-B |
| x is not more than 7 | the comparison turned round | *if* x is at most 7 |

A condition is turned round by its opposite comparison: *is* and *is not*, *is more than* and *is at most*, *is less
than* and *is at least*, *is recorded* and *is not recorded*. There is no *not* around a whole block: it is written as in
the last three rows. When nothing else applies, **otherwise** gives the value.

## What it says instead of guessing

- **A division by zero** gives an empty value, and is counted and named: *1 record has an empty value, from a division
  by zero: Harbour.*
- **A value to compute from that is missing** gives no value, and is named.
- **Two rules giving one record different values** give it none, and both rules are named.
- **The first row of a place has no previous one.** Its value is empty, counted and named.
- **Two rows for one period** have no single previous row: both, and every later row of their place, get no value
  rather than a guessed one, and are named.
- **A value that fell** below the previous row's, such as a cumulative count corrected down, is kept as computed and
  named.
- **A number without a unit** stops the rules from running until its unit is stated, and a rule comparing two
  different units is refused while it is being written.
- **A record that took an otherwise** is counted by column, so a default is never read as a rule's conclusion: *2
  records took class's otherwise, because no rule gave class a value.*

On a wide table, a computed value is a new variable of each subject: in the table it is one more row per subject,
named for the new column, as **Derive a value** adds it.

**A published ruleset** opens in its own dialog: the ruleset, its settings, and as the preview what it decides, its
basis and what it obliges. *Read them in the rule editor* shows its rules there, every control disabled. A newer
version is under **Decisions**: the step stays on the version it was built on until you choose.

## What it will not do

- Order the rules. Every rule is checked against every record; an otherwise is a default, not a last rule.
- Settle two rules that disagree. The record gets no value, and both rules are named.
- Guess a unit, a kind or a column from its name.
- Change a published ruleset in place. A copy can be edited on the step.


## What this does not establish

That a rule is right for its question. Rules do exactly what they say, including what was meant and not written.

## History

### 2026-11-28 · A published ruleset's Preview shows what it concludes (0.19.0)

For a published ruleset that computes its values, such as 7-1-7, **Configure…**'s Preview now shows the records
connected and the columns the ruleset concludes for each, read from the columns chosen for its inputs, as the rule
editor's After shows them. It had listed the rules only. A ruleset that goes to the reasoner is run only when the
workflow runs, and the Preview says its conclusions are in the Result.
