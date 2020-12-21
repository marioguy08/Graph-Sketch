import logo from './logo.svg';
import './App.css';
import MainCanvas from './components/canvas.js'
import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';
function App() {
  
  return (
    <div className="App">
      <MainCanvas></MainCanvas>
      
    </div>
  );
}

export default App;
