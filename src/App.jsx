import React, { useState } from 'react';
import { 
  LogIn as LogInIcon, Lock, Mail, User, UserPlus, 
  LayoutDashboard, Settings, LogOut, ArrowRight, TrendingUp, DollarSign, Wallet, Users, BarChart
} from 'lucide-react'; // Menambahkan ikon Dashboard

// -----------------------------------------------------------
// 1. HELPER COMPONENTS
// -----------------------------------------------------------

// Component: Input Field yang konsisten
const InputField = ({ id, type, value, onChange, placeholder, icon: Icon, label }) => (
  <div className="mb-6">
    <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-2">
      {label}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />}
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full bg-black border-b border-gray-600 focus:border-white focus:outline-none py-2 pl-10 pr-4 text-white transition duration-300"
      />
    </div>
  </div>
);

// Component: Kartu Statistik Kecil (Digunakan di Dashboard)
const StatCard = ({ title, value, icon: Icon, colorClass, percentChange }) => (
  <div className="bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col justify-between h-full">
    <div className="flex items-start justify-between mb-2">
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <Icon className={`w-6 h-6 ${colorClass}`} />
    </div>
    <div className="flex flex-col">
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      {percentChange && (
        <div className="flex items-center text-sm">
          <TrendingUp className={`w-4 h-4 mr-1 ${percentChange >= 0 ? 'text-green-400' : 'text-red-400'}`} />
          <span className={percentChange >= 0 ? 'text-green-400' : 'text-red-400'}>{percentChange}%</span>
        </div>
      )}
    </div>
  </div>
);

// Component: Sidebar Navigasi
const Sidebar = ({ userName, onLogout }) => (
  <div className="flex flex-col justify-between w-64 bg-gray-900 text-white p-6 h-full shadow-2xl">
    <div>
      {/* Logo */}
      <div className="flex items-center mb-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-blue-400 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <h1 className="text-xl font-extrabold tracking-wider">CRYPTO FEED</h1>
      </div>

      {/* Navigasi Utama */}
      <nav>
        <div className="flex items-center p-3 rounded-xl bg-blue-600 mb-2">
          <LayoutDashboard className="w-5 h-5 mr-3" />
          <span className="font-semibold">Dashboard</span>
        </div>
        <div className="flex items-center p-3 rounded-xl hover:bg-gray-700 transition cursor-pointer mb-2">
          <BarChart className="w-5 h-5 mr-3" />
          <span>Trade</span>
        </div>
        <div className="flex items-center p-3 rounded-xl hover:bg-gray-700 transition cursor-pointer mb-2">
          <Wallet className="w-5 h-5 mr-3" />
          <span>Wallet</span>
        </div>
        <div className="flex items-center p-3 rounded-xl hover:bg-gray-700 transition cursor-pointer mb-2">
          <Users className="w-5 h-5 mr-3" />
          <span>Profile</span>
        </div>
      </nav>
    </div>

    {/* Pengaturan dan Logout */}
    <div className="mt-8">
      <div className="flex items-center p-3 rounded-xl hover:bg-gray-700 transition cursor-pointer mb-2">
        <Settings className="w-5 h-5 mr-3" />
        <span>Settings</span>
      </div>
      <button 
        onClick={onLogout}
        className="flex items-center p-3 w-full text-left rounded-xl bg-red-600 hover:bg-red-700 transition font-semibold"
      >
        <LogOut className="w-5 h-5 mr-3" />
        Logout
      </button>
    </div>
  </div>
);

// -----------------------------------------------------------
// 2. DASHBOARD COMPONENT (FITUR BARU)
// -----------------------------------------------------------

const Dashboard = ({ userName, onLogout }) => {
  
  // Data dummy untuk News/Berita
  const newsData = [
    { 
      id: 1, 
      title: "Bitcoin Halving Effect: What to Expect Next?", 
      summary: "Experts predict a consolidation phase before a potential Q4 bull run...",
      image: "https://placehold.co/300x160/1E3A8A/FFFFFF?text=Halving+Analysis"
    },
    { 
      id: 2, 
      title: "Ethereum's New Upgrade: Lowering Gas Fees?", 
      summary: "The upcoming Dencun upgrade aims to significantly reduce transaction costs...",
      image: "https://placehold.co/300x160/4F46E5/FFFFFF?text=ETH+Upgrade"
    },
    { 
      id: 3, 
      title: "Top 5 Altcoins to Watch in 2024", 
      summary: "A breakdown of small-cap tokens showing strong developmental activity...",
      image: "https://placehold.co/300x160/065F46/FFFFFF?text=Altcoin+Picks"
    },
    { 
      id: 4, 
      title: "Regulatory Changes in Asia Impacting Crypto Markets", 
      summary: "New licensing requirements are shaking up the crypto exchange scene in Singapore and Hong Kong...",
      image: "https://placehold.co/300x160/9D174D/FFFFFF?text=Regulation+Asia"
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      
      {/* Sidebar Navigasi */}
      <Sidebar userName={userName} onLogout={onLogout} />

      {/* Konten Utama Dashboard */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        
        {/* Header & Greeting */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-400">Dashboard Utama</h1>
          <div className="flex items-center">
            <User className="w-5 h-5 mr-2 text-gray-400" />
            <span className="text-lg font-medium">{userName || 'Pengguna'}</span>
          </div>
        </header>

        {/* Baris Kartu Statistik */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Total Balance" 
            value="$45,890.75" 
            icon={DollarSign} 
            colorClass="text-green-400" 
            percentChange={3.5} 
          />
          <StatCard 
            title="Today's Gain" 
            value="$1,230.12" 
            icon={TrendingUp} 
            colorClass="text-green-400" 
            percentChange={5.1} 
          />
          <StatCard 
            title="Total Transactions" 
            value="345" 
            icon={BarChart} 
            colorClass="text-yellow-400" 
          />
          <StatCard 
            title="Open Trades" 
            value="8" 
            icon={Lock} 
            colorClass="text-red-400" 
            percentChange={-1.2} 
          />
        </section>

        {/* Market Chart Placeholder */}
        <section className="bg-gray-800 p-6 rounded-xl shadow-lg mb-10">
          <h2 className="text-xl font-bold mb-4">Market Overview (BTC/USDT)</h2>
          <div className="h-64 bg-gray-700 flex items-center justify-center rounded-lg text-gray-400">
            [Placeholder untuk Grafik Trading Real-time]
          </div>
        </section>

        {/* News Feed Horizontal (FITUR YANG DIMINTA) */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Crypto News Feed</h2>
          
          {/* Container yang mengizinkan scroll horizontal */}
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {newsData.map(news => (
              <div key={news.id} className="flex-shrink-0 w-80">
                <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
                  {/* Gambar Placeholder */}
                  <img src={news.image} alt={news.title} className="w-full h-40 object-cover" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x160/1E3A8A/FFFFFF?text=News" }}/>
                  
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <h3 className="text-lg font-bold text-blue-300 mb-2">{news.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{news.summary}</p>
                    <a 
                      href="#" 
                      className="text-blue-400 hover:text-blue-300 font-semibold text-sm flex items-center mt-auto"
                    >
                      Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Styling untuk menyembunyikan scrollbar di Chrome/Safari/Edge */}
          <style jsx="true">{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;  /* IE and Edge */
              scrollbar-width: none;  /* Firefox */
            }
          `}</style>
        </section>

      </main>
    </div>
  );
};


// -----------------------------------------------------------
// 3. KOMPONEN UTAMA APLIKASI (APP)
// -----------------------------------------------------------

const App = () => {
  // State untuk mengontrol tampilan: 'login', 'register', atau 'dashboard'
  const [viewMode, setViewMode] = useState('login'); 
  // State baru untuk status otentikasi
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  
  // State untuk form Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // State untuk form Register
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // --- Fungsi Handling ---

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi proses Login: Berhasil setelah 1.5 detik
    setTimeout(() => {
      console.log('Mencoba Login:', { email: loginEmail, password: loginPassword });
      alert(`Login Berhasil! Selamat datang, ${loginEmail.split('@')[0]}!`);
      setIsLoggedIn(true); // Set status login menjadi true
      setViewMode('dashboard'); // Pindah ke dashboard
      setIsLoading(false);
    }, 1500);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    // Validasi sederhana: konfirmasi password
    if (registerPassword !== confirmPassword) {
      alert("Password dan Konfirmasi Password tidak cocok!");
      return;
    }

    setIsLoading(true);

    // Simulasi proses Register: Berhasil setelah 1.5 detik
    setTimeout(() => {
      console.log('Mencoba Register:', { username: registerUsername, email: registerEmail });
      alert(`Akun Berhasil Dibuat! Username: ${registerUsername}. Sekarang silakan Login.`);
      setIsLoading(false);
      // Bersihkan state dan pindah ke mode login
      setRegisterUsername('');
      setRegisterEmail('');
      setRegisterPassword('');
      setConfirmPassword('');
      setLoginEmail(registerEmail); // Pre-fill email di login form
      setViewMode('login'); 
    }, 1500);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setViewMode('login');
    setLoginEmail('');
    setLoginPassword('');
    alert("Anda telah berhasil logout.");
  };

  // --- Rendering Form Berdasarkan Mode ---
  
  const renderAuthForm = () => {
    if (viewMode === 'login') {
      // --- Tampilan Login ---
      return (
        <form onSubmit={handleLogin}>
          <h2 className="text-4xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-gray-400 mb-8">
            Don't have an account? 
            <button 
              type="button" 
              onClick={() => setViewMode('register')} 
              className="text-blue-400 hover:text-blue-300 font-semibold ml-1 focus:outline-none"
            >
              Create a new account
            </button>
          </p>
          
          <InputField 
            id="login-email" 
            type="email" 
            label="Email"
            value={loginEmail} 
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="name@example.com" 
            icon={Mail}
          />
          
          <InputField 
            id="login-password" 
            type="password" 
            label="Password"
            value={loginPassword} 
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="••••••••" 
            icon={Lock}
          />
          
          {/* Tombol Login */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center p-3 rounded-xl font-bold text-lg transition duration-300 mt-4 ${
              isLoading 
                ? 'bg-gray-700 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-lg'
            }`}
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <LogInIcon className="w-5 h-5 mr-2" />
            )}
            {isLoading ? 'Loading...' : 'Login'}
          </button>

          {/* Link Lupa Password */}
          <div className="text-center mt-6 text-sm text-gray-400">
            Forget Password? 
            <a href="#" className="text-white hover:text-blue-400 font-semibold ml-1">
              Click here!
            </a>
          </div>
        </form>
      );
    } else {
      // --- Tampilan Register ---
      return (
        <form onSubmit={handleRegister}>
          <h2 className="text-4xl font-bold mb-2">Welcome!</h2>
          <p className="text-gray-400 mb-8">
            Already have an account? 
            <button 
              type="button" 
              onClick={() => setViewMode('login')} 
              className="text-blue-400 hover:text-blue-300 font-semibold ml-1 focus:outline-none"
            >
              Login
            </button>
          </p>
          
          {/* Input Username */}
          <InputField 
            id="register-username" 
            type="text" 
            label="Username"
            value={registerUsername} 
            onChange={(e) => setRegisterUsername(e.target.value)}
            placeholder="Your chosen username" 
            icon={User}
          />
          
          {/* Input Email */}
          <InputField 
            id="register-email" 
            type="email" 
            label="Email"
            value={registerEmail} 
            onChange={(e) => setRegisterEmail(e.target.value)}
            placeholder="name@example.com" 
            icon={Mail}
          />

          {/* Input Password */}
          <InputField 
            id="register-password" 
            type="password" 
            label="Password"
            value={registerPassword} 
            onChange={(e) => setRegisterPassword(e.target.value)}
            placeholder="••••••••" 
            icon={Lock}
          />

          {/* Input Confirm Password */}
          <InputField 
            id="confirm-password" 
            type="password" 
            label="Confirm Password"
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password" 
            icon={Lock}
          />
          
          {/* Tombol Create Account */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center p-3 rounded-xl font-bold text-lg transition duration-300 mt-4 ${
              isLoading 
                ? 'bg-gray-700 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-lg'
            }`}
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <UserPlus className="w-5 h-5 mr-2" />
            )}
            {isLoading ? 'Loading...' : 'Create Account'}
          </button>
        </form>
      );
    }
  };


  if (isLoggedIn && viewMode === 'dashboard') {
    // Tampilkan Dashboard jika sudah login
    return <Dashboard 
      userName={loginEmail.split('@')[0] || 'User'} 
      onLogout={handleLogout} 
    />;
  }
  
  // Tampilkan Auth Screen jika belum login
  return (
    <div className="min-h-screen flex text-white font-inter bg-black">
      
      {/* Kolom Kiri: Informasi (Dominan di Desktop, disembunyikan di Mobile) */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-[#0A1931] p-10">
        <div className="text-center max-w-md">
          {/* Logo/Nama Proyek */}
          <div className="flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-blue-400 mr-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <h1 className="text-4xl font-extrabold tracking-wider">CRYPTO FEED</h1>
          </div>
          
          {/* Deskripsi */}
          <p className="text-lg text-gray-300 mt-6">
            Pantau pasar kripto & berita terkini, semua di Crypto Feed!
          </p>
        </div>
      </div>

      {/* Kolom Kanan: Form (Login atau Register) */}
      <div className="w-full lg:w-1/2 bg-black flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          {renderAuthForm()}
        </div>
      </div>
    </div>
  );
};

export default App;