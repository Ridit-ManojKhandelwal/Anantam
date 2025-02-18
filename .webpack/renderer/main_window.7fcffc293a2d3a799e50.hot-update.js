"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdateanantam"]("main_window",{

/***/ "./src/anantchat/index.tsx":
/*!*********************************!*\
  !*** ./src/anantchat/index.tsx ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst jsx_runtime_1 = __webpack_require__(/*! react/jsx-runtime */ \"./node_modules/react/jsx-runtime.js\");\nconst react_1 = __importStar(__webpack_require__(/*! react */ \"./node_modules/react/index.js\"));\nconst react_perfect_scrollbar_1 = __importDefault(__webpack_require__(/*! react-perfect-scrollbar */ \"./node_modules/react-perfect-scrollbar/lib/index.js\"));\nconst icons_1 = __webpack_require__(/*! @ant-design/icons */ \"./node_modules/@ant-design/icons/es/index.js\");\nconst highlight_js_1 = __importDefault(__webpack_require__(/*! highlight.js */ \"./node_modules/highlight.js/lib/index.js\"));\n__webpack_require__(/*! highlight.js/styles/github.css */ \"./node_modules/highlight.js/styles/github.css\"); // Import a Highlight.js theme (you can choose any theme)\n__webpack_require__(/*! ./style.css */ \"./src/anantchat/style.css\");\nfunction AnantChat() {\n    const [message, setMessage] = (0, react_1.useState)(\"\");\n    const [chatHistory, setChatHistory] = (0, react_1.useState)([]);\n    // Highlight code using highlight.js\n    const highlightCode = (code) => {\n        return highlight_js_1.default.highlightAuto(code).value; // Auto-detect and highlight the code\n    };\n    // Check if message contains code (between triple backticks)\n    const isCode = (text) => text.startsWith(\"```\") && text.endsWith(\"```\");\n    // Render code messages with highlighted code, other messages as regular text\n    const renderMessage = (msg) => {\n        if (isCode(msg.text)) {\n            const code = msg.text.slice(3, -3).trim(); // Remove the surrounding backticks\n            const highlightedCode = highlightCode(code);\n            return ((0, jsx_runtime_1.jsx)(\"pre\", Object.assign({ style: {} }, { children: (0, jsx_runtime_1.jsx)(\"code\", { dangerouslySetInnerHTML: { __html: highlightedCode } }, void 0) }), void 0));\n        }\n        return (0, jsx_runtime_1.jsx)(\"p\", { children: msg.text }, void 0); // Regular text\n    };\n    const sendMessage = () => __awaiter(this, void 0, void 0, function* () {\n        if (!message.trim())\n            return;\n        const userMessage = { role: \"user\", text: message };\n        setChatHistory((prevHistory) => [...prevHistory, userMessage]);\n        const response = yield window.electron.sendMessage(message);\n        setChatHistory((prevHistory) => [\n            ...prevHistory,\n            { role: \"bot\", text: response },\n        ]);\n    });\n    return ((0, jsx_runtime_1.jsx)(react_perfect_scrollbar_1.default, { children: (0, jsx_runtime_1.jsxs)(\"div\", Object.assign({ className: \"anantchat-wrapper\" }, { children: [(0, jsx_runtime_1.jsx)(\"h2\", { children: \"AnantChat\" }, void 0), (0, jsx_runtime_1.jsx)(\"div\", Object.assign({ className: \"chat-history\" }, { children: chatHistory.map((msg, index) => ((0, jsx_runtime_1.jsxs)(\"div\", Object.assign({ className: msg.role === \"bot\" ? \"bot\" : \"user\" }, { children: [(0, jsx_runtime_1.jsxs)(\"strong\", { children: [msg.role === \"bot\" ? \"Gemini\" : \"You\", \":\"] }, void 0), renderMessage(msg)] }), index))) }), void 0), (0, jsx_runtime_1.jsxs)(\"div\", Object.assign({ className: \"chat-area\" }, { children: [(0, jsx_runtime_1.jsx)(\"input\", { type: \"text\", value: message, onChange: (e) => setMessage(e.target.value), onKeyPress: (e) => e.key === \"Enter\" && sendMessage(), placeholder: \"Ask AnantChat anything...\" }, void 0), (0, jsx_runtime_1.jsx)(\"button\", Object.assign({ onClick: sendMessage }, { children: (0, jsx_runtime_1.jsx)(icons_1.SendOutlined, {}, void 0) }), void 0)] }), void 0)] }), void 0) }, void 0));\n}\nexports[\"default\"] = AnantChat;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvYW5hbnRjaGF0L2luZGV4LnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsZ0dBQW1EO0FBQ25ELDZKQUF1RDtBQUN2RCw2R0FBaUQ7QUFDakQsNEhBQWdDO0FBQ2hDLDJHQUF3QyxDQUFDLHlEQUF5RDtBQUNsRyxvRUFBcUI7QUFFckIsU0FBd0IsU0FBUztJQUMvQixNQUFNLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxDQUFDLENBQUM7SUFDM0MsTUFBTSxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsR0FBRyxvQkFBUSxFQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRW5ELG9DQUFvQztJQUNwQyxNQUFNLGFBQWEsR0FBRyxDQUFDLElBQVMsRUFBRSxFQUFFO1FBQ2xDLE9BQU8sc0JBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMscUNBQXFDO0lBQzlFLENBQUMsQ0FBQztJQUVGLDREQUE0RDtJQUM1RCxNQUFNLE1BQU0sR0FBRyxDQUFDLElBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRTdFLDZFQUE2RTtJQUM3RSxNQUFNLGFBQWEsR0FBRyxDQUFDLEdBQVEsRUFBRSxFQUFFO1FBQ2pDLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNwQixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLG1DQUFtQztZQUM5RSxNQUFNLGVBQWUsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFNUMsT0FBTyxDQUNMLDhDQUFLLEtBQUssRUFBRSxFQUFFLGdCQUNaLGlDQUFNLHVCQUF1QixFQUFFLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxXQUFJLFlBQzFELENBQ1AsQ0FBQztTQUNIO1FBQ0QsT0FBTyx3Q0FBSSxHQUFHLENBQUMsSUFBSSxXQUFLLENBQUMsQ0FBQyxlQUFlO0lBQzNDLENBQUMsQ0FBQztJQUVGLE1BQU0sV0FBVyxHQUFHLEdBQVMsRUFBRTtRQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTtZQUFFLE9BQU87UUFFNUIsTUFBTSxXQUFXLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQztRQUNwRCxjQUFjLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUUvRCxNQUFNLFFBQVEsR0FBRyxNQUFNLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzVELGNBQWMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUM7WUFDOUIsR0FBRyxXQUFXO1lBQ2QsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7U0FDaEMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxFQUFDO0lBRUYsT0FBTyxDQUNMLHVCQUFDLGlDQUFnQixjQUNmLCtDQUFLLFNBQVMsRUFBQyxtQkFBbUIsaUJBQ2hDLCtEQUFrQixFQUNsQiw4Q0FBSyxTQUFTLEVBQUMsY0FBYyxnQkFDMUIsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQy9CLCtDQUFpQixTQUFTLEVBQUUsR0FBRyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxpQkFDN0QsK0NBQVMsR0FBRyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxpQkFBVyxFQUN4RCxhQUFhLENBQUMsR0FBRyxDQUFDLE1BRlgsS0FBSyxDQUdULENBQ1AsQ0FBQyxZQUNFLEVBQ04sK0NBQUssU0FBUyxFQUFDLFdBQVcsaUJBQ3hCLGtDQUNFLElBQUksRUFBQyxNQUFNLEVBQ1gsS0FBSyxFQUFFLE9BQU8sRUFDZCxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUMzQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssT0FBTyxJQUFJLFdBQVcsRUFBRSxFQUNyRCxXQUFXLEVBQUMsMkJBQTJCLFdBQ3ZDLEVBQ0YsaURBQVEsT0FBTyxFQUFFLFdBQVcsZ0JBQzFCLHVCQUFDLG9CQUFZLGFBQUcsWUFDVCxhQUNMLGFBQ0YsV0FDVyxDQUNwQixDQUFDO0FBQ0osQ0FBQztBQW5FRCwrQkFtRUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hbmFudGFtLy4vc3JjL2FuYW50Y2hhdC9pbmRleC50c3g/OGFlYyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IFBlcmZlY3RTY3JvbGxiYXIgZnJvbSBcInJlYWN0LXBlcmZlY3Qtc2Nyb2xsYmFyXCI7XG5pbXBvcnQgeyBTZW5kT3V0bGluZWQgfSBmcm9tIFwiQGFudC1kZXNpZ24vaWNvbnNcIjtcbmltcG9ydCBobGpzIGZyb20gXCJoaWdobGlnaHQuanNcIjtcbmltcG9ydCBcImhpZ2hsaWdodC5qcy9zdHlsZXMvZ2l0aHViLmNzc1wiOyAvLyBJbXBvcnQgYSBIaWdobGlnaHQuanMgdGhlbWUgKHlvdSBjYW4gY2hvb3NlIGFueSB0aGVtZSlcbmltcG9ydCBcIi4vc3R5bGUuY3NzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFuYW50Q2hhdCgpIHtcbiAgY29uc3QgW21lc3NhZ2UsIHNldE1lc3NhZ2VdID0gdXNlU3RhdGUoXCJcIik7XG4gIGNvbnN0IFtjaGF0SGlzdG9yeSwgc2V0Q2hhdEhpc3RvcnldID0gdXNlU3RhdGUoW10pO1xuXG4gIC8vIEhpZ2hsaWdodCBjb2RlIHVzaW5nIGhpZ2hsaWdodC5qc1xuICBjb25zdCBoaWdobGlnaHRDb2RlID0gKGNvZGU6IGFueSkgPT4ge1xuICAgIHJldHVybiBobGpzLmhpZ2hsaWdodEF1dG8oY29kZSkudmFsdWU7IC8vIEF1dG8tZGV0ZWN0IGFuZCBoaWdobGlnaHQgdGhlIGNvZGVcbiAgfTtcblxuICAvLyBDaGVjayBpZiBtZXNzYWdlIGNvbnRhaW5zIGNvZGUgKGJldHdlZW4gdHJpcGxlIGJhY2t0aWNrcylcbiAgY29uc3QgaXNDb2RlID0gKHRleHQ6IGFueSkgPT4gdGV4dC5zdGFydHNXaXRoKFwiYGBgXCIpICYmIHRleHQuZW5kc1dpdGgoXCJgYGBcIik7XG5cbiAgLy8gUmVuZGVyIGNvZGUgbWVzc2FnZXMgd2l0aCBoaWdobGlnaHRlZCBjb2RlLCBvdGhlciBtZXNzYWdlcyBhcyByZWd1bGFyIHRleHRcbiAgY29uc3QgcmVuZGVyTWVzc2FnZSA9IChtc2c6IGFueSkgPT4ge1xuICAgIGlmIChpc0NvZGUobXNnLnRleHQpKSB7XG4gICAgICBjb25zdCBjb2RlID0gbXNnLnRleHQuc2xpY2UoMywgLTMpLnRyaW0oKTsgLy8gUmVtb3ZlIHRoZSBzdXJyb3VuZGluZyBiYWNrdGlja3NcbiAgICAgIGNvbnN0IGhpZ2hsaWdodGVkQ29kZSA9IGhpZ2hsaWdodENvZGUoY29kZSk7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxwcmUgc3R5bGU9e3t9fT5cbiAgICAgICAgICA8Y29kZSBkYW5nZXJvdXNseVNldElubmVySFRNTD17eyBfX2h0bWw6IGhpZ2hsaWdodGVkQ29kZSB9fSAvPlxuICAgICAgICA8L3ByZT5cbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiA8cD57bXNnLnRleHR9PC9wPjsgLy8gUmVndWxhciB0ZXh0XG4gIH07XG5cbiAgY29uc3Qgc2VuZE1lc3NhZ2UgPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKCFtZXNzYWdlLnRyaW0oKSkgcmV0dXJuO1xuXG4gICAgY29uc3QgdXNlck1lc3NhZ2UgPSB7IHJvbGU6IFwidXNlclwiLCB0ZXh0OiBtZXNzYWdlIH07XG4gICAgc2V0Q2hhdEhpc3RvcnkoKHByZXZIaXN0b3J5KSA9PiBbLi4ucHJldkhpc3RvcnksIHVzZXJNZXNzYWdlXSk7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHdpbmRvdy5lbGVjdHJvbi5zZW5kTWVzc2FnZShtZXNzYWdlKTtcbiAgICBzZXRDaGF0SGlzdG9yeSgocHJldkhpc3RvcnkpID0+IFtcbiAgICAgIC4uLnByZXZIaXN0b3J5LFxuICAgICAgeyByb2xlOiBcImJvdFwiLCB0ZXh0OiByZXNwb25zZSB9LFxuICAgIF0pO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPFBlcmZlY3RTY3JvbGxiYXI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImFuYW50Y2hhdC13cmFwcGVyXCI+XG4gICAgICAgIDxoMj5BbmFudENoYXQ8L2gyPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYXQtaGlzdG9yeVwiPlxuICAgICAgICAgIHtjaGF0SGlzdG9yeS5tYXAoKG1zZywgaW5kZXgpID0+IChcbiAgICAgICAgICAgIDxkaXYga2V5PXtpbmRleH0gY2xhc3NOYW1lPXttc2cucm9sZSA9PT0gXCJib3RcIiA/IFwiYm90XCIgOiBcInVzZXJcIn0+XG4gICAgICAgICAgICAgIDxzdHJvbmc+e21zZy5yb2xlID09PSBcImJvdFwiID8gXCJHZW1pbmlcIiA6IFwiWW91XCJ9Ojwvc3Ryb25nPlxuICAgICAgICAgICAgICB7cmVuZGVyTWVzc2FnZShtc2cpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYXQtYXJlYVwiPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgdmFsdWU9e21lc3NhZ2V9XG4gICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldE1lc3NhZ2UoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgb25LZXlQcmVzcz17KGUpID0+IGUua2V5ID09PSBcIkVudGVyXCIgJiYgc2VuZE1lc3NhZ2UoKX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQXNrIEFuYW50Q2hhdCBhbnl0aGluZy4uLlwiXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3NlbmRNZXNzYWdlfT5cbiAgICAgICAgICAgIDxTZW5kT3V0bGluZWQgLz5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L1BlcmZlY3RTY3JvbGxiYXI+XG4gICk7XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/anantchat/index.tsx\n");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("422fab7d3f488781e5e1")
/******/ })();
/******/ 
/******/ }
);