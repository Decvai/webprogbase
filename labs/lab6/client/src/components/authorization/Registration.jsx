import { useLazyQuery } from '@apollo/client';
import { useState } from 'react';
import { LOGIN, REGISTRATION } from '../../operations/queries/authorization';
import Error from '../../utils/error/Error';
import Input from '../../utils/input/Input';
import Loader from '../../utils/loader/Loader';
import './authorization.scss';

function Registration() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const [register, { loading }] = useLazyQuery(REGISTRATION, {
		onCompleted: () => {
			login({
				variables: { username, password },
			});
		},
		onError(err) {
			setError(err?.graphQLErrors[0]?.message);
		},
	});

	const [login] = useLazyQuery(LOGIN, {
		onCompleted: data => {
			localStorage.setItem('token', data.login);
			window.location.reload(false);
		},
		onError(err) {
			setError(err?.graphQLErrors[0]?.message);
		},
	});

	if (loading) return <Loader />;

	return (
		<div className='authorization'>
			<div className='authorization__header'>Sign up</div>
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
						register({
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

export default Registration;
