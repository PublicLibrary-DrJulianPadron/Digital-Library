import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function GoogleLogin() {

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Step 1: Get the access token from Google
        const accessToken = tokenResponse.access_token;

        // Step 2: Send token to Django backend
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/accounts/google/login/callback/`, {
          access_token: accessToken,
        });

        // Step 3: Handle the JWT response from Django
        console.log("Django Token:", res.data.access);
        console.log("User Data:", res.data.user);

        // Save token to localStorage (or httpOnly cookie context)
        localStorage.setItem('access_token', res.data.access);

      } catch (err) {
        console.error("Login Failed", err);
      }
    },
  });

  return (
    <button onClick={() => googleLogin()}>
      Sign in with Google
    </button>
  );
}