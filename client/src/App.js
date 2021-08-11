import './styles/index.css';
import { AppDiv } from './styles/AppStyles.js';
import { ProvideAuth } from './useAuth';
import NavBar from './components/NavBar/NavBar';
import ShowSinglePosting from './components/ShowSinglePosting/ShowSinglePosting';
import Landing from './components/Landing/Landing';
import Postings from './components/Postings/Postings';
import CreatePosting from './components/CreatePosting/CreatePosting';
import PrivateRoute from './components/PrivateRoute';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

function App() {
  return (
    <AppDiv>
        <ProvideAuth>
            <Router>
                <NavBar/>
                <Switch>
                <Route path="/" exact component={() => <Landing/>} />
                <Route path="/postings" exact component={() => <Postings/>} />
                <Route path="/posting/:id" exact component={() => <ShowSinglePosting/>} />
                <PrivateRoute path="/createPosting" render={() => <CreatePosting/>} />
                </Switch>
            </Router>
        </ProvideAuth>
    </AppDiv>)
}

export default App;
