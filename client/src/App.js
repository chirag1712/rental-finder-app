import './styles/App.css'
import './styles/index.css'
import Landing from './components/Landing/Landing';
import CreatePosting from './components/CreatePosting/CreatePosting';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { useState } from 'react';

function App() {

  const [userId, setUserId] = useState(null);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={() => <Landing setUserId={setUserId} />} />
          <Route path="/createPosting" render={() => <CreatePosting user_id={userId} />} />
        </Switch>
      </Router>
    </div>)
}

export default App;
