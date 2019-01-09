## Here is some info about test files

<!-- Bu h3'leri linke cevirelim -->

### [sade.csv:](sade.csv)
- Contains hourly measurements of average response times of a webpage through **6 weeks**.
- ~ 1k rows.
- Has **1** field other than time stamps.
- Downloaded from [this article](https://dzone.com/articles/taking-your-web-performances).


### [test.csv:](test.csv)
- Was made out of *sade.csv*.
- 27 rows including the headers.
- Has **2** fields other than time.
- Some rows are missing a field. Used to test how the app handles missing fields.


### [venezia.csv:](venezia.csv)
- Contains hourly measurements of the water level in Venice from 1983 to 2015.
- ~ 300k rows.
- Has **1** field other than time stamps.
- Downloaded from [kaggle](https://www.kaggle.com/lbronchal/venezia).
- Used to test how the app handles big files(that are still small enough to fit into its memory).


### [vene_test.csv:](vene_test.csv)
- Was made out of *venezia.csv*.
- 25 rows including the headers.
- Has **1** field other than time stamps.
- Used to see how the app draws graphs with negative values.
