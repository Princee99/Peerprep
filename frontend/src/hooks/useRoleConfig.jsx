const useRoleConfig = (role) => {
  switch (role) {
    case 'admin':
      return {
        icon: (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
          </svg>
        ),
        gradient: 'from-emerald-500 via-emerald-600 to-emerald-700',
        bgGradient: 'from-emerald-50 to-emerald-100',
        title: 'Admin Portal',
        subtitle: 'System Administration Access'
      };
    case 'student':
      return {
        icon: (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
          </svg>
        ),
        gradient: 'from-blue-500 via-blue-600 to-blue-700',
        bgGradient: 'from-blue-50 to-blue-100',
        title: 'Student Portal',
        subtitle: 'Your Academic Journey Starts Here'
      };
    case 'alumni':
      return {
        icon: (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        ),
        gradient: 'from-purple-500 via-purple-600 to-purple-600',
        bgGradient: 'from-purple-50 to-purple-100',
        title: 'Alumni Network',
        subtitle: 'Reconnect with Your Alma Mater'
      };
    default:
      return {
        icon: null,
        gradient: 'from-gray-500 to-gray-600',
        bgGradient: 'from-gray-50 to-gray-100',
        title: 'Portal',
        subtitle: 'Welcome Back'
      };
  }
};

export default useRoleConfig;