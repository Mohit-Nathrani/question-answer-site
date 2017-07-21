import React from 'react';
import ReactDOM from 'react-dom';
import Read from './Components/Read';
import Auth from './Components/Auth';
import Profile from './Components/Profile';
import Answer from './Components/Answer';
import Activity from './Components/Activity';
import Activityans from './Components/Activityans';
import Ask from './Components/Ask';
import Question from './Components/Question'
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import "./style.css"

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={Read}/>
      <Route path="/auth" component={Auth}/>
      <Route path="/answer" component={Answer}/>
      <Route path="/profile" component={Profile}/>
      <Route path="/activity" component={Activity}/>
      <Route path="/activityans" component={Activityans}/>
      <Route path="/ask" component={Ask}/>
      <Route path="/question/:id" component={Question}/>
    </Switch>
  </Router>,
  document.getElementById('root')
);
registerServiceWorker();
