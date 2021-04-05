import { useState } from 'react';
import { LOGIN } from '../../operations/queries/authorization';
import { useLazyQuery } from '@apollo/client';
import Input from '../../utils/input/Input';
import './authorization.scss';
import Loader from '../../utils/loader/Loader';
import Error from '../../utils/error/Error';
// import { tokenVar } from '../../cache';

function Login(props) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const [login, { client, loading }] = useLazyQuery(LOGIN, {
		onCompleted: data => {
			localStorage.setItem('token', data.login);
			client.resetStore();
			props.history.push('/');
		},
		onError(err) {
			setError(err.graphQLErrors[0].message);
		},
	});

	if (loading) return <Loader />;

	return (
		<div className='authorization'>
			<div className='authorization__header'>Sign in</div>
			<form onSubmit={e => e.preventDefault()}>
				<Input
					value={username}
					setValue={setUsername}
					type='text'
					placeholder='Username'
				/>
				<Input
					value={password}
					setValue={setPassword}
					type='password'
					placeholder='Password'
				/>
				<button
					className='authorization__btn'
					onClick={() =>
						login({
							variables: { username, password },
						})
					}
				>
					Continue
				</button>
			</form>

			{error && <Error>{error}</Error>}
		</div>
	);
}

export default Login;
