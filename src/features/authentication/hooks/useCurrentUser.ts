import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

export const useCurrentUser = () => {
    const { user, profile, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const firstName = profile?.user.first_name || user?.first_name || '';
    const lastName = profile?.user.last_name || user?.last_name || '';
    const email = profile?.user.email || user?.email || '';

    const displayName = [firstName, lastName].filter(Boolean).join(' ') || email || 'User Profile';

    const getInitials = () => {
        const first = firstName.trim().charAt(0) || '';
        const last = lastName.trim().charAt(0) || '';
        return (first + last).toUpperCase() || 'NN';
    };

    return {
        user,
        profile,
        isAuthenticated,
        firstName,
        lastName,
        email,
        displayName,
        initials: getInitials(),
    };
};
