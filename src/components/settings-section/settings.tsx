/*---------------------------------------------------------------------------------------------
 *  Copyright (c) MNovus. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import React, { useEffect, useState } from "react";
import { ReactComponent as AngleLeftIcon } from "../../assets/svg/d-chevron.svg";
import { ReactComponent as AngleRightIcon } from "../../assets/svg/r-chevron.svg";
import DropdownMenu from "../dropdown/dropdown";
import PerfectScrollBar from "react-perfect-scrollbar";
import { useAppSelector } from "../../shared/hooks";
import { message } from "antd/es";

const treeData = [
  {
    title: "Editor",
    key: "editor",
    children: [
      { title: "Basic", key: "editor-basic" },
      { title: "Advanced", key: "editor-advanced" },
    ],
  },
];

const SettingsComponent = React.memo(() => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const settings = useAppSelector((state) => state.main.settings);
  const [theme, setTheme] = useState<string>(settings.theme);
  const [fontSize, setFontSize] = useState<number>(settings.fontSize);
  const [fontFamily, setFontFamily] = useState<string>(settings.fontFamily);
  const [cursorAnimation, setCursorAnimation] = useState<boolean>(
    settings.cursorAnimation
  );
  const [smoothTyping, setSmoothTyping] = useState<boolean>(
    settings.smoothTyping
  );
  const [format, setFormat] = useState<boolean>(settings.format);
  const [minimap, setMiniMap] = useState<boolean>(settings.minimap);
  const [autoClosingBracket, setAutoClosingBracket] = useState<string>(
    settings.autoClosingBracket
  );
  const [autoIndent, setAutoIndent] = useState<string>(settings.autoIndent);
  const [smoothScrolling, setsmoothScrolling] = useState<boolean>(
    settings.smoothScrolling
  );
  const [links, setlinks] = useState<boolean>(settings.links);
  const [linkedEditing, setlinkedEditing] = useState<boolean>(
    settings.linkedEditing
  );
  const [quickSuggestions, setquickSuggestions] = useState<boolean>(
    settings.quickSuggestions
  );
  const [wrappingIndent, setwrappingIndent] = useState<string>(
    settings.wrappingIndent
  );
  const [tabSize, settabSize] = useState<number>(settings.tabSize);

  const saveBasicSettings = () => {
    try {
      settings.cursorAnimation == cursorAnimation;
      settings.fontFamily == fontFamily;
      settings.fontSize == fontSize;
      settings.format == format;
      settings.minimap == minimap;
      settings.smoothTyping == smoothTyping;
      settings.theme == theme;
    } catch (err) {
      message.error(err);
    } finally {
      message.success("Successfully Saved Settings");
    }
  };
  const saveAdvancedSettings = () => {
    try {
      settings.linkedEditing == linkedEditing;
      settings.links == links;
      settings.quickSuggestions == quickSuggestions;
      settings.smoothScrolling == smoothScrolling;
      settings.tabSize == tabSize;
      settings.autoClosingBracket == autoClosingBracket;
      settings.autoIndent == autoIndent;
      settings.wrappingIndent == wrappingIndent;
    } catch (err) {
      message.error(err);
    } finally {
      message.success("Successfully Saved Settings");
    }
  };

  const Editor = () => {
    return (
      <div>
        <EditorBasic />
        <EditorAdvanced />
      </div>
    );
  };

  const EditorBasic = () => {
    return (
      <div className="basicWrapper">
        <h1>Editor Basic</h1>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Font Size</span>
          </p>
          <p>Controls the font size in pixels.</p>
          <input
            type="text"
            className="option-input"
            value={fontSize} // Controlled component
            onChange={
              (e: React.ChangeEvent<HTMLInputElement>) =>
                setFontSize(Number(e.target.value)) // Update on typing
            }
          />
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Font Family</span>
          </p>
          <p>Controls the font family.</p>
          <DropdownMenu
            menuItems={["Monospace", "Arial", "Poppins"]}
            onItemClick={(item) => {
              setFontFamily(item);
            }}
            defaultValue={settings.fontFamily}
          />
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Smooth Typing</span>
          </p>
          <p>Controls the smooth typing.</p>
          <DropdownMenu
            menuItems={["on", "off"]}
            onItemClick={(item) => {
              setSmoothTyping(item === "on" ? true : false);
            }}
            defaultValue={settings.smoothTyping ? "on" : "off"}
          />
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Smooth Cursor Animation</span>
          </p>
          <p>Controls the cursor animation.</p>
          <DropdownMenu
            menuItems={["on", "off"]}
            onItemClick={(item) => {
              setCursorAnimation(item === "on" ? true : false);
            }}
            defaultValue={settings.cursorAnimation ? "on" : "off"}
          />
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Minimap</span>
          </p>
          <p>Controls the minimap.</p>
          <DropdownMenu
            menuItems={["on", "off"]}
            onItemClick={(item) => {
              setMiniMap(item === "on" ? true : false);
            }}
            defaultValue={settings.minimap ? "on" : "off"}
          />
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Format</span>
          </p>
          <p>Controls the format.</p>
          <DropdownMenu
            menuItems={["on", "off"]}
            onItemClick={(item) => {
              setFormat(item === "on" ? true : false);
            }}
            defaultValue={settings.format ? "on" : "off"}
          />
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Theme</span>
          </p>
          <p>Controls the theme.</p>
          <DropdownMenu
            menuItems={["dark", "light"]}
            onItemClick={(item) => {
              setTheme(item);
            }}
            defaultValue={settings.theme === "vs-dark" ? "dark" : "light"}
          />
        </div>
        <button className="save-btn" onClick={saveBasicSettings}>
          Save
        </button>
      </div>
    );
  };

  const EditorAdvanced = () => {
    return (
      <div className="basicWrapper">
        <h1>Editor Advanced</h1>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Auto Closing Bracket</span>
          </p>
          <p>Controls auto closing brackets.</p>
          <DropdownMenu
            menuItems={["always", "languageDefined", "never"]}
            onItemClick={(item) => {
              setAutoClosingBracket(item);
            }}
            defaultValue={settings.autoClosingBracket}
          />
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Auto Indent</span>
          </p>
          <p>Controls auto indent.</p>
          <DropdownMenu
            menuItems={["advanced", "brackets"]}
            onItemClick={(item) => {
              setAutoIndent(item);
            }}
            defaultValue={settings.autoIndent}
          />
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Smooth Scrolling</span>
          </p>
          <p>Controls the smooth scrolling.</p>
          <DropdownMenu
            menuItems={["on", "off"]}
            onItemClick={(item) => {
              setsmoothScrolling(item === "on" ? true : false);
            }}
            defaultValue={settings.smoothScrolling ? "on" : "off"}
          />
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Links</span>
          </p>
          <p>Controls the links.</p>
          <DropdownMenu
            menuItems={["on", "off"]}
            onItemClick={(item) => {
              setlinks(item === "on" ? true : false);
            }}
            defaultValue={settings.links ? "on" : "off"}
          />
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Linked Editing</span>
          </p>
          <p>Controls the linkedEditing.</p>
          <DropdownMenu
            menuItems={["on", "off"]}
            onItemClick={(item) => {
              setlinkedEditing(item === "on" ? true : false);
            }}
            defaultValue={settings.linkedEditing ? "on" : "off"}
          />
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Quick Suggestions</span>
          </p>
          <p>Controls the quickSuggestions.</p>
          <DropdownMenu
            menuItems={["on", "off"]}
            onItemClick={(item) => {
              setquickSuggestions(item === "on" ? true : false);
            }}
            defaultValue={settings.quickSuggestions ? "on" : "off"}
          />
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Wrapping Indent</span>
          </p>
          <p>Controls the wrappingIndent.</p>
          <DropdownMenu
            menuItems={["indent", "none"]}
            onItemClick={(item) => {
              setwrappingIndent(item);
            }}
            defaultValue={settings.wrappingIndent}
          />
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Tab Size</span>
          </p>
          <p>Controls the tabSize.</p>
          <DropdownMenu
            menuItems={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
            onItemClick={(item) => {
              settabSize(Number(item));
            }}
            defaultValue={String(settings.tabSize)}
          />
        </div>
        <button className="save-btn" onClick={saveAdvancedSettings}>
          Save
        </button>
      </div>
    );
  };

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const renderTree = (nodes: any[]) =>
    nodes.map((node) => (
      <div key={node.key} className="tree-item">
        <div
          className={`tree-node ${expandedKeys.includes(node.key) ? "expanded" : ""}`}
          onClick={() =>
            node.children ? toggleExpand(node.key) : setSelectedKey(node.key)
          }
        >
          {node.children && (
            <span
              className={`expand-icon ${expandedKeys.includes(node.key) ? "open" : ""}`}
            >
              {expandedKeys.includes(node.key) ? (
                <AngleLeftIcon />
              ) : (
                <AngleRightIcon />
              )}
            </span>
          )}
          {node.title}
        </div>
        {node.children && expandedKeys.includes(node.key) && (
          <div className="tree-children">{renderTree(node.children)}</div>
        )}
      </div>
    ));

  const renderContent = () => {
    switch (selectedKey) {
      case "editor":
        return <Editor />;
      case "editor-basic":
        return <EditorBasic />;
      case "editor-advanced":
        return <EditorAdvanced />;
      default:
        return <Editor />;
    }
  };

  return (
    <PerfectScrollBar
      style={{
        display: "grid",
        width: "100%",
      }}
    >
      <div className="settings-container">
        <div className="settings-sidebar">{renderTree(treeData)}</div>
        <div className="settings-content">{renderContent()}</div>
      </div>
    </PerfectScrollBar>
  );
});

export default SettingsComponent;
