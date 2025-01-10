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
import { Dropdown, Input, message, Button, InputNumber, Menu } from "antd/es";
import type { MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons/lib";

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
  const [activeOption, setActiveOption] = useState<string | null>(null);
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
      settings.cursorAnimation === cursorAnimation;
      settings.fontFamily === fontFamily;
      settings.fontSize === fontSize;
      settings.format === format;
      settings.minimap === minimap;
      settings.smoothTyping === smoothTyping;
      settings.theme === theme;
    } catch (err) {
      message.error(err);
    } finally {
      message.success("Successfully Saved Settings");
    }
  };
  const saveAdvancedSettings = () => {
    try {
      settings.linkedEditing === linkedEditing;
      settings.links === links;
      settings.quickSuggestions === quickSuggestions;
      settings.smoothScrolling === smoothScrolling;
      settings.tabSize === tabSize;
      settings.autoClosingBracket === autoClosingBracket;
      settings.autoIndent === autoIndent;
      settings.wrappingIndent === wrappingIndent;
    } catch (err) {
      message.error(err);
    } finally {
      message.success("Successfully Saved Settings");
    }
  };

  // Define Menu items for Ant Design Dropdown
  const menu = (items: string[], onSelect: (item: string) => void) => (
    <Menu>
      {items.map((item, index) => (
        <Menu.Item key={index} onClick={() => onSelect(item)}>
          {item}
        </Menu.Item>
      ))}
    </Menu>
  );

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
          <InputNumber
            style={{
              width: "50%",
            }}
            placeholder="Font Size"
            value={fontSize}
            onChange={(value) => setFontSize(value)}
          />
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Font Family</span>
          </p>
          <p>Controls the font family.</p>
          <Input
            style={{
              width: "50%",
            }}
            placeholder="Font Family"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
          />
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Smooth Typing</span>
          </p>
          <p>Controls the smooth typing.</p>
          <Dropdown
            overlay={menu(["On", "Off"], (item) =>
              setSmoothTyping(item === "On")
            )}
          >
            <Button
              style={{
                width: "50%",
                fontSize: "14px",
              }}
            >
              {smoothTyping ? "On" : "Off"} <DownOutlined />
            </Button>
          </Dropdown>
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Smooth Cursor Animation</span>
          </p>
          <p>Controls the cursor animation.</p>
          <Dropdown
            overlay={menu(["On", "Off"], (item) =>
              setCursorAnimation(item === "On")
            )}
          >
            <Button
              style={{
                width: "50%",
                fontSize: "14px",
              }}
            >
              {cursorAnimation ? "On" : "Off"} <DownOutlined />
            </Button>
          </Dropdown>
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Minimap</span>
          </p>
          <p>Controls the minimap.</p>
          <Dropdown
            overlay={menu(["On", "Off"], (item) => setMiniMap(item === "On"))}
          >
            <Button
              style={{
                width: "50%",
                fontSize: "14px",
              }}
            >
              {minimap ? "On" : "Off"} <DownOutlined />
            </Button>
          </Dropdown>
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Format</span>
          </p>
          <p>Controls the format.</p>
          <Dropdown
            overlay={menu(["On", "Off"], (item) => setFormat(item === "On"))}
          >
            <Button
              style={{
                width: "50%",
                fontSize: "14px",
              }}
            >
              {format ? "On" : "Off"} <DownOutlined />
            </Button>
          </Dropdown>
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Theme</span>
          </p>
          <p>Controls the theme.</p>
          <Dropdown overlay={menu(["dark", "light"], (item) => setTheme(item))}>
            <Button
              style={{
                width: "50%",
                fontSize: "14px",
              }}
            >
              {theme === "vs-dark" ? "Dark" : "Light"} <DownOutlined />
            </Button>
          </Dropdown>
        </div>
        <Button
          onClick={saveBasicSettings}
          style={{
            width: "50%",
          }}
        >
          Save
        </Button>
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
          <Dropdown
            overlay={menu(["always", "languageDefined", "never"], (item) =>
              setAutoClosingBracket(item)
            )}
          >
            <Button
              style={{
                width: "50%",
                fontSize: "14px",
              }}
            >
              {settings.autoClosingBracket} <DownOutlined />
            </Button>
          </Dropdown>
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Auto Indent</span>
          </p>
          <p>Controls auto indent.</p>
          <Dropdown
            overlay={menu(["advanced", "bracket"], (item) =>
              setAutoIndent(item)
            )}
          >
            <Button
              style={{
                width: "50%",
                fontSize: "14px",
              }}
            >
              {settings.autoIndent} <DownOutlined />
            </Button>
          </Dropdown>
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Smooth Scrolling</span>
          </p>
          <p>Controls the smooth scrolling.</p>
          <Dropdown
            overlay={menu(["On", "Off"], (item) =>
              setsmoothScrolling(item === "On")
            )}
          >
            <Button
              style={{
                width: "50%",
                fontSize: "14px",
              }}
            >
              {settings.smoothTyping ? "On" : "Off"} <DownOutlined />
            </Button>
          </Dropdown>
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Links</span>
          </p>
          <p>Controls the links.</p>
          <Dropdown
            overlay={menu(["On", "Off"], (item) => setlinks(item === "On"))}
          >
            <Button
              style={{
                width: "50%",
                fontSize: "14px",
              }}
            >
              {settings.links ? "On" : "Off"} <DownOutlined />
            </Button>
          </Dropdown>
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Linked Editing</span>
          </p>
          <p>Controls the linkedEditing.</p>
          <Dropdown
            overlay={menu(["On", "Off"], (item) =>
              setlinkedEditing(item === "On")
            )}
          >
            <Button
              style={{
                width: "50%",
                fontSize: "14px",
              }}
            >
              {settings.linkedEditing ? "On" : "Off"} <DownOutlined />
            </Button>
          </Dropdown>
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Quick Suggestions</span>
          </p>
          <p>Controls the quickSuggestions.</p>
          <Dropdown
            overlay={menu(["On", "Off"], (item) =>
              setquickSuggestions(item === "On")
            )}
          >
            <Button
              style={{
                width: "50%",
                fontSize: "14px",
              }}
            >
              {settings.quickSuggestions ? "On" : "Off"} <DownOutlined />
            </Button>
          </Dropdown>
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Wrapping Indent</span>
          </p>
          <p>Controls the wrappingIndent.</p>
          <Dropdown
            overlay={menu(["indent", "none"], (item) =>
              setwrappingIndent(item)
            )}
          >
            <Button
              style={{
                width: "50%",
                fontSize: "14px",
              }}
            >
              {settings.wrappingIndent} <DownOutlined />
            </Button>
          </Dropdown>
        </div>
        <div className="option">
          <p className="option-heading">
            <span>Editor: </span>
            <span>Tab Size</span>
          </p>
          <p>Controls the tabSize.</p>
          <InputNumber
            placeholder="Tab Size"
            defaultValue={settings.tabSize}
            style={{
              width: "50%",
            }}
          />
        </div>
        <Button
          onClick={saveAdvancedSettings}
          style={{
            width: "50%",
          }}
        >
          Save
        </Button>
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
          className={`tree-node ${expandedKeys.includes(node.key) ? "expanded" : ""} 
          ${activeOption === node.key ? "active-option" : ""}`} // Add active class
          onClick={() => {
            setSelectedKey(node.key);
            setActiveOption(node.key); // Set active option on click
            node.children ? toggleExpand(node.key) : null;
          }}
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
