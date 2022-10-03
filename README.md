## Statistical detection of outliers

1. Click START button to activate automatic random input generation. 
2. Numbers are added with frequency one per second.
3. First 300 numbers are added at once. In such way we guarantee initial statistics. 
4. Normal distribution for random numbers is used with standard deviation of 333.
5. We use two methods of detection. First one is a range method. Outliers are those numbers which lies below lower fence or above upper fence. Upper fence calculated as Q3 + (1.5 * IQR), and lower fence  Q1 – (1.5 * IQR). Where Q1, Q3 are appropriate quartiles and IQR = Q3 - Q1. Range outliers are displayed in red.
6. Second method is detecting trough z-score. Such outliers are displayed in violet. We use condition of 2 * SD.
7. Only last five minutes of data are stored. Older data is discarded.

## Sources

1. All presentational part is in App.ts and App.css files.
2. Consumer class is in src/od.ts. It has the accept method which adds given number to the internal array, recalculates statistics and returns true or false depending on whether given number is an outlier or not.