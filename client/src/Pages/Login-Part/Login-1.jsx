import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login_1 = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const sub = localStorage.getItem('sub'); // Assuming sub is stored in localStorage after LinkedIn login
				const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-by-sub/${sub}`);
				setUser(response.data);
			} catch (error) {
				console.error('Error fetching user data:', error);
			}
		};

		fetchUserData();
	}, []);

	const Signup = () => {
		navigate('/profile1');
	};

	const Login = () => {
		navigate('/admin');
	};

	return (
		<>
			<div className='container mx-auto'>
				<div className='flex float-end mt-6'>
					<div className='border rounded text-white bg-blue-300 mr-5 p-2 w-32 text-center' onClick={Login}>
						Login
					</div>
					<div className='border rounded text-white bg-blue-300 mr-5 p-2 w-32 text-center cursor-pointer' onClick={Signup}>
						Sign Up
					</div>
				</div>
			</div>
		</>
	);
};

export default Login_1;