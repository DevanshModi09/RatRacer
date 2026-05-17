import { useAuthStore } from '../store/useAuthStore';

const ProfilePage = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="pt-20">
      {Object.entries(authUser).map(([key, value]) => (
        <h1 key={key} className="text-white text-5xl">
          {key}:{' '}
          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
        </h1>
      ))}
    </div>
  );
};

export default ProfilePage;
