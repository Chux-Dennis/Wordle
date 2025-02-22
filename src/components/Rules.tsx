import { Modal } from "antd";

interface IRulesProp {
  open: boolean,
  onClose : ()=> void
}

const Rules = ({ open,onClose }:IRulesProp) => {
  return (
    <>
      <Modal
        open={open}
        footer={null}
        onCancel={onClose}
      >
        <div className="font-Monomakh">
          {/* <h1>Wordle Rules</h1> */}

          <h1 className="text-left font-Monomakh font-bold text-[2rem]">
            How to Play
          </h1>
          <ul>
            <li>
              You have <strong>six tries</strong> to guess the secret
              five-letter word.
            </li>
            <li>
              Each guess must be a <strong>valid five-letter word</strong>.
            </li>
            <li>
              After submitting a guess, the letters change colors to indicate
              how close you are:
            </li>
          </ul>

          <h2 className="font-bold text-left mt-4 text-[1.5rem]">
            Color Meanings
          </h2>
          <div>
            <p>
              <strong>Green:</strong> The letter is correct and in the right
              spot.
            </p>
            <div className="example">
              <div className="box green">T</div>
              <div className="box gray">A</div>
              <div className="box gray">B</div>
              <div className="box gray">L</div>
              <div className="box gray">E</div>
            </div>
          </div>

          <div>
            <p>
              <strong>Yellow:</strong> The letter is in the word but in the
              wrong spot.
            </p>
            <div className="example">
              <div className="box gray">F</div>
              <div className="box yellow">L</div>
              <div className="box gray">O</div>
              <div className="box gray">A</div>
              <div className="box gray">T</div>
            </div>
          </div>

          <div>
            <p>
              <strong>Gray:</strong> The letter is not in the word at all.
            </p>
            <div className="example">
              <div className="box gray">C</div>
              <div className="box gray">H</div>
              <div className="box gray">A</div>
              <div className="box gray">I</div>
              <div className="box gray">R</div>
            </div>
          </div>

          <h2 className="font-bold text-left mt-4 text-[1.5rem]">
            Winning the Game
          </h2>
          <ul>
            <li>If you guess the correct word within six attempts, you win!</li>
            <li>If you fail to guess in six tries, the word is revealed.</li>
          </ul>

          <p
            style={{
              textAlign: "center",
            }}
          >
            <strong>Ready to play?</strong> 🔥
          </p>
        </div>
      </Modal>
    </>
  );
};

export default Rules;
