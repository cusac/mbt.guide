import { useNavigate } from 'react-router-dom';

export const useHistory = () => {
  const navigate = useNavigate();
  return {
    push: (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
    goBack: () => navigate(-1),
  };
};

// Create a default export for backward compatibility
// This will be used in components that can't use hooks
const history = {
  push: (path: string) => {
    // This will be replaced by the actual navigation in components that use hooks
    console.warn('history.push called outside of component context. Use useHistory hook instead.');
    window.location.href = path;
  },
  replace: (path: string) => {
    console.warn(
      'history.replace called outside of component context. Use useHistory hook instead.'
    );
    window.location.href = path;
  },
  goBack: () => {
    console.warn(
      'history.goBack called outside of component context. Use useHistory hook instead.'
    );
    window.history.back();
  },
};

export default history;
