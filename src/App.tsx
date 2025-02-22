import NewGame from './Pages/NewGame';
import { BrowserRouter,Route ,Routes} from 'react-router-dom';
import Onboarding from './Pages/Onboarding'

function App() {
  

  return (
    <>
      {/* <Theme
        // accentColor="crimson"
        grayColor="sand"
        // radius="large"
        scaling="95%"
      >
        <Onboarding />
      </Theme> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/new" element={<NewGame />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
