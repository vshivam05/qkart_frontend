import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <div className="App">
      {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
      {/* <Register /> */}

      <Router>
        <Switch>
          <Route path="/register"  component={Register} />
          <Route path="/login" component={Login} />
          <Route exact path="/" component={Products} />

        </Switch>
      </Router>
    </div>
  );
}

export default App;
