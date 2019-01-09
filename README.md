# Meron

Meron is a visualization tool for time-series data. It re-structures  the data into a periodic form with respect to hours, days and months. The app is still in development. 


### Known Issues

`semantic-ui-react` package causes an issue for linux users. After `npm install` command, linux users run into [this issue](https://github.com/Semantic-Org/Semantic-UI-React/issues/2867).

To fix this, you need to rename `./node_modules/semantic-ui-react/dist/es/lib/eventStack/eventStack.js` to `EventStack.js`. Then you should be good to go.


### How to run

Run `npm install`, then `npm run electron-dev`. An electron window will open up, then you upload your CSV file and visualize it.


##### Some assumptions meron makes:
- Input file must have a field called `Time`(with the capital T and everything).
- `Time` field of input must contain time stamps of either of the following formats, `yyyy mm dd hh mm ss` or `mm dd yyyy hh mm ss`. In fact, minute and second values can be omitted. The application can work without them.
- Input file does not have any non-numerical fields such as strings. It wouldn’t be much of a problem with small files, but for big ones, app's memory usage would bloat.
- Input file must fit in the memory. Even though the file isn’t stored in RAM after the parsing operations is done, during the parsing operation, the application stores the whole file in the memory for a short period of time. Hence the input file needs to be small enough to fit in the application’s memory.