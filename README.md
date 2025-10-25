# Phase Out Village

_**Chill, baby! Chill!**_

Phase Out Village is a web game that explores scenarios for phasing out Norwegian oil and gas production

In this simulation, you can plan phase out for each field on the Norwegian continental shelf and see the impact on
emissions, production and on the Norwegian economy.

The simulation uses production data from the Norwegian Petroleum and emission data from Offshore Norway.

## Data provenance

Production data has been collected from [Norwegian Petroleum](https://www.norskpetroleum.no/fakta/felt/aasta-hansteen/)

Emission data has been collected
from [Offshore Norway emission reports](https://www.offshorenorge.no/faginnhold/rapporter/klima-og-miljo/feltspesifikke-utslipp/).
In what seems like an effort of data obstruction, this data in only published as individual PDFs for each oil field for
each year from 2012-2024.
The PDFs have painstakingly been scraped by volunteers at the Norwegian Green Party.

Geographic data has been collected from [Norwegian Offshore Directorate](https://factmaps.sodir.no/)

The data is collected into a [publicly available spreadsheet](https://docs.google.com/spreadsheets/d/1mHusVg0hu4YWcPycictRjjP3GAPjN1yC2V0eTaLupgo/edit?gid=0#gid=0)

As future production is secret and emission is tied to production, the following estimates are used for future values:

- Future production is based on the average of the last five years with a projected depletion of 10% per year
- Average emission is set to the average of the last five years
- For future electricity consumption, the future consumption uses the last known value scaled by production volume

## Features

- For each oil field, the user can select a phase out year between 2027 and 2040
- All Norwegian oil fields are displayed on a map with a shading that shows their emission intensity. When the user
  selects a phase out year for any field, the total contribution of each field determines the shading instead
- A graph displays the emission of the current projected production. When the user selects a production end data for an
  oil field, their production graph is displayed alongside the baseline
- Similarly to emissions, a graph of production for the baseline scenario and the user's planned scenario is displayed
- Similarly to emissions and production, a graph of revenue for the baseline scenario and the user's planned scenario is
  displayed. The revenue is divided into fund contributions and direct budget contributions
- When the user selects an oil field, the graphs are limited to that oil field

## Technology

This game is a pure frontend application developed with React. OpenLayers are used for the maps and Chart.js for the
charts. The game is optimized for mobile display format.

The development language is English. The UI language is Norwegian.

## How to contribute

1. Fork the repository
2. In your GitHub repo go to Settings > Secrets and variables > Actions > Variables and add a "New repository variable"
3. Set the variable name to `REPO_BASE` and the value to `/phase-out-village/` (unless you named your fork something else)
4. Under Settings > Pages, Change "Source" under Build and deployment to **GitHub Actions**
5. Click the link with the text "View workflow runs"
6. Under Actions, press "I understand my worflows, go ahead and enable them"
7. Under Actions, select the Deploy workflow on the left and click Run workflow to deploy the site
8. On the front page, click ⚙️ in the About section to the right and check "Use your GitHub Pages website" as website
9. You can now click the link to view your deployed site
