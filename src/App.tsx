import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { Consumer, IOutlierResult } from './od';

const rand = () => {
  let u = 1 - Math.random(); 
  let v = Math.random();
  return Math.round(333 * Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v ));
};

interface IItem {
  v: number;
  outlier: IOutlierResult;
};

function App() {
  const [active, setActive] = useState(false);
  const [data, setData] = useState<IItem[]>([]);
  const timer = useRef<number | undefined>();
  const consumer = useRef(new Consumer());

  const addItem = useCallback( () => {
    // initial data to get some stats
    if (!consumer.current.data.length) {
      for (let i = 0; i < 300; i++) {
        consumer.current.accept(rand());
      }
    }

    const v = rand();
    const item = {
      v,
      outlier: consumer.current.accept(v)
    };
    setData( d => [...d.slice(-17), item] );
  }, [setData]);

  const clear = useCallback( () => {
    consumer.current.clear();
    setData([]);
  }, [setData]);

  useEffect( () => {
    if (timer.current) {
      clearInterval(timer.current);
    }
    
    if (active) {
      timer.current = window.setInterval(addItem, 1000);
    }
  }, [active, addItem]);

  return (
    <div className="App">
      <div className="LeftPane">
        <div className="Toolbar">
          <div className={ active ? 'disabled' : '' } onClick={ () => setActive(true) }>Start</div>
          <div className={ !active ? 'disabled' : '' } onClick={ () => setActive(false) }>Stop</div>
          <div className={ !consumer.current.data.length ? 'disabled' : '' } onClick={ () => { setActive(false); clear(); } }>Clear</div>
          <div className={ active ? 'disabled' : '' } onClick={ addItem }>Add One</div>
        </div>
        <div className="Stat">
          <div><span>Count:</span><span>{consumer.current.data.length}</span></div>
          <div><span>Median:</span><span>{consumer.current.median}</span></div>
          <div><span>Q1:</span><span>{consumer.current.q1}</span></div>
          <div><span>Q3:</span><span>{consumer.current.q3}</span></div>
          <div><span>IQR:</span><span>{consumer.current.iqr}</span></div>
          <div><span>Mean:</span><span>{consumer.current.mean}</span></div>
          <div><span>SD:</span><span>{consumer.current.sd}</span></div>
        </div>
      </div>
      <div className="Data">
        {
          data.map( ({v, outlier}, idx) => <div className={
            outlier.rangeOutlier 
              ? 'rangeOutlier'
              : outlier.zScoreOutlier
              ? 'zScoreOutlier'
              : ''
          } key={idx}>{v}</div> )
        }
      </div>
      <div className="Doc">
         <h2>Statistical detection of outliers</h2>
         <ol>
            <li>Click START button to activate automatic random input generation.</li> 
            <li> Numbers are added with frequency one per second.</li>
            <li> First 300 numbers are added at once. In such way we guarantee initial statistics. </li>
            <li> Normal distribution for random numbers is used with standard deviation of 333.</li>
            <li> We use two methods of detection. First one is a range method. Outliers are those numbers which lies below lower fence or above upper fence. Upper fence calculated as Q3 + (1.5 * IQR), and lower fence  Q1 – (1.5 * IQR). Where Q1, Q3 are appropriate quartiles and IQR = Q3 - Q1. Range outliers are displayed in red.</li>
            <li> Second method is detecting trough z-score. Such outliers are displayed in violet. We use condition of 2 * SD.</li>
            <li> Only last five minutes of data are stored. Older data is discarded.</li>
         </ol>

         <h2>Sources</h2>
         <ol>
            <li> All presentational part is in App.ts and App.css files.</li>
            <li> Consumer class is in src/od.ts. It has the accept method which adds given number to the internal array, 
              recalculates statistics and returns true or false depending on whether given number is an outlier or not.</li>
         </ol>
      </div>
    </div>
  );
}

export default App;
