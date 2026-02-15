/**
 * 
 * Dialog React API Implementation
 * 
 */

import { useState } from "react";
import { Choice } from "../scenes/UI & misc/UI/DialogueBox";

export function useDialog() {
  const [visible, setVisible] = useState(false);
  const [speaker, setSpeaker] = useState("");
  const [text, setText] = useState("");
  const [choices, setChoices] = useState<Choice[] | undefined>();

  function showDialog(speaker: string, text: string) {
    setSpeaker(speaker);
    setText(text);
    setChoices(undefined);
    setVisible(true);
  }

  function showDecisionDialog(
    speaker: string,
    text: string,
    choices: Choice[]
  ) {
    setSpeaker(speaker);
    setText(text);
    setChoices(choices);
    setVisible(true);
  }

  function hideDialog() {
    setVisible(false);
  }

  return {
    visible,
    speaker,
    text,
    choices,
    showDialog,
    showDecisionDialog,
    hideDialog,
  };
}
