import RoleCard from '../components/RoleCard';
import { useRoleNavigation } from '../hooks/useRoleNavigation';

const Home = () => {
  const handleRoleClick = useRoleNavigation();

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex justify-center items-center p-5 m-0 fixed inset-0 overflow-y-auto">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-indigo-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-200/20 to-blue-200/20 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 text-center max-w-7xl w-full mx-auto p-5">
        {/* Header Section */}
        <div className="mb-16">
          
          <h1 className="text-5xl md:text-4xl lg:text-5xl mb-6 font-black bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent leading-tight">
            Placement Preparation
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Platform
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
            Connect with alumni, access company reviews, get placement guidance, 
            <br className="hidden md:block" />
            and excel in your career journey
          </p>

          
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <RoleCard
            color="blue"
            title="Student Portal"
            description="Access company reviews, ask doubts, get guidance from alumni and excel in placements"
            buttonText="Get Started"
            onClick={() => handleRoleClick('student')}
            svg={<svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <RoleCard
            color="purple"
            title="Alumni Network"
            description="Share experiences, mentor students, give back to the community and build connections"
            buttonText="Join Network"
            onClick={() => handleRoleClick('alumni')}
            svg={<svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>}
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <RoleCard
            color="emerald"
            title="Admin Dashboard"
            description="Manage platform, oversee user activities, and maintain system integrity"
            buttonText="Access Dashboard"
            onClick={() => handleRoleClick('admin')}
            svg={<svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>}
            gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;