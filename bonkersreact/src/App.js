import logo from "./logo.svg";
import "./App.css";
import Editor from "./Components/Editor";
import Engine from "./Components/Engine";
function App() {
  return (
    <div className="App">
      {/* <Editor/> */}
      <div className="center" style={{ width: "70%" }}>
        <div width="50%">
          <Engine />
        </div>
      </div>
    </div>
  );
}

export default App;
