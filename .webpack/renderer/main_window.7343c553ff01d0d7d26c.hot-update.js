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

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst jsx_runtime_1 = __webpack_require__(/*! react/jsx-runtime */ \"./node_modules/react/jsx-runtime.js\");\nconst react_1 = __importStar(__webpack_require__(/*! react */ \"./node_modules/react/index.js\"));\nconst icons_1 = __webpack_require__(/*! @ant-design/icons */ \"./node_modules/@ant-design/icons/es/index.js\");\nconst highlight_js_1 = __importDefault(__webpack_require__(/*! highlight.js */ \"./node_modules/highlight.js/lib/index.js\"));\n__webpack_require__(/*! highlight.js/styles/github.css */ \"./node_modules/highlight.js/styles/github.css\"); // Import a Highlight.js theme (you can choose any theme)\n__webpack_require__(/*! ./style.css */ \"./src/anantchat/style.css\");\nfunction AnantChat() {\n    const [message, setMessage] = (0, react_1.useState)(\"\");\n    const [chatHistory, setChatHistory] = (0, react_1.useState)([]);\n    // Highlight code using highlight.js\n    const highlightCode = (code) => {\n        return highlight_js_1.default.highlightAuto(code).value; // Auto-detect and highlight the code\n    };\n    // Check if message contains code (between triple backticks)\n    const isCode = (text) => text.startsWith(\"```\") && text.endsWith(\"```\");\n    // Render code messages with highlighted code, other messages as regular text\n    const renderMessage = (msg) => {\n        if (isCode(msg.text)) {\n            const code = msg.text.slice(3, -3).trim(); // Remove the surrounding backticks\n            const highlightedCode = highlightCode(code);\n            return ((0, jsx_runtime_1.jsx)(\"pre\", { children: (0, jsx_runtime_1.jsx)(\"code\", { dangerouslySetInnerHTML: { __html: highlightedCode } }, void 0) }, void 0));\n        }\n        return (0, jsx_runtime_1.jsx)(\"p\", { children: msg.text }, void 0); // Regular text\n    };\n    const sendMessage = () => __awaiter(this, void 0, void 0, function* () {\n        if (!message.trim())\n            return;\n        const userMessage = { role: \"user\", text: message };\n        setChatHistory((prevHistory) => [...prevHistory, userMessage]);\n        const response = yield window.electron.sendMessage(message);\n        setChatHistory((prevHistory) => [\n            ...prevHistory,\n            { role: \"bot\", text: response },\n        ]);\n        setMessage(\"\");\n    });\n    return ((0, jsx_runtime_1.jsx)(ReactPerfectScrollbar, { children: (0, jsx_runtime_1.jsxs)(\"div\", Object.assign({ className: \"anantchat-wrapper\" }, { children: [(0, jsx_runtime_1.jsx)(\"h2\", { children: \"AnantChat\" }, void 0), (0, jsx_runtime_1.jsx)(\"div\", Object.assign({ className: \"chat-history\" }, { children: chatHistory.map((msg, index) => ((0, jsx_runtime_1.jsxs)(\"div\", Object.assign({ className: msg.role === \"bot\" ? \"bot\" : \"user\" }, { children: [(0, jsx_runtime_1.jsxs)(\"strong\", { children: [msg.role === \"bot\" ? \"Gemini\" : \"You\", \":\"] }, void 0), renderMessage(msg)] }), index))) }), void 0), (0, jsx_runtime_1.jsxs)(\"div\", Object.assign({ className: \"chat-area\" }, { children: [(0, jsx_runtime_1.jsx)(\"input\", { type: \"text\", value: message, onChange: (e) => setMessage(e.target.value), onKeyPress: (e) => e.key === \"Enter\" && sendMessage(), placeholder: \"Ask AnantChat anything...\" }, void 0), (0, jsx_runtime_1.jsx)(\"button\", Object.assign({ onClick: sendMessage }, { children: (0, jsx_runtime_1.jsx)(icons_1.SendOutlined, {}, void 0) }), void 0)] }), void 0)] }), void 0) }, void 0));\n}\nexports[\"default\"] = AnantChat;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUFDeEQsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUZYLEtBQUssQ0FHVCxDQUNQLENBQUMsWUFDRSxFQUNOLCtDQUFLLFNBQVMsRUFBQyxXQUFXLGlCQUN4QixrQ0FDRSxJQUFJLEVBQUMsTUFBTSxFQUNYLEtBQUssRUFBRSxPQUFPLEVBQ2QsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFDM0MsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLE9BQU8sSUFBSSxXQUFXLEVBQUUsRUFDckQsV0FBVyxFQUFDLDJCQUEyQixXQUN2QyxFQUNGLGlEQUFRLE9BQU8sRUFBRSxXQUFXLGdCQUMxQix1QkFBQyxvQkFBWSxhQUFHLFlBQ1QsYUFDTCxhQUNGLFdBQ2dCLENBQ3pCLENBQUM7QUFDSixDQUFDO0FBcEVELCtCQW9FQyIsInNvdXJjZXMiOlsid2VicGFjazovL2FuYW50YW0vLi9zcmMvYW5hbnRjaGF0L2luZGV4LnRzeD84YWVjIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgUGVyZmVjdFNjcm9sbGJhciBmcm9tIFwicmVhY3QtcGVyZmVjdC1zY3JvbGxiYXJcIjtcbmltcG9ydCB7IFNlbmRPdXRsaW5lZCB9IGZyb20gXCJAYW50LWRlc2lnbi9pY29uc1wiO1xuaW1wb3J0IGhsanMgZnJvbSBcImhpZ2hsaWdodC5qc1wiO1xuaW1wb3J0IFwiaGlnaGxpZ2h0LmpzL3N0eWxlcy9naXRodWIuY3NzXCI7IC8vIEltcG9ydCBhIEhpZ2hsaWdodC5qcyB0aGVtZSAoeW91IGNhbiBjaG9vc2UgYW55IHRoZW1lKVxuaW1wb3J0IFwiLi9zdHlsZS5jc3NcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQW5hbnRDaGF0KCkge1xuICBjb25zdCBbbWVzc2FnZSwgc2V0TWVzc2FnZV0gPSB1c2VTdGF0ZShcIlwiKTtcbiAgY29uc3QgW2NoYXRIaXN0b3J5LCBzZXRDaGF0SGlzdG9yeV0gPSB1c2VTdGF0ZShbXSk7XG5cbiAgLy8gSGlnaGxpZ2h0IGNvZGUgdXNpbmcgaGlnaGxpZ2h0LmpzXG4gIGNvbnN0IGhpZ2hsaWdodENvZGUgPSAoY29kZTogYW55KSA9PiB7XG4gICAgcmV0dXJuIGhsanMuaGlnaGxpZ2h0QXV0byhjb2RlKS52YWx1ZTsgLy8gQXV0by1kZXRlY3QgYW5kIGhpZ2hsaWdodCB0aGUgY29kZVxuICB9O1xuXG4gIC8vIENoZWNrIGlmIG1lc3NhZ2UgY29udGFpbnMgY29kZSAoYmV0d2VlbiB0cmlwbGUgYmFja3RpY2tzKVxuICBjb25zdCBpc0NvZGUgPSAodGV4dDogYW55KSA9PiB0ZXh0LnN0YXJ0c1dpdGgoXCJgYGBcIikgJiYgdGV4dC5lbmRzV2l0aChcImBgYFwiKTtcblxuICAvLyBSZW5kZXIgY29kZSBtZXNzYWdlcyB3aXRoIGhpZ2hsaWdodGVkIGNvZGUsIG90aGVyIG1lc3NhZ2VzIGFzIHJlZ3VsYXIgdGV4dFxuICBjb25zdCByZW5kZXJNZXNzYWdlID0gKG1zZzogYW55KSA9PiB7XG4gICAgaWYgKGlzQ29kZShtc2cudGV4dCkpIHtcbiAgICAgIGNvbnN0IGNvZGUgPSBtc2cudGV4dC5zbGljZSgzLCAtMykudHJpbSgpOyAvLyBSZW1vdmUgdGhlIHN1cnJvdW5kaW5nIGJhY2t0aWNrc1xuICAgICAgY29uc3QgaGlnaGxpZ2h0ZWRDb2RlID0gaGlnaGxpZ2h0Q29kZShjb2RlKTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHByZT5cbiAgICAgICAgICA8Y29kZSBkYW5nZXJvdXNseVNldElubmVySFRNTD17eyBfX2h0bWw6IGhpZ2hsaWdodGVkQ29kZSB9fSAvPlxuICAgICAgICA8L3ByZT5cbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiA8cD57bXNnLnRleHR9PC9wPjsgLy8gUmVndWxhciB0ZXh0XG4gIH07XG5cbiAgY29uc3Qgc2VuZE1lc3NhZ2UgPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKCFtZXNzYWdlLnRyaW0oKSkgcmV0dXJuO1xuXG4gICAgY29uc3QgdXNlck1lc3NhZ2UgPSB7IHJvbGU6IFwidXNlclwiLCB0ZXh0OiBtZXNzYWdlIH07XG4gICAgc2V0Q2hhdEhpc3RvcnkoKHByZXZIaXN0b3J5KSA9PiBbLi4ucHJldkhpc3RvcnksIHVzZXJNZXNzYWdlXSk7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHdpbmRvdy5lbGVjdHJvbi5zZW5kTWVzc2FnZShtZXNzYWdlKTtcbiAgICBzZXRDaGF0SGlzdG9yeSgocHJldkhpc3RvcnkpID0+IFtcbiAgICAgIC4uLnByZXZIaXN0b3J5LFxuICAgICAgeyByb2xlOiBcImJvdFwiLCB0ZXh0OiByZXNwb25zZSB9LFxuICAgIF0pO1xuICAgIHNldE1lc3NhZ2UoXCJcIik7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8UmVhY3RQZXJmZWN0U2Nyb2xsYmFyPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhbmFudGNoYXQtd3JhcHBlclwiPlxuICAgICAgICA8aDI+QW5hbnRDaGF0PC9oMj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGF0LWhpc3RvcnlcIj5cbiAgICAgICAgICB7Y2hhdEhpc3RvcnkubWFwKChtc2csIGluZGV4KSA9PiAoXG4gICAgICAgICAgICA8ZGl2IGtleT17aW5kZXh9IGNsYXNzTmFtZT17bXNnLnJvbGUgPT09IFwiYm90XCIgPyBcImJvdFwiIDogXCJ1c2VyXCJ9PlxuICAgICAgICAgICAgICA8c3Ryb25nPnttc2cucm9sZSA9PT0gXCJib3RcIiA/IFwiR2VtaW5pXCIgOiBcIllvdVwifTo8L3N0cm9uZz5cbiAgICAgICAgICAgICAge3JlbmRlck1lc3NhZ2UobXNnKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGF0LWFyZWFcIj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgIHZhbHVlPXttZXNzYWdlfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRNZXNzYWdlKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgIG9uS2V5UHJlc3M9eyhlKSA9PiBlLmtleSA9PT0gXCJFbnRlclwiICYmIHNlbmRNZXNzYWdlKCl9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkFzayBBbmFudENoYXQgYW55dGhpbmcuLi5cIlxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtzZW5kTWVzc2FnZX0+XG4gICAgICAgICAgICA8U2VuZE91dGxpbmVkIC8+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9SZWFjdFBlcmZlY3RTY3JvbGxiYXI+XG4gICk7XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/anantchat/index.tsx\n");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("bdd4b1f939c1e4038888")
/******/ })();
/******/ 
/******/ }
);