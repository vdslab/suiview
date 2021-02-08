import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
function Header() {
  return <div>musicvis</div>;
}

function Home() {
  return <div>home</div>;
}

function RegistrationPage() {
  return <div>registration</div>;
}

function Footer() {
  return <div>footter</div>;
}

export function App() {
  return (
    <Router>
      <Header />
      <section className="">
        <div className="">
          <div className=""></div>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/registration" exact>
              <RegistrationPage />
            </Route>
          </Switch>
        </div>
      </section>
      <Footer />
    </Router>
  );
}
export default App;
