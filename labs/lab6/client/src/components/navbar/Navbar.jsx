import { useQuery } from '@apollo/client';
import { NavLink, withRouter } from 'react-router-dom';
import LogoutIcon from '../../assets/icons/logout.svg';
import { PROFILE_QUERY } from '../../operations/queries/authorization';
import Logo from './../../assets/icons/logo.png';
import './navbar.scss';

function Navbar() {
	const { data } = useQuery(PROFILE_QUERY, {
		fetchPolicy: 'cache-only',
	});

	const currentUser = data?.me;

	function logOutHandler() {
		localStorage.removeItem('token');
		window.location.reload(false);
	}

	return (
		<div className='navbar'>
			<div className='container'>
				<div className='navbar__top' to='/'>
					<img
						src={Logo}
						alt='navbar-logo'
						className='navbar__logo'
					/>
					<div className='navbar__header'>Chinchuk</div>
				</div>

				{!currentUser && (
					<>
						<div className='navbar__login'>
							<NavLink to='/login'>Sign in</NavLink>
						</div>
						<div className='navbar__registration'>
							<NavLink to='/registration'>Sign up</NavLink>
						</div>
					</>
				)}

				{currentUser && (
					<div className='navbar__logout'>
						<NavLink
							className='navbar__logout-button'
							to='/login'
							onClick={() => logOutHandler()}
						>
							<img src={LogoutIcon} alt='logout-icon'></img>
							<div className='navbar__logout-text'>LOGOUT</div>
						</NavLink>
					</div>
				)}
			</div>
		</div>
	);
}

export default withRouter(Navbar);
