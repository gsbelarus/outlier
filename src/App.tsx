import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { Consumer } from './od';

const rand = () => {
  let u = 1 - Math.random(); 
  let v = Math.random();
  return Math.floor(1000 * Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v ));
};

interface IItem {
  v: number;
  outlier: boolean;
};

function App() {
  const [active, setActive] = useState(false);
  const [data, setData] = useState<IItem[]>([]);
  const timer = useRef<number | undefined>();
  const consumer = useRef(new Consumer());

  const addItem = useCallback( () => {
    // initial data to get some stats
    if (!consumer.current.data.length) {
      for (let i = 0; i < 100; i++) {
        consumer.current.accept(rand());
      }
    }

    const v = rand();
    const item = {
      v,
      outlier: consumer.current.accept(v)
    };
    setData( d => [...d.slice(-10), item] );
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
        </div>
      </div>
      <div className="Data">
        {
          data.map( ({v, outlier}, idx) => <div className={outlier ? 'outlier' : ''} key={idx}>{v}</div> )
        }
      </div>
    </div>
  );
}

export default App;
