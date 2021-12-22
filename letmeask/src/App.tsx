import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { AuthContextProvider } from './context/AuthContext'
import { Room } from './pages/Room';

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/rooms/new" component={NewRoom} />
          <Route path="/rooms/:id" component={Room} />
          <Route path="/" exact component={Home} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}
export default App; 