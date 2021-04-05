import { useState } from 'react';
import Input from '../../utils/input/Input';
import { useLazyQuery } from '@apollo/client';
import './authorization.scss';
import { REGISTRATION } from '../../operations/queries/authorization';
import Loader from '../../utils/loader/Loader';
import Error from '../../utils/error/Error';

function Registration() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const [register, { loading }] = useLazyQuery(REGISTRATION, {
		onCompleted: data => {
			console.log('data ', data);
		},
		onError(err) {
			setError(err.graphQLErrors[0].message);
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
