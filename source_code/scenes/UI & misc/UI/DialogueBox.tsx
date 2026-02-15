import React, { useEffect, useState } from "react";
import "../../../styles/dialogue-react-2.css";

export type Choice = {
  label: string;
  callback: () => void;
};

type DialogueProps = {
  visible: boolean;
  speaker: string;
  text: string;
  choices?: Choice[];
  autoHide?: boolean;
  hideDelay?: number;
  onClose?: () => void;
};

const DialogueBox: React.FC<DialogueProps> = ({
  visible,
  speaker,
  text,
  choices,
  autoHide = true,
  hideDelay = 5000,
  onClose,
}) => {
  /* Auto hide logic */
  useEffect(() => {
    if (!visible || !autoHide) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, hideDelay);

    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="dialog-box show">
      <div className="dialog-content">
        {/* Speaker */}
        <div className="dialog-speaker">{speaker}</div>

        {/* Decorations */}
        <div className="v1_2" />
        <div className="v1_3" />

        {/* Text */}
        <span className="v1_4">{text}</span>

        {/* Choices */}
        {choices && (
          <div className="dialog-choices">
            {choices.map((c, i) => (
              <button
                key={i}
                className="choice-btn"
                onClick={() => {
                  c.callback();
                  onClose?.();
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DialogueBox;
