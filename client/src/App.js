import './styles/App.css'
import './styles/index.css'
import Landing from './components/Landing/Landing';
import Postings from './components/Postings/Postings';
import CreatePosting from './components/CreatePosting/CreatePosting';
import PrivateRoute from './components/PrivateRoute';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { useEffect, useState } from 'react';

function App() {

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const foundUser = JSON.parse(user);
      setUserId(foundUser.id); // could use tokens here as well but no need for adding complexity rn
    }
  }, []);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={() => <Landing setUserId={setUserId} />} />
          <Route path="/postings" exact component={() => <Postings />} />
          <PrivateRoute path="/createPosting" render={() => <CreatePosting user_id={userId} setUserId={setUserId} />} />
        </Switch>
      </Router>
    </div>)
}

export default App;
