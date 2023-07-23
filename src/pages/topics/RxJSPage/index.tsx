/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react'
import { of, interval, fromEvent, throwError, from, timer, Subscription, merge, iif, combineLatest, zip, Subject, ConnectableObservable } from "rxjs"
import { bufferTime, catchError, combineAll, concatAll, delay, flatMap, map, mapTo, mergeMap, multicast, pluck, scan, share, shareReplay, switchMap, take, tap } from 'rxjs/operators'
import { ajax } from 'rxjs/ajax'
import styles from './style.module.css'

export default function Rxjs () {
  // const source = ['三宮つばき', '藍芽みずき', '七海ティナ']
  // const names$ = of(source)
  // const names$ = interval(1000).pipe(map(i => source.slice(0, i + 1)))
  
  
  // const api = `https://randomuser.me/api/?results=5&seed=rx-react&nat=us&inc=name&noinfo`
  // const getName = (user:any) => `${user.name.first} ${user.name.last}`
  // const names$ = ajax
  //   .getJSON(api)
  //   .pipe(map(({ results: users } : any) => users.map(getName)));
// 
// 
  // const [names, setNames] = useState(source)

  useEffect(() => {
  }, [])


  return (
    <div className={styles["rxjs-demo"]}>
      <h1>RxJs Demo</h1>
      <hr />
      <FromDemo />
      <hr />
      <OfDemo />
      <hr />
      <ScanDemo />
      <hr />
      <TapDemo />
      <hr />
      <MergeDemo />
      <hr />
      <SwitchMapDemo />
      <hr />
      <MergeMapDemo />
      <hr />
      <IifDemo />
      <hr />
      <CombineDemo />
      <hr />
      <ConcatDemo />
      <hr />
      <ZipDemo />
      <hr />
      <MulticastDemo />
      <hr />
      <ShareDemo />
      <hr />
      <ShareReplayDemo />
      <hr />
      <AjaxDemo />
      <hr />
      <BufferTimeDemo />
      <hr />
      <CatchDemo />
    </div>
  )
}

const FromDemo = () => {
  //emit array as a sequence of values
  const example = from([1, 2, 3, 4, 5]);

  const onClick = () => {
    example.subscribe(val =>
      console.log(val)
    )
  }

  //emit result of promise
  const promiseSource = from(new Promise(resolve => resolve('Hello World!')))
  const onClickPromiseSource = () => {
    promiseSource.subscribe(val => console.log(val))
  }

  //emit string as a sequence
  const stringSource = from('Hello World')
  const onClickString = () => {
    stringSource.subscribe(val => console.log(val))
  }

  return (
    <div>
      <h2>from</h2>
      <p className={styles.description}>Turn an array, promise, or iterable into an observable.</p>
      <div className={styles["button-group"]}>
        <button onClick={onClick}>test array</button>
        <button onClick={onClickPromiseSource}>test promise</button>
        <button onClick={onClickString}>test string</button>
      </div>
    </div>
  )
} 


const OfDemo = () => {

  //emits any number of provided values in sequence
  const source = of(1, 2, 3, 4, 5);

  const onClick = () => {
    source.subscribe(val => console.log(val))
  }

  return (
    <div>
      <h2>of</h2>
      <p className={styles.description}>Emit variable amount of values in a sequence and then emits a complete notification.</p>
      <button onClick={onClick}>start test</button>
    </div>
  )
}


const ScanDemo = () => {

  const source = of(1, 2, 3);
  // basic scan example, sum over time starting with zero
  const example = source.pipe(scan((acc, curr) => acc + curr, 0));
  // log accumulated values
  // output: 1,3,6

  const onClick = () => {
    example.subscribe(val => console.log(val))
  }

  return (
    <div>
      <h2>scan</h2>
      <p className={styles.description}>Reduce over time.</p>
      <button onClick={onClick}>start test</button>
    </div>
  )
}


const TapDemo = () => {

  const source = of(1, 2, 3, 4, 5);
  // transparently log values from source with 'tap'
  const example = source.pipe(
    tap(val => console.log(`BEFORE MAP: ${val}`)),
    map(val => val + 10),
    tap(val => console.log(`AFTER MAP: ${val}`))
  )

  const onClick = () => {
    example.subscribe(val => console.log(val))
  }

  return (
    <div>
      <h2>tap</h2>
      <p className={styles.description}>Transparently perform actions or side-effects, such as logging.</p>
      <button onClick={onClick}>start test</button>
    </div>
  )
}


const MergeDemo = () => {
  //emit every 2.5 seconds
  const first = interval(2500)
  //emit every 2 seconds
  const second = interval(2000)
  //emit every 1.5 seconds
  const third = interval(1500)
  //emit every 1 second
  const fourth = interval(1000)

  //emit outputs from one observable
  const example = merge(
    first.pipe(mapTo('FIRST!')),
    second.pipe(mapTo('SECOND!')),
    third.pipe(mapTo('THIRD')),
    fourth.pipe(mapTo('FOURTH'))
  )

  const onClick = () => {
    example.subscribe(val => console.log(val))
  }

  return (
    <div>
      <h2>merge</h2>
      <p className={styles.description}>Turn multiple observables into a single observable.</p>
      <button onClick={onClick}>start test</button>
    </div>
  )
}



const SwitchMapDemo = () => {
  let subscription: Subscription
  const example = fromEvent(document, 'click')
    .pipe(
      // restart counter on every click

      // test with mergeMap
      mergeMap(() => interval(1000))
    )
  const onClick = () => {
    subscription = example.subscribe(console.log);
  }

  const onClikcUnsubscribe = () => {
    subscription.unsubscribe()
  }

  return (
    <div>
      <h2>switchMap</h2>
      <p className={styles.description}>Map to observable, complete previous inner observable, emit values.</p>
      <p className="text-xs my-3 aaa">
      The main difference between switchMap and other flattening operators is the cancelling effect. On each emission the previous inner observable (the result of the function you supplied) is cancelled and the new observable is subscribed. You can remember this by the phrase switch to a new observable.
      </p>
      <div className={styles["button-group"]}>
      <button onClick={onClick}>start test</button>
      <button onClick={onClikcUnsubscribe}>stop test</button>
      </div>
      
    </div>
  )
}

const MergeMapDemo = () => {
  // faking network request for save
  const saveLocation = (location:any) => {
    return of(location).pipe(delay(1000))
  }
  // streams
  const click$ = fromEvent(document, 'click')

  const onClick = () => {
    click$
      .pipe(
        mergeMap((e: Event) => {
          return saveLocation({
            x: (e as MouseEvent).clientX,
            y: (e as MouseEvent).clientY,
            timestamp: Date.now()
          })
        })
      )
      // Saved! {x: 98, y: 170, ...}
      .subscribe(r => console.log('Saved!', r));
  }

  return (
    <div>
      <h2>mergeMap</h2>
      <p className={styles.description}>Map to observable, emit values.</p>
      <button onClick={onClick}>start test</button>
    </div>
  )
}


const IifDemo = () => {
  const r$ = of('R')
  const x$ = of('X')

  const onClick = () => {
    interval(1000)
      .pipe(mergeMap(v => iif(() => v % 4 === 0, r$, x$)))
      .subscribe(console.log)
  }

  return (
    <div>
      <h2>iif</h2>
      <p className={styles.description}>Subscribe to first or second observable based on a condition</p>
      <button onClick={onClick}>start test</button>
    </div>
  )
}



const CombineDemo = () => {
  // emit every 1s, take 2
  const source$ = interval(1000).pipe(take(2), tap(val => console.log('ppp:::', val)))
  // map each emitted value from source to interval observable that takes 5 values
  const example$ = source$.pipe(
    map(val =>
      interval(2000).pipe(
        map(i => `Result (${val}): ${i}`),
        take(5)
      )
    )
  )  

  const onClick = () => {
    
    example$
      .pipe(combineAll())
      /*
      output:
      ["Result (0): 0", "Result (1): 0"]
      ["Result (0): 1", "Result (1): 0"]
      ["Result (0): 1", "Result (1): 1"]
      ["Result (0): 2", "Result (1): 1"]
      ["Result (0): 2", "Result (1): 2"]
      ["Result (0): 3", "Result (1): 2"]
      ["Result (0): 3", "Result (1): 3"]
      ["Result (0): 4", "Result (1): 3"]
      ["Result (0): 4", "Result (1): 4"]
    */
      .subscribe((val) => console.log(`${new Date()}::::${val}`));

  }

 
  const inner0$ = interval(2000).pipe(
    map(i => `Result (0): ${i}`), 
    take(5)
  )

  const inner1$ = interval(2000).pipe(
    map(i => `Result (1): ${i}`), 
    take(5)
  )


  const onClickCombineLatest = () => {
    // when one timer emits, emit the latest values from each timer as an array
    combineLatest([inner0$, inner1$]).subscribe((val) => console.log(`${new Date()}::::${val}`))
  }



  // timerOne emits first value at 1s, then once every 4s
  const timerOne$ = timer(1000, 4000).pipe(tap(val => console.log('pp::::', val)))
  // timerTwo emits first value at 2s, then once every 4s
  const timerTwo$ = timer(2000, 4000).pipe(tap(val => console.log('pp::::', val)))
  // timerThree emits first value at 3s, then once every 4s
  const timerThree$ = timer(3000, 4000).pipe(tap(val => console.log('pp::::', val)))

  const onClickCombineLatest2 = () => {
    // when one timer emits, emit the latest values from each timer as an array
    combineLatest([timerOne$, timerTwo$, timerThree$]).subscribe(
      ([timerValOne, timerValTwo, timerValThree]) => {
        /*
          Example:
        timerThree first tick: 'Timer One Latest: 0, Timer Two Latest: 0, Timer Three Latest: 0
        timerOne second tick: 'Timer One Latest: 1, Timer Two Latest: 0, Timer Three Latest: 0
        timerTwo second tick: 'Timer One Latest: 1, Timer Two Latest: 1, Timer Three Latest: 0
      */
        console.log(
          `Timer One Latest: ${timerValOne},
         Timer Two Latest: ${timerValTwo},
         Timer Three Latest: ${timerValThree}`
        );
      }
    )
  }

  return (
    <div>
      <h2>combineAll, combineLatest</h2>
      <p className={styles.description}>
        combineAll: after outer Observable completes, then subscribe all inner Observavles with combineLatest.<br />
        combineLatest: when one timer emits, emit the latest values from each timer as an array
      </p>
      <div className={styles["button-group"]}>
        <button onClick={onClick}>test combineAll</button>
        <button onClick={onClickCombineLatest}>test combineLatest</button>
        <button onClick={onClickCombineLatest2}>test combineLatest 2</button>
      </div>
      
    </div>
  )
}


const ConcatDemo = () => {
  
  //emit a value every 2 seconds
  const source = interval(2000).pipe(take(3))
  const example = source.pipe(
    //for demonstration, add 10 to and return as observable
    map(val => interval(1000).pipe(
      tap(i => console.log(`${val}:::${i}`)),
      take(3)
    )),
    //merge values from inner observable
    concatAll()
  )

  const onClickConcatAll = () => {
    //output: 'Example with Basic Observable 10', 'Example with Basic Observable 11'...
    const subscribe = example.subscribe(val =>
      console.log('Example with Basic Observable:', val)
    )
  }

  return (
    <div>
      <h2>concat, concatAll</h2>
      <p className={styles.description}>
        concat: Subscribe to observables in order as previous completes<br />
        concatAll: Collect observables and subscribe to next when previous completes.
      </p>
      <div className={styles["button-group"]}>
        <button onClick={onClickConcatAll}>test concatAll</button>
      </div>
      
    </div>
  )
}

const ZipDemo = () => {
  
  const sourceOne = /* timer(1000, 4000)// */of('Hello');
  const sourceTwo = of('World!');
  const sourceThree = of('Goodbye');
  const sourceFour = of('World!');
  //wait until all observables have emitted a value then emit all as an array
  const example = zip(
    sourceOne,
    sourceOne.pipe(delay(1000)),
    sourceOne.pipe(delay(2000)),
    sourceOne.pipe(delay(3000))
  )
  
  const onClick = () => {
    const subscribe = example.subscribe(console.log)
  }

  return (
    <div>
      <h2>zip</h2>
      <p className={styles.description}>
        After all observables emit, emit values as an array
      </p>
      <div className={styles["button-group"]}>
        <button onClick={onClick}>start test</button>
      </div>
      
    </div>
  )
}


const MulticastDemo = () => {
  
  //emit every 2 seconds, take 5
  const source = interval(2000).pipe(take(5));

  const example = source.pipe(
    //since we are multicasting below, side effects will be executed once
    tap(() => console.log('Side Effect #1')),
    mapTo('Result!')
  );

  //subscribe subject to source upon connect()
  const multi = example.pipe(multicast(() => new Subject())) as ConnectableObservable<string>

  const subscriberOne = multi.subscribe(val => console.log(val))
  const subscriberTwo = multi.subscribe(val => console.log(val))

  const onClick = () => {
    //subscribe subject to source
    multi.connect()
  }

  return (
    <div>
      <h2>multicast</h2>
      <p className={styles.description}>
        Share source utilizing the provided Subject
      </p>
      <div className={styles["button-group"]}>
        <button onClick={onClick}>start test</button>
      </div>
      
    </div>
  )
}



const ShareDemo = () => {

  //emit value in 1s
  const source = interval(1000).pipe(take(2))
  //log side effect, emit result
  const example = source.pipe(
    tap(() => console.log('***SIDE EFFECT***')),
    mapTo('***RESULT***')
  );

  const onClick = () => {
    // const subscribe = example.subscribe(val => console.log('1:::', val));
    // const subscribeTwo = example.subscribe(val => console.log('2:::', val));
      
    //share observable among subscribers
    const sharedExample = example.pipe(share());
    /*
      ***SHARED, SIDE EFFECT EXECUTED ONCE***
      output:
      "***SIDE EFFECT***"
      "***RESULT***"
      "***RESULT***"
    */
    const subscribeThree = sharedExample.subscribe(val => console.log('3:::', val));
    const subscribeFour = sharedExample
      .pipe(delay(1000))
      .subscribe(val => console.log('4:::', val));
  }

  return (
    <div>
      <h2>share</h2>
      <p className={styles.description}>Share source among multiple subscribers</p>
      <button onClick={onClick}>start test</button>
    </div>
  )
}


const ShareReplayDemo = () => {
  // simulate url change with subject
  const routeEnd = new Subject<{data: any, url: string}>();
  
  // grab url and share with subscribers
  const lastUrl = routeEnd.pipe(
    tap(_ => console.log('executed')),
    pluck('url'),
    // defaults to all values so we set it to just keep and replay last one
    shareReplay(1)
    // share()
  )

  const onClick = () => {
    // requires initial subscription
    const initialSubscriber = lastUrl.subscribe(console.log)
    // simulate route change
    // logged: 'executed', 'my-path'
    routeEnd.next({data: {}, url: 'my-path'})
  }

  const changeUrl = () => {
    // logged: 'my-path'
    const lateSubscriber = lastUrl.subscribe(console.log);
  }


  return (
    <div>
      <h2>shareReplay</h2>
      <p className={styles.description}>Share source and replay specified number of emissions on subscription.</p>
      <div className={styles["button-group"]}>
        <button onClick={onClick}>start test</button>
        <button onClick={changeUrl}>change url</button>
      </div>
    </div>
  ) 
}


const AjaxDemo = () => {
  const githubUsers = `https://api.github.com/users?per_page=2`

  const users = ajax(githubUsers)

  const onClick = () => {
    users.subscribe(
      res => console.log(res),
      err => console.error(err)
    )
  }

  return (
    <div>
      <h2>ajax</h2>
      <p className={styles.description}>Create an observable for an Ajax request with either a request object with url, headers, etc or a string for a URL.</p>
      <button onClick={onClick}>start test</button>
    </div>
  )
}


const BufferTimeDemo = () => {
  const source = interval(500);
  //After 2 seconds have passed, emit buffered values as an array
  const example = source.pipe(bufferTime(2000));

  const onClick = () => {
    example.subscribe(val =>
      console.log('Buffered with Time:', val)
    )
  }

  return (
    <div>
      <h2>buffertime</h2>
      <p className={styles.description}>Collect emitted values until provided time has passed, emit as array.</p>
      <button onClick={onClick}>start test</button>
    </div>
  )
}


const CatchDemo = () => {
  //emit error
  const source = throwError('This is an error!');
  //gracefully handle error, returning observable with error message
  const example = source.pipe(catchError(val => of(`I caught: ${val}`)));

  const onClick = () => {
    example.subscribe(val =>
      console.log(val)
    )
  }

  return (
    <div>
      <h2>catch / catchError</h2>
      <p className={styles.description}>Gracefully handle errors in an observable sequence.</p>
      <button onClick={onClick}>start test</button>
    </div>
  )
}