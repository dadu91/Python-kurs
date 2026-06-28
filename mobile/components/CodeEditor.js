import { useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MONO } from "../theme";

const PAIRS = { "(": ")", "[": "]", "{": "}", '"': '"', "'": "'" };

export default function CodeEditor({ value, onChange, placeholder, disabled, style }) {
  const sel = useRef({ start: 0, end: 0 });
  // forcedSelection drives the `selection` prop on TextInput.
  // Cleared only when onSelectionChange confirms native is at that exact position.
  const [forcedSelection, setForcedSelection] = useState(null);

  const moveCursor = (pos) => {
    setForcedSelection({ start: pos, end: pos });
  };

  const handleSelectionChange = (e) => {
    const s = e.nativeEvent.selection;
    sel.current = s;
    // Once native confirms the cursor reached our target, release control
    if (forcedSelection && s.start === forcedSelection.start && s.end === forcedSelection.end) {
      setForcedSelection(null);
    }
  };

  const handleChangeText = (newText) => {
    // Find where text changed by comparing old and new (works on first keypress too)
    let changePos = 0;
    while (
      changePos < value.length &&
      changePos < newText.length &&
      value[changePos] === newText[changePos]
    ) {
      changePos++;
    }

    if (newText.length === value.length + 1) {
      const typed = newText[changePos];

      // Auto-indent on newline: preserve current line indent + extra after ':'
      if (typed === "\n") {
        const beforeCursor = value.slice(0, changePos);
        const currentLine = beforeCursor.split("\n").pop();
        const indent = (currentLine.match(/^(\s*)/) || ["", ""])[1];
        const extraIndent = currentLine.trimEnd().endsWith(":") ? "    " : "";
        const withIndent =
          value.slice(0, changePos) + "\n" + indent + extraIndent + value.slice(changePos);
        onChange(withIndent);
        moveCursor(changePos + 1 + indent.length + extraIndent.length);
        return;
      }

      // Auto-close bracket/quote
      if (PAIRS[typed]) {
        const closed =
          newText.slice(0, changePos + 1) + PAIRS[typed] + newText.slice(changePos + 1);
        onChange(closed);
        moveCursor(changePos + 1);
        return;
      }
    }

    if (newText.length === value.length - 1) {
      const deletedChar = value[changePos];
      const nextChar = newText[changePos];

      // Smart backspace: delete closing bracket when cursor is between a pair
      if (deletedChar && PAIRS[deletedChar] && PAIRS[deletedChar] === nextChar) {
        onChange(newText.slice(0, changePos) + newText.slice(changePos + 1));
        moveCursor(changePos);
        return;
      }

      // Delete full 4-space indent block
      const { start } = sel.current;
      if (start >= 4 && value.slice(start - 4, start) === "    ") {
        onChange(value.slice(0, start - 4) + value.slice(start));
        moveCursor(start - 4);
        return;
      }
    }

    onChange(newText);
  };

  const insertText = (str, cursorOffset) => {
    const { start, end } = sel.current;
    const newVal = value.slice(0, start) + str + value.slice(end);
    onChange(newVal);
    moveCursor(start + (cursorOffset ?? str.length));
  };

  return (
    <View>
      {!disabled && (
        <View style={s.toolbar}>
          <View style={s.row}>
            <Pressable style={s.btn} onPress={() => insertText("()", 1)}>
              <Text style={s.btnText}>()</Text>
            </Pressable>
            <Pressable style={s.btn} onPress={() => insertText("[]", 1)}>
              <Text style={s.btnText}>[]</Text>
            </Pressable>
            <Pressable style={s.btn} onPress={() => insertText("{}", 1)}>
              <Text style={s.btnText}>{"{}"}</Text>
            </Pressable>
          </View>

          <View style={s.row}>
            <Pressable style={[s.btn, s.btnWide]} onPress={() => insertText("    ")}>
              <Text style={s.btnText}>⇥  TAB</Text>
            </Pressable>
            <Pressable style={s.btn} onPress={() => insertText('""', 1)}>
              <Text style={s.btnText}>{`""`}</Text>
            </Pressable>
            <Pressable style={s.btn} onPress={() => insertText("''", 1)}>
              <Text style={s.btnText}>{`''`}</Text>
            </Pressable>
          </View>

        </View>
      )}

      <TextInput
        value={value}
        onChangeText={handleChangeText}
        onSelectionChange={handleSelectionChange}
        selection={forcedSelection ?? undefined}
        placeholder={placeholder}
        placeholderTextColor="#4b5563"
        style={[s.input, !disabled && s.inputBelowToolbar, style, disabled && { opacity: 0.65 }]}
        multiline
        editable={!disabled}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
      />
    </View>
  );
}

const s = StyleSheet.create({
  toolbar: {
    backgroundColor: "#1e293b",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 6,
    gap: 6,
  },
  row: {
    flexDirection: "row",
    gap: 6,
  },
  btn: {
    backgroundColor: "#334155",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 54,
  },
  btnWide: {
    minWidth: 80,
  },
  btnText: {
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: "700",
    fontFamily: MONO,
  },
  input: {
    backgroundColor: "#0f172a",
    color: "#e2e8f0",
    fontFamily: MONO,
    fontSize: 13,
    borderRadius: 12,
    padding: 14,
    minHeight: 180,
    textAlignVertical: "top",
  },
  inputBelowToolbar: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});
