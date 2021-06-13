import './styles/App.css'
import CreateUsers from './components/CreateUsers/CreateUsers';
import CreatePosting from './components/CreatePosting/CreatePosting';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

function App() {

  return (
    <div class="App">
      <Router>
        <Switch>
          <Route path="/" exact component={CreateUsers} />
          <Route path="/createPosting" component={CreatePosting} />
        </Switch>
      </Router>
    </div>)
}

export default App;
