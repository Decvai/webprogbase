import { useLazyQuery } from '@apollo/client';
import { useState } from 'react';
import { LOGIN } from '../../operations/queries/authorization';
import Error from '../../utils/error/Error';
import Input from '../../utils/input/Input';
import Loader from '../../utils/loader/Loader';
import './authorization.scss';

function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const [loader, setLoader] = useState(false);

	const [login] = useLazyQuery(LOGIN, {
		onCompleted: data => {
			localStorage.setItem('token', data.login);
			window.location.reload(false);
		},
		onError(err) {
			setLoader(false);
			setError(err?.graphQLErrors[0]?.message);
		},
	});

	if (loader) return <Loader />;

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
					className='authorization__password'
					value={password}
					setValue={setPassword}
					type='password'
					placeholder='Password'
				/>
				<button
					className='authorization__btn'
					onClick={() => {
						setLoader(true);
						login({
							variables: { username, password },
						});
					}}
				>
					Continue
				</button>
			</form>

			{error && <Error>{error}</Error>}
		</div>
	);
}

export default Login;
