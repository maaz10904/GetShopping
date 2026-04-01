import { Navigate, Route, Routes } from 'react-router';
import { useLayoutEffect } from 'react';
import LoginPage from "./pages/LoginPage.jsx";
import { useAuth } from '@clerk/react';
import DashboardPage from "./pages/DashboardPage.jsx"
import ProductsPage from "./pages/ProductsPage.jsx"
import OrdersPage from "./pages/OrdersPage.jsx"
import CustomersPage from "./pages/CustomersPage.jsx"
import DashboardLayout from './Layouts/DashboardLayout.jsx';
import PageLoader from './components/PageLoader.jsx';
import { setAuthTokenGetter } from './libs/axios.js';


function App(){

  const {isSignedIn,isLoaded,getToken} = useAuth()

  useLayoutEffect(() => {
    if (!isLoaded) {
      return;
    }

    setAuthTokenGetter(async () => {
      if (!isSignedIn) return null;
      return getToken();
    });

    return () => {
      setAuthTokenGetter(null);
    };
  }, [getToken, isLoaded, isSignedIn]);

  if(!isLoaded) return (
    <PageLoader/>
  );
  return (<Routes>
      <Route path="/login" element={isSignedIn ? <Navigate to={"/dashboard"}/>: <LoginPage/>}/>
      <Route path='/' element={isSignedIn ? <DashboardLayout/> : <Navigate to={"/login"}/>}>
      <Route index element={<Navigate to={"dashboard"}/>}/>
      <Route path='dashboard' element={<DashboardPage/>}/>
      <Route path='products' element={<ProductsPage/>}/> 
      <Route path='orders' element={<OrdersPage/>}/>   
      <Route path='customers' element={<CustomersPage/>}/>        
      </Route>
    </Routes>
    );
} 

export default App;
