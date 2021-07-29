import { NavLink, useHistory } from 'react-router-dom';
import { useAuth } from '../../useAuth';

function AuthButton() {
    const history = useHistory();
    const auth = useAuth();
    return auth.user ? (
        <button onClick={() => auth.signOut(() => history.push('/'))}>Sign Out</button>
    ) : (
        <button onClick={() => history.push('/')}>Sign In</button>
    );
}

function NavBar() {
    const auth = useAuth();
    return (
        <div>
            <div>
                <NavLink to="/postings" activeClassName="activeNavLink">
                    Browse Postings
                </NavLink>
                {auth.user &&
                <NavLink to="/createPosting" activeClassName="activeNavLink">
                    Create Posting
                </NavLink>}
            </div>
            <AuthButton/>
        </div>
    );
}

export default NavBar;