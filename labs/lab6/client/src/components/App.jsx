import { useQuery } from '@apollo/client';
import { Redirect, Route, Switch } from 'react-router-dom';
import { currentUserVar } from '../cache';
import { PROFILE_QUERY } from '../operations/queries/authorization';
import Loader from '../utils/loader/Loader';
import './app.scss';
import Login from './authorization/Login';
import Registration from './authorization/Registration';
import ChatMenu from './chatSection/chatList/chatMenu/ChatMenu';
import ChatSection from './chatSection/ChatSection';
import Navbar from './navbar/Navbar';

function App() {
	const { loading, data } = useQuery(PROFILE_QUERY, {
		fetchPolicy: 'cache-first',
	});

	if (loading) {
		return <Loader />;
	}

	currentUserVar(data?.me);

	const currentUser = currentUserVar();
	console.log(currentUser);

	return (
		<div className='app'>
			<Navbar />

			<div className='wrap'>
				{!currentUser ? (
					<Switch>
						<Route path='/registration' component={Registration} />
						<Route path='/login' component={Login} />
						<Redirect to='/login' />
					</Switch>
				) : (
					<Switch>
						<Route path='/rooms' component={ChatSection} exact />
						<Route
							path='/rooms/:id'
							component={ChatMenu}
							exact
						></Route>
						<Redirect
							to={
								currentUser?.currentRoom
									? `/rooms/${currentUser.currentRoom.id}`
									: '/rooms'
							}
						/>
					</Switch>
				)}
			</div>
		</div>
	);
}

export default App;
