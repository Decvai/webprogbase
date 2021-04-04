import './app.scss';
import Navbar from './navbar/Navbar';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Registration from './authorization/Registration';
import Chat from './chat/Chat';
import Login from './authorization/Login';
import { useQuery } from '@apollo/client';
import { LOGIN } from '../query/authorization';
import Loader from '../utils/loader/Loader';
import { isAuth } from './cache';

function App() {
	const { loading, error, data } = useQuery(LOGIN, {
		skip: true,
	});
	// const isAuth = Boolean(false);

	console.log('IS_AUTH:', isAuth());

	// if (loading) return <Loader />;
	// if (error) return <div>An error occurred</div>;
	// if (!data) return <div>No data!</div>;

	return (
		<BrowserRouter>
			<div className='app'>
				<Navbar />

				<div className='wrap'>
					{!false ? (
						<Switch>
							<Route
								path='/registration'
								component={Registration}
							/>
							<Route path='/login' component={Login} />
							{/* <Redirect to='/login' /> */}
						</Switch>
					) : (
						<Switch>
							<Route path='/' component={Chat} exact />
							<Redirect to='/' />
						</Switch>
					)}
				</div>
			</div>
		</BrowserRouter>
	);
}

export default App;
