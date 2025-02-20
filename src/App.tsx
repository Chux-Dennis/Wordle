import { Theme } from '@radix-ui/themes'
import Onboarding from './Pages/Onboarding'

function App() {
  

  return (
    <>
      <Theme
        // accentColor="crimson"
        grayColor="sand"
        // radius="large"
        scaling="95%"
      >
        <Onboarding />
      </Theme>
    </>
  );
}

export default App
