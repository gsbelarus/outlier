## Statistical detection of outliers

1. Click START button to activate automatic random input generation. 
2. Numbers are added with frequency one per second.
3. First 100 numbers are added at once. In such way we guarantee initial statistics. 
4. Normal distribution for random numbers is used.
5. Outliers are those numbers which lies below lower fence or above upper fence. Upper fence calculated as Q3 + (0.5 * IQR), and lower fence  Q1 – (0.5 * IQR). Where Q1, Q3 are appropriate quartiles and IQR = Q3 - Q1.
6. Only last five minutes of data are stored. Older data is discarded.
7. Outliers are displayed in red.

## Sources

1. All presentational part is in App.ts and App.css files.
2. Consumer class is in src/od.ts. It has accept method which adds given number to the internal array, recalculates statistics and returns true or false depending whether given number is outlier or not.