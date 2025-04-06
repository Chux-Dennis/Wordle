import React, { useRef } from "react";
import { Sheet, SheetRef } from "react-modal-sheet";

interface IComponentProps {
  isOpen: boolean;
  onClose: () => void; 
}

const BottomSheetWithRules = ({ isOpen, onClose }: IComponentProps) => {
  const ref = useRef<SheetRef>(null);

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose} // Use the onClose prop from parent
      snapPoints={[600, 400, 100, 0]}
      initialSnap={1}
      ref={ref}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="p-4 text-white">
            <h2 className="text-xl font-bold mb-4">Game Rules</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="font-semibold">Objective:</span> Guess the
                5-letter word within 6 attempts.
              </li>
              <li>
                <span className="font-semibold">Green:</span> Letter is correct
                and in the right position.
              </li>
              <li>
                <span className="font-semibold">Yellow:</span> Letter is in the
                word but in the wrong position.
              </li>
              <li>
                <span className="font-semibold">Gray:</span> Letter is not in
                the word.
              </li>
              <li>
                <span className="font-semibold">Hints:</span> Use the AI hint
                button once per game for assistance.
              </li>
            </ul>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={onClose} /> {/* Close when tapping backdrop */}
    </Sheet>
  );
};

export default BottomSheetWithRules;
