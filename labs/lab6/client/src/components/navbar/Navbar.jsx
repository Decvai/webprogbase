import Logo from './../../assets/icons/logo.png';
import { NavLink, withRouter } from 'react-router-dom';
import './navbar.scss';

function Navbar() {
	const isAuth = false;

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

				{!isAuth && (
					<>
						<div className='navbar__login'>
							<NavLink to='/login'>Sign in</NavLink>
						</div>
						<div className='navbar__registration'>
							<NavLink to='/registration'>Sign up</NavLink>
						</div>
					</>
				)}

				{isAuth && (
					<>
						<NavLink to='/profile'>
							<img
								src='#'
								alt='avatar'
								className='navbar__avatar'
							/>
						</NavLink>
						<div className='navbar__logout'>
							<NavLink to='/login'>Sign out</NavLink>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

export default withRouter(Navbar);
