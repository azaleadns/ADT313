import logo from './logo.svg';
import './App.css';
import User from './components/user/user';
import Section from './components/user/section';
import Description from './components/user/Description';

function App() {
  return (
    <div className="App">
      <User/>
      <Section/>
      <Description/>
    </div>
  );
}

export default App;
