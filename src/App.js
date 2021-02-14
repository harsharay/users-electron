import { Route, Switch, BrowserRouter, Link } from "react-router-dom"
import Login from "./Components/Login/Login"
import Register from "./Components/Register/Register"
import SecondTab from "./Components/SecondTab/SecondTab"

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Link to="/addUser">First Tab</Link>
        <Switch>
          <Route path="/" component={Login} exact/>
          <Route path="/addUser" component={Register} exact/>
          <Route path="/secondTab" component={SecondTab}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
