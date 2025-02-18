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

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst jsx_runtime_1 = __webpack_require__(/*! react/jsx-runtime */ \"./node_modules/react/jsx-runtime.js\");\nconst react_1 = __importStar(__webpack_require__(/*! react */ \"./node_modules/react/index.js\"));\nconst react_perfect_scrollbar_1 = __importDefault(__webpack_require__(/*! react-perfect-scrollbar */ \"./node_modules/react-perfect-scrollbar/lib/index.js\"));\nconst icons_1 = __webpack_require__(/*! @ant-design/icons */ \"./node_modules/@ant-design/icons/es/index.js\");\nconst highlight_js_1 = __importDefault(__webpack_require__(/*! highlight.js */ \"./node_modules/highlight.js/lib/index.js\"));\n__webpack_require__(/*! highlight.js/styles/github.css */ \"./node_modules/highlight.js/styles/github.css\"); // Import a Highlight.js theme (you can choose any theme)\n__webpack_require__(/*! ./style.css */ \"./src/anantchat/style.css\");\nfunction AnantChat() {\n    const [message, setMessage] = (0, react_1.useState)(\"\");\n    const [chatHistory, setChatHistory] = (0, react_1.useState)([]);\n    // Highlight code using highlight.js\n    const highlightCode = (code) => {\n        return highlight_js_1.default.highlightAuto(code).value; // Auto-detect and highlight the code\n    };\n    // Check if message contains code (between triple backticks)\n    const isCode = (text) => text.startsWith(\"```\") && text.endsWith(\"```\");\n    // Render code messages with highlighted code, other messages as regular text\n    const renderMessage = (msg) => {\n        if (isCode(msg.text)) {\n            const code = msg.text.slice(3, -3).trim(); // Remove the surrounding backticks\n            const highlightedCode = highlightCode(code);\n            return ((0, jsx_runtime_1.jsx)(\"pre\", { children: (0, jsx_runtime_1.jsx)(\"code\", { dangerouslySetInnerHTML: { __html: highlightedCode } }, void 0) }, void 0));\n        }\n        return (0, jsx_runtime_1.jsx)(\"p\", { children: msg.text }, void 0); // Regular text\n    };\n    const sendMessage = () => __awaiter(this, void 0, void 0, function* () {\n        if (!message.trim())\n            return;\n        const userMessage = { role: \"user\", text: message };\n        setChatHistory((prevHistory) => [...prevHistory, userMessage]);\n        const response = yield window.electron.sendMessage(message);\n        setChatHistory((prevHistory) => [\n            ...prevHistory,\n            { role: \"bot\", text: response },\n        ]);\n        setMessage(\"\");\n    });\n    return ((0, jsx_runtime_1.jsx)(react_perfect_scrollbar_1.default, { children: (0, jsx_runtime_1.jsxs)(\"div\", Object.assign({ className: \"anantchat-wrapper\" }, { children: [(0, jsx_runtime_1.jsx)(\"h2\", { children: \"AnantChat\" }, void 0), (0, jsx_runtime_1.jsx)(\"div\", Object.assign({ className: \"chat-history\" }, { children: chatHistory.map((msg, index) => ((0, jsx_runtime_1.jsxs)(\"div\", Object.assign({ className: msg.role === \"bot\" ? \"bot\" : \"user\" }, { children: [(0, jsx_runtime_1.jsxs)(\"strong\", { children: [msg.role === \"bot\" ? \"Gemini\" : \"You\", \":\"] }, void 0), renderMessage(msg)] }), index))) }), void 0), (0, jsx_runtime_1.jsxs)(\"div\", Object.assign({ className: \"chat-area\" }, { children: [(0, jsx_runtime_1.jsx)(\"input\", { type: \"text\", value: message, onChange: (e) => setMessage(e.target.value), onKeyPress: (e) => e.key === \"Enter\" && sendMessage(), placeholder: \"Ask AnantChat anything...\" }, void 0), (0, jsx_runtime_1.jsx)(\"button\", Object.assign({ onClick: sendMessage }, { children: (0, jsx_runtime_1.jsx)(icons_1.SendOutlined, {}, void 0) }), void 0)] }), void 0)] }), void 0) }, void 0));\n}\nexports[\"default\"] = AnantChat;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEtBQUssaUJBQVcsRUFDeEQsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUZYLEtBQUssQ0FHVCxDQUNQLENBQUMsWUFDRSxFQUNOLCtDQUFLLFNBQVMsRUFBQyxXQUFXLGlCQUN4QixrQ0FDRSxJQUFJLEVBQUMsTUFBTSxFQUNYLEtBQUssRUFBRSxPQUFPLEVBQ2QsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFDM0MsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLE9BQU8sSUFBSSxXQUFXLEVBQUUsRUFDckQsV0FBVyxFQUFDLDJCQUEyQixXQUN2QyxFQUNGLGlEQUFRLE9BQU8sRUFBRSxXQUFXLGdCQUMxQix1QkFBQyxvQkFBWSxhQUFHLFlBQ1QsYUFDTCxhQUNGLFdBQ1csQ0FDcEIsQ0FBQztBQUNKLENBQUM7QUFwRUQsK0JBb0VDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYW5hbnRhbS8uL3NyYy9hbmFudGNoYXQvaW5kZXgudHN4PzhhZWMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBQZXJmZWN0U2Nyb2xsYmFyIGZyb20gXCJyZWFjdC1wZXJmZWN0LXNjcm9sbGJhclwiO1xuaW1wb3J0IHsgU2VuZE91dGxpbmVkIH0gZnJvbSBcIkBhbnQtZGVzaWduL2ljb25zXCI7XG5pbXBvcnQgaGxqcyBmcm9tIFwiaGlnaGxpZ2h0LmpzXCI7XG5pbXBvcnQgXCJoaWdobGlnaHQuanMvc3R5bGVzL2dpdGh1Yi5jc3NcIjsgLy8gSW1wb3J0IGEgSGlnaGxpZ2h0LmpzIHRoZW1lICh5b3UgY2FuIGNob29zZSBhbnkgdGhlbWUpXG5pbXBvcnQgXCIuL3N0eWxlLmNzc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBbmFudENoYXQoKSB7XG4gIGNvbnN0IFttZXNzYWdlLCBzZXRNZXNzYWdlXSA9IHVzZVN0YXRlKFwiXCIpO1xuICBjb25zdCBbY2hhdEhpc3RvcnksIHNldENoYXRIaXN0b3J5XSA9IHVzZVN0YXRlKFtdKTtcblxuICAvLyBIaWdobGlnaHQgY29kZSB1c2luZyBoaWdobGlnaHQuanNcbiAgY29uc3QgaGlnaGxpZ2h0Q29kZSA9IChjb2RlOiBhbnkpID0+IHtcbiAgICByZXR1cm4gaGxqcy5oaWdobGlnaHRBdXRvKGNvZGUpLnZhbHVlOyAvLyBBdXRvLWRldGVjdCBhbmQgaGlnaGxpZ2h0IHRoZSBjb2RlXG4gIH07XG5cbiAgLy8gQ2hlY2sgaWYgbWVzc2FnZSBjb250YWlucyBjb2RlIChiZXR3ZWVuIHRyaXBsZSBiYWNrdGlja3MpXG4gIGNvbnN0IGlzQ29kZSA9ICh0ZXh0OiBhbnkpID0+IHRleHQuc3RhcnRzV2l0aChcImBgYFwiKSAmJiB0ZXh0LmVuZHNXaXRoKFwiYGBgXCIpO1xuXG4gIC8vIFJlbmRlciBjb2RlIG1lc3NhZ2VzIHdpdGggaGlnaGxpZ2h0ZWQgY29kZSwgb3RoZXIgbWVzc2FnZXMgYXMgcmVndWxhciB0ZXh0XG4gIGNvbnN0IHJlbmRlck1lc3NhZ2UgPSAobXNnOiBhbnkpID0+IHtcbiAgICBpZiAoaXNDb2RlKG1zZy50ZXh0KSkge1xuICAgICAgY29uc3QgY29kZSA9IG1zZy50ZXh0LnNsaWNlKDMsIC0zKS50cmltKCk7IC8vIFJlbW92ZSB0aGUgc3Vycm91bmRpbmcgYmFja3RpY2tzXG4gICAgICBjb25zdCBoaWdobGlnaHRlZENvZGUgPSBoaWdobGlnaHRDb2RlKGNvZGUpO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8cHJlPlxuICAgICAgICAgIDxjb2RlIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogaGlnaGxpZ2h0ZWRDb2RlIH19IC8+XG4gICAgICAgIDwvcHJlPlxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIDxwPnttc2cudGV4dH08L3A+OyAvLyBSZWd1bGFyIHRleHRcbiAgfTtcblxuICBjb25zdCBzZW5kTWVzc2FnZSA9IGFzeW5jICgpID0+IHtcbiAgICBpZiAoIW1lc3NhZ2UudHJpbSgpKSByZXR1cm47XG5cbiAgICBjb25zdCB1c2VyTWVzc2FnZSA9IHsgcm9sZTogXCJ1c2VyXCIsIHRleHQ6IG1lc3NhZ2UgfTtcbiAgICBzZXRDaGF0SGlzdG9yeSgocHJldkhpc3RvcnkpID0+IFsuLi5wcmV2SGlzdG9yeSwgdXNlck1lc3NhZ2VdKTtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgd2luZG93LmVsZWN0cm9uLnNlbmRNZXNzYWdlKG1lc3NhZ2UpO1xuICAgIHNldENoYXRIaXN0b3J5KChwcmV2SGlzdG9yeSkgPT4gW1xuICAgICAgLi4ucHJldkhpc3RvcnksXG4gICAgICB7IHJvbGU6IFwiYm90XCIsIHRleHQ6IHJlc3BvbnNlIH0sXG4gICAgXSk7XG4gICAgc2V0TWVzc2FnZShcIlwiKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxQZXJmZWN0U2Nyb2xsYmFyPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhbmFudGNoYXQtd3JhcHBlclwiPlxuICAgICAgICA8aDI+QW5hbnRDaGF0PC9oMj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGF0LWhpc3RvcnlcIj5cbiAgICAgICAgICB7Y2hhdEhpc3RvcnkubWFwKChtc2csIGluZGV4KSA9PiAoXG4gICAgICAgICAgICA8ZGl2IGtleT17aW5kZXh9IGNsYXNzTmFtZT17bXNnLnJvbGUgPT09IFwiYm90XCIgPyBcImJvdFwiIDogXCJ1c2VyXCJ9PlxuICAgICAgICAgICAgICA8c3Ryb25nPnttc2cucm9sZSA9PT0gXCJib3RcIiA/IFwiR2VtaW5pXCIgOiBcIllvdVwifTo8L3N0cm9uZz5cbiAgICAgICAgICAgICAge3JlbmRlck1lc3NhZ2UobXNnKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGF0LWFyZWFcIj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgIHZhbHVlPXttZXNzYWdlfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRNZXNzYWdlKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgIG9uS2V5UHJlc3M9eyhlKSA9PiBlLmtleSA9PT0gXCJFbnRlclwiICYmIHNlbmRNZXNzYWdlKCl9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkFzayBBbmFudENoYXQgYW55dGhpbmcuLi5cIlxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtzZW5kTWVzc2FnZX0+XG4gICAgICAgICAgICA8U2VuZE91dGxpbmVkIC8+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9QZXJmZWN0U2Nyb2xsYmFyPlxuICApO1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/anantchat/index.tsx\n");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("995074ddb7f2f4a00929")
/******/ })();
/******/ 
/******/ }
);