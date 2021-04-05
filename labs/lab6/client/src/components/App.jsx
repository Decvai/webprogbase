import './app.scss';
import Navbar from './navbar/Navbar';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Registration from './authorization/Registration';
import Login from './authorization/Login';
import { gql, useQuery, useReactiveVar } from '@apollo/client';
import Loader from '../utils/loader/Loader';
// import { tokenVar } from '../cache';
import { PROFILE_QUERY } from '../operations/queries/authorization';
import ChatSection from './chatSection/ChatSection';
import ChatMenu from './chatSection/chatList/chatMenu/ChatMenu';

function App(props) {
	const { client, loading, data } = useQuery(PROFILE_QUERY, {
		fetchPolicy: 'network-only',
	});

	const currentUser = data?.me;
	console.log(currentUser);

	if (loading) {
		return <Loader />;
	}

	return (
		<BrowserRouter>
			<div className='app'>
				<Navbar />

				<div className='wrap'>
					{!currentUser ? (
						<Switch>
							<Route
								path='/registration'
								component={Registration}
							/>
							<Route path='/login' component={Login} />
							<Redirect to='/login' />
						</Switch>
					) : (
						<Switch>
							<Route
								path='/rooms'
								component={ChatSection}
								exact
							/>
							<Route
								path='/rooms/:id'
								component={ChatMenu}
								exact
							></Route>
							<Redirect to='/rooms' />
						</Switch>
					)}
				</div>
			</div>
		</BrowserRouter>
	);
}

export default App;

export const GET_AUTH = gql`
	query GetAuth {
		auth @client
	}
`;
