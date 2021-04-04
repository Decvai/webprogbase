import { useState } from 'react';
import Input from '../../utils/input/Input';
import { useLazyQuery } from '@apollo/client';
import './authorization.scss';
import { REGISTRATION } from '../../query/authorization';

function Registration() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [register, { loading, error }] = useLazyQuery(REGISTRATION, {
		onCompleted: data => {
			console.log('data ', data);
		},
	});

	if (loading) return <p>Loading ...</p>;
	if (error) return `Error! ${error.message}`;

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
		</div>
	);
}

export default Registration;
