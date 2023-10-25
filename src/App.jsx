
import './App.css'
import { SearchProvider } from './context/searchedContext';
import Home from './screens/home';
function App() {
 

  return (
    <>
   <div>
   <SearchProvider>
   <Home/>
   </SearchProvider>
      

   </div>

    </>
  )
}

export default App;

