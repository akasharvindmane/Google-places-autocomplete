const { createEpicMiddleware } = require('redux-observable');
const { filter, mergeMap } = require('rxjs/operators');
const redux = require('redux');

const history = inputValue;

const countEpic = action$ => action$.pipe(
  filter(action => action.type === 'HISTORY_INCREMENT'),
  mergeMap(async (action) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { type: 'INCREMENT', count: 1 };
  })
);

const observableMiddleware = createEpicMiddleware();
const store = redux.createStore(reducer, redux.applyMiddleware(observableMiddleware));

observableMiddleware.run(countEpic);

// Sample Redux reducer
function reducer(state = 0, action) {
  console.log(`History +${history}`, action);

  switch (action.type) {
    case 'INCREMENT':
      return state + action.count;
    default:
      return state;
  }
}

store.dispatch({ type: 'HISTORY_INCREMENT' });