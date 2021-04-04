import { useState } from 'react';
import { LOGIN } from '../../query/authorization';
import { useLazyQuery } from '@apollo/client';
import Input from '../../utils/input/Input';
import './authorization.scss';
import { isAuth } from '../cache';

function Login(props) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [login, { loading, error }] = useLazyQuery(LOGIN, {
		onCompleted: data => {
			localStorage.setItem('token', data.login);
			isAuth(true);

			console.log(isAuth());
			props.history.push('/');
		},
	});

	if (loading) return <p>Loading ...</p>;
	if (error) return <p>Error! {error.message}</p>;

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
		</div>
	);
}

export default Login;
