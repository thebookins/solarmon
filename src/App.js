import { Container } from "react-bootstrap";
import './App.css';
import Chart from './Chart'
import useGoogleCharts from './useGoogleCharts';

function App() {
  const google = useGoogleCharts();

  return (
    <>
      <Container className="mt-3">
        <h1>Solar</h1>
        <Chart google={google}/>
      </Container>
    </>
  );
}

export default App;
