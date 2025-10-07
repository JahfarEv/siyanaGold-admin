// // components/Login.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Eye, EyeOff, Gem, Sparkles, Lock, User } from 'lucide-react';
// import Swal from 'sweetalert2';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Default admin credentials (in real app, this would be from backend)
//   const adminCredentials = {
//     username: 'admin',
//     password: 'admin123'
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Simulate API call delay
//     setTimeout(() => {
//       if (formData.username === adminCredentials.username && 
//           formData.password === adminCredentials.password) {
        
//         // Successful login
//         Swal.fire({
//           title: 'Welcome Back!',
//           text: 'Successfully logged in to Siyana Gold Admin Panel',
//           icon: 'success',
//           confirmButtonColor: '#10b981',
//           background: '#fff',
//           color: '#333',
//           iconColor: '#10b981',
//           customClass: {
//             popup: 'rounded-2xl',
//             confirmButton: 'rounded-xl'
//           }
//         }).then(() => {
//           // Store login state (in real app, you'd store tokens)
//           localStorage.setItem('isLoggedIn', 'true');
//           localStorage.setItem('adminUser', formData.username);
          
//           // Redirect to dashboard
//           navigate('/');
//         });
//       } else {
//         // Failed login
//         Swal.fire({
//           title: 'Login Failed',
//           text: 'Invalid username or password. Please try again.',
//           icon: 'error',
//           confirmButtonColor: '#ef4444',
//           background: '#fff',
//           color: '#333',
//           iconColor: '#ef4444',
//           customClass: {
//             popup: 'rounded-2xl',
//             confirmButton: 'rounded-xl'
//           }
//         });
//       }
//       setLoading(false);
//     }, 1500);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-50 flex items-center justify-center p-4">
//       <div className="max-w-md w-full">
//         {/* Login Card */}
//         <div className="bg-white rounded-2xl shadow-2xl border border-amber-100 overflow-hidden">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-amber-500 to-rose-500 p-8 text-center">
//             <div className="flex items-center justify-center space-x-3 mb-4">
//               <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
//                 <Sparkles className="h-8 w-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-white">Siyana Gold</h1>
//                 <p className="text-amber-100 mt-1">Jewelry Admin Panel</p>
//               </div>
//             </div>
//           </div>

//           {/* Login Form */}
//           <div className="p-8">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Username Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Username
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <User className="h-5 w-5 text-amber-500" />
//                   </div>
//                   <input
//                     type="text"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleChange}
//                     required
//                     className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200"
//                     placeholder="Enter your username"
//                   />
//                 </div>
//               </div>

//               {/* Password Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock className="h-5 w-5 text-amber-500" />
//                   </div>
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                     className="w-full pl-10 pr-12 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200"
//                     placeholder="Enter your password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-amber-400 hover:text-amber-600 transition-colors"
//                   >
//                     {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                   </button>
//                 </div>
//               </div>

//               {/* Login Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white py-4 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 font-semibold text-lg"
//               >
//                 {loading ? (
//                   <div className="flex items-center">
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                     Signing In...
//                   </div>
//                 ) : (
//                   'Sign In'
//                 )}
//               </button>
//             </form>

//             {/* Demo Credentials */}
//             <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
//               <h3 className="text-sm font-semibold text-amber-800 mb-2 flex items-center">
//                 <Gem className="h-4 w-4 mr-2" />
//                 Demo Credentials
//               </h3>
//               <div className="text-xs text-amber-700 space-y-1">
//                 <p><strong>Username:</strong> admin</p>
//                 <p><strong>Password:</strong> admin123</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="text-center mt-6">
//           <p className="text-sm text-gray-600">
//             © 2024 Siyana Gold. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;



// components/Login.js
import React, { useState } from 'react';
import { Eye, EyeOff, Gem, Sparkles, Lock, User } from 'lucide-react';
import Swal from 'sweetalert2';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Default admin credentials
  const adminCredentials = {
    username: 'admin',
    password: 'admin123'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      if (formData.username === adminCredentials.username && 
          formData.password === adminCredentials.password) {
        
        // Store login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('adminUser', formData.username);
        
        // Show success message
        Swal.fire({
          title: 'Welcome Back!',
          text: 'Successfully logged in to Siyana Gold Admin Panel',
          icon: 'success',
          confirmButtonColor: '#10b981',
          background: '#fff',
          color: '#333',
          iconColor: '#10b981',
          customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'rounded-xl'
          }
        }).then(() => {
          // Force redirect to dashboard
          window.location.href = '/';
        });
        
      } else {
        // Failed login
        Swal.fire({
          title: 'Login Failed',
          text: 'Invalid username or password. Please try again.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          background: '#fff',
          color: '#333',
          iconColor: '#ef4444',
          customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'rounded-xl'
          }
        });
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-amber-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-rose-500 p-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Siyana Gold</h1>
                <p className="text-amber-100 mt-1">Jewelry Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-amber-500" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-amber-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-amber-400 hover:text-amber-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white py-4 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 font-semibold text-lg"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <h3 className="text-sm font-semibold text-amber-800 mb-2 flex items-center">
                <Gem className="h-4 w-4 mr-2" />
                Demo Credentials
              </h3>
              <div className="text-xs text-amber-700 space-y-1">
                <p><strong>Username:</strong> admin</p>
                <p><strong>Password:</strong> admin123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            © 2024 Siyana Gold. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;