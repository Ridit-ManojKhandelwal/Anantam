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

/***/ "./src/components/app.tsx":
/*!********************************!*\
  !*** ./src/components/app.tsx ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.App = void 0;\nconst jsx_runtime_1 = __webpack_require__(/*! react/jsx-runtime */ \"./node_modules/react/jsx-runtime.js\");\nconst antd_1 = __webpack_require__(/*! antd */ \"./node_modules/antd/es/index.js\");\nconst footer_1 = __importDefault(__webpack_require__(/*! ./sections/footer */ \"./src/components/sections/footer.tsx\"));\nconst content_1 = __importDefault(__webpack_require__(/*! ./sections/content */ \"./src/components/sections/content.tsx\"));\nconst tab_1 = __webpack_require__(/*! ./bottom-section/tab */ \"./src/components/bottom-section/tab.tsx\");\nconst navigator_1 = __importDefault(__webpack_require__(/*! ./sidebar-sections/navigator */ \"./src/components/sidebar-sections/navigator.tsx\"));\nconst enviornment_1 = __importDefault(__webpack_require__(/*! ./sidebar-sections/enviornment */ \"./src/components/sidebar-sections/enviornment.tsx\"));\nconst hooks_1 = __webpack_require__(/*! ../shared/hooks */ \"./src/shared/hooks.ts\");\nconst App = () => {\n    const sidebarActive = (0, hooks_1.useAppSelector)((state) => state.main.sidebar_active);\n    const terminalActive = (0, hooks_1.useAppSelector)((state) => state.main.terminal_active);\n    return ((0, jsx_runtime_1.jsxs)(\"div\", Object.assign({ className: \"wrapper-component\", style: {\n            height: \"95vh\",\n            display: \"flex\",\n            flexDirection: \"column\",\n            borderTop: \"1px solid var(--border-color)\",\n        } }, { children: [(0, jsx_runtime_1.jsx)(footer_1.default, {}, void 0), (0, jsx_runtime_1.jsx)(\"div\", Object.assign({ className: \"middle-section\", style: { flex: 1, display: \"flex\" } }, { children: (0, jsx_runtime_1.jsxs)(antd_1.Splitter, Object.assign({ style: {\n                        flex: 1,\n                        display: \"flex\",\n                        flexDirection: \"row\",\n                    } }, { children: [sidebarActive ? ((0, jsx_runtime_1.jsx)(antd_1.Splitter.Panel, Object.assign({ defaultSize: \"20%\", min: \"10%\", max: \"95%\" }, { children: (0, jsx_runtime_1.jsxs)(antd_1.Splitter, Object.assign({ layout: \"vertical\", style: {\n                                    height: \"100vh\",\n                                    boxShadow: \"0 0 10px rgba(0, 0, 0, 0.1)\",\n                                    borderRight: \"1px solid var(--border-color)\",\n                                } }, { children: [(0, jsx_runtime_1.jsx)(antd_1.Splitter.Panel, { children: (0, jsx_runtime_1.jsx)(navigator_1.default, {}, void 0) }, void 0), (0, jsx_runtime_1.jsx)(antd_1.Splitter.Panel, { children: (0, jsx_runtime_1.jsx)(enviornment_1.default, {}, void 0) }, void 0)] }), void 0) }), void 0)) : null, (0, jsx_runtime_1.jsx)(antd_1.Splitter.Panel, { children: (0, jsx_runtime_1.jsxs)(antd_1.Splitter, Object.assign({ layout: \"vertical\" }, { children: [(0, jsx_runtime_1.jsx)(antd_1.Splitter.Panel, { children: (0, jsx_runtime_1.jsx)(antd_1.Splitter, Object.assign({ layout: \"horizontal\" }, { children: (0, jsx_runtime_1.jsxs)(antd_1.Splitter.Panel, { children: [(0, jsx_runtime_1.jsx)(content_1.default, {}, void 0), (0, jsx_runtime_1.jsx)(\"div\", { id: \"#editor\" }, void 0)] }, void 0) }), void 0) }, void 0), terminalActive && ((0, jsx_runtime_1.jsx)(antd_1.Splitter.Panel, Object.assign({ defaultSize: \"30%\", min: \"10%\", max: \"50%\", className: \"terminal\" }, { children: (0, jsx_runtime_1.jsx)(tab_1.BottomTabs, {}, void 0) }), void 0))] }), void 0) }, void 0)] }), void 0) }), void 0)] }), void 0));\n};\nexports.App = App;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tcG9uZW50cy9hcHAudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSxrRkFBZ0M7QUFFaEMsdUhBQWdEO0FBQ2hELDBIQUFnRDtBQUVoRCx5R0FBa0Q7QUFFbEQsZ0pBQXFEO0FBQ3JELHNKQUF5RDtBQUl6RCxvRkFBaUQ7QUFFMUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxFQUFFO0lBQ3RCLE1BQU0sYUFBYSxHQUFHLDBCQUFjLEVBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDM0UsTUFBTSxjQUFjLEdBQUcsMEJBQWMsRUFBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUU3RSxPQUFPLENBQ0wsK0NBQ0UsU0FBUyxFQUFDLG1CQUFtQixFQUM3QixLQUFLLEVBQUU7WUFDTCxNQUFNLEVBQUUsTUFBTTtZQUNkLE9BQU8sRUFBRSxNQUFNO1lBQ2YsYUFBYSxFQUFFLFFBQVE7WUFDdkIsU0FBUyxFQUFFLCtCQUErQjtTQUMzQyxpQkFFRCx1QkFBQyxnQkFBZSxhQUFHLEVBQ25CLDhDQUFLLFNBQVMsRUFBQyxnQkFBZ0IsRUFBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsZ0JBQ2pFLHdCQUFDLGVBQVEsa0JBQ1AsS0FBSyxFQUFFO3dCQUNMLElBQUksRUFBRSxDQUFDO3dCQUNQLE9BQU8sRUFBRSxNQUFNO3dCQUNmLGFBQWEsRUFBRSxLQUFLO3FCQUNyQixpQkFFQSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQ2YsdUJBQUMsZUFBUSxDQUFDLEtBQUssa0JBQUMsV0FBVyxFQUFDLEtBQUssRUFBQyxHQUFHLEVBQUMsS0FBSyxFQUFDLEdBQUcsRUFBQyxLQUFLLGdCQUNuRCx3QkFBQyxlQUFRLGtCQUNQLE1BQU0sRUFBQyxVQUFVLEVBQ2pCLEtBQUssRUFBRTtvQ0FDTCxNQUFNLEVBQUUsT0FBTztvQ0FDZixTQUFTLEVBQUUsNkJBQTZCO29DQUN4QyxXQUFXLEVBQUUsK0JBQStCO2lDQUM3QyxpQkFFRCx1QkFBQyxlQUFRLENBQUMsS0FBSyxjQUNiLHVCQUFDLG1CQUFTLGFBQUcsV0FDRSxFQUVqQix1QkFBQyxlQUFRLENBQUMsS0FBSyxjQUNiLHVCQUFDLHFCQUFXLGFBQUcsV0FDQSxhQUNSLFlBQ0ksQ0FDbEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUdSLHVCQUFDLGVBQVEsQ0FBQyxLQUFLLGNBQ2Isd0JBQUMsZUFBUSxrQkFBQyxNQUFNLEVBQUMsVUFBVSxpQkFFekIsdUJBQUMsZUFBUSxDQUFDLEtBQUssY0FDYix1QkFBQyxlQUFRLGtCQUFDLE1BQU0sRUFBQyxZQUFZLGdCQUUzQix3QkFBQyxlQUFRLENBQUMsS0FBSyxlQUNiLHVCQUFDLGlCQUFjLGFBQUcsRUFDbEIsZ0NBQUssRUFBRSxFQUFDLFNBQVMsV0FBTyxZQUNULFlBYVIsV0FDSSxFQUdoQixjQUFjLElBQUksQ0FDakIsdUJBQUMsZUFBUSxDQUFDLEtBQUssa0JBQ2IsV0FBVyxFQUFDLEtBQUssRUFDakIsR0FBRyxFQUFDLEtBQUssRUFDVCxHQUFHLEVBQUMsS0FBSyxFQUNULFNBQVMsRUFBQyxVQUFVLGdCQUVwQix1QkFBQyxnQkFBVSxhQUFHLFlBQ0MsQ0FDbEIsYUFDUSxXQUNJLGFBQ1IsWUFDUCxhQUNGLENBQ1AsQ0FBQztBQUNKLENBQUMsQ0FBQztBQXZGVyxXQUFHLE9BdUZkIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYW5hbnRhbS8uL3NyYy9jb21wb25lbnRzL2FwcC50c3g/ZjEwYiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTcGxpdHRlciB9IGZyb20gXCJhbnRkXCI7XG5cbmltcG9ydCBGb290ZXJDb21wb25lbnQgZnJvbSBcIi4vc2VjdGlvbnMvZm9vdGVyXCI7XG5pbXBvcnQgQ29udGVudFNlY3Rpb24gZnJvbSBcIi4vc2VjdGlvbnMvY29udGVudFwiO1xuXG5pbXBvcnQgeyBCb3R0b21UYWJzIH0gZnJvbSBcIi4vYm90dG9tLXNlY3Rpb24vdGFiXCI7XG5cbmltcG9ydCBOYXZpZ2F0b3IgZnJvbSBcIi4vc2lkZWJhci1zZWN0aW9ucy9uYXZpZ2F0b3JcIjtcbmltcG9ydCBFbnZpb3JubWVudCBmcm9tIFwiLi9zaWRlYmFyLXNlY3Rpb25zL2Vudmlvcm5tZW50XCI7XG5cbmltcG9ydCBBbmFudENoYXQgZnJvbSBcIi4uL2FuYW50Y2hhdFwiO1xuXG5pbXBvcnQgeyB1c2VBcHBTZWxlY3RvciB9IGZyb20gXCIuLi9zaGFyZWQvaG9va3NcIjtcblxuZXhwb3J0IGNvbnN0IEFwcCA9ICgpID0+IHtcbiAgY29uc3Qgc2lkZWJhckFjdGl2ZSA9IHVzZUFwcFNlbGVjdG9yKChzdGF0ZSkgPT4gc3RhdGUubWFpbi5zaWRlYmFyX2FjdGl2ZSk7XG4gIGNvbnN0IHRlcm1pbmFsQWN0aXZlID0gdXNlQXBwU2VsZWN0b3IoKHN0YXRlKSA9PiBzdGF0ZS5tYWluLnRlcm1pbmFsX2FjdGl2ZSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9XCJ3cmFwcGVyLWNvbXBvbmVudFwiXG4gICAgICBzdHlsZT17e1xuICAgICAgICBoZWlnaHQ6IFwiOTV2aFwiLFxuICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcbiAgICAgICAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcbiAgICAgICAgYm9yZGVyVG9wOiBcIjFweCBzb2xpZCB2YXIoLS1ib3JkZXItY29sb3IpXCIsXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxGb290ZXJDb21wb25lbnQgLz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWlkZGxlLXNlY3Rpb25cIiBzdHlsZT17eyBmbGV4OiAxLCBkaXNwbGF5OiBcImZsZXhcIiB9fT5cbiAgICAgICAgPFNwbGl0dGVyXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGZsZXg6IDEsXG4gICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcbiAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246IFwicm93XCIsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHtzaWRlYmFyQWN0aXZlID8gKFxuICAgICAgICAgICAgPFNwbGl0dGVyLlBhbmVsIGRlZmF1bHRTaXplPVwiMjAlXCIgbWluPVwiMTAlXCIgbWF4PVwiOTUlXCI+XG4gICAgICAgICAgICAgIDxTcGxpdHRlclxuICAgICAgICAgICAgICAgIGxheW91dD1cInZlcnRpY2FsXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBcIjEwMHZoXCIsXG4gICAgICAgICAgICAgICAgICBib3hTaGFkb3c6IFwiMCAwIDEwcHggcmdiYSgwLCAwLCAwLCAwLjEpXCIsXG4gICAgICAgICAgICAgICAgICBib3JkZXJSaWdodDogXCIxcHggc29saWQgdmFyKC0tYm9yZGVyLWNvbG9yKVwiLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8U3BsaXR0ZXIuUGFuZWw+XG4gICAgICAgICAgICAgICAgICA8TmF2aWdhdG9yIC8+XG4gICAgICAgICAgICAgICAgPC9TcGxpdHRlci5QYW5lbD5cblxuICAgICAgICAgICAgICAgIDxTcGxpdHRlci5QYW5lbD5cbiAgICAgICAgICAgICAgICAgIDxFbnZpb3JubWVudCAvPlxuICAgICAgICAgICAgICAgIDwvU3BsaXR0ZXIuUGFuZWw+XG4gICAgICAgICAgICAgIDwvU3BsaXR0ZXI+XG4gICAgICAgICAgICA8L1NwbGl0dGVyLlBhbmVsPlxuICAgICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgICAgey8qIE1BSU4gQ09OVEVOVCBBUkVBIFdJVEggUklHSFQgUEFORUwgKi99XG4gICAgICAgICAgPFNwbGl0dGVyLlBhbmVsPlxuICAgICAgICAgICAgPFNwbGl0dGVyIGxheW91dD1cInZlcnRpY2FsXCI+XG4gICAgICAgICAgICAgIHsvKiBDb250ZW50ICsgUmlnaHQgU2lkZSBQYW5lbCAqL31cbiAgICAgICAgICAgICAgPFNwbGl0dGVyLlBhbmVsPlxuICAgICAgICAgICAgICAgIDxTcGxpdHRlciBsYXlvdXQ9XCJob3Jpem9udGFsXCI+XG4gICAgICAgICAgICAgICAgICB7LyogTGVmdCBTaWRlIC0gQ29udGVudCAqL31cbiAgICAgICAgICAgICAgICAgIDxTcGxpdHRlci5QYW5lbD5cbiAgICAgICAgICAgICAgICAgICAgPENvbnRlbnRTZWN0aW9uIC8+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCIjZWRpdG9yXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L1NwbGl0dGVyLlBhbmVsPlxuXG4gICAgICAgICAgICAgICAgICB7LyogUmlnaHQgU2lkZSAtIE5ldyBQYW5lbCAqL31cbiAgICAgICAgICAgICAgICAgIHsvKiA8U3BsaXR0ZXIuUGFuZWxcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFNpemU9XCIyNSVcIlxuICAgICAgICAgICAgICAgICAgICBtaW49XCIxMCVcIlxuICAgICAgICAgICAgICAgICAgICBtYXg9XCI1MCVcIlxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgIGJvcmRlckxlZnQ6IFwiMXB4IHNvbGlkIHZhcigtLWJvcmRlci1jb2xvcilcIixcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPEFuYW50Q2hhdCAvPlxuICAgICAgICAgICAgICAgICAgPC9TcGxpdHRlci5QYW5lbD4gKi99XG4gICAgICAgICAgICAgICAgPC9TcGxpdHRlcj5cbiAgICAgICAgICAgICAgPC9TcGxpdHRlci5QYW5lbD5cblxuICAgICAgICAgICAgICB7LyogVGVybWluYWwgYXQgdGhlIEJvdHRvbSAqL31cbiAgICAgICAgICAgICAge3Rlcm1pbmFsQWN0aXZlICYmIChcbiAgICAgICAgICAgICAgICA8U3BsaXR0ZXIuUGFuZWxcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHRTaXplPVwiMzAlXCJcbiAgICAgICAgICAgICAgICAgIG1pbj1cIjEwJVwiXG4gICAgICAgICAgICAgICAgICBtYXg9XCI1MCVcIlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGVybWluYWxcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxCb3R0b21UYWJzIC8+XG4gICAgICAgICAgICAgICAgPC9TcGxpdHRlci5QYW5lbD5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvU3BsaXR0ZXI+XG4gICAgICAgICAgPC9TcGxpdHRlci5QYW5lbD5cbiAgICAgICAgPC9TcGxpdHRlcj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/components/app.tsx\n");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("4bc8b42ae36c5f2f4049")
/******/ })();
/******/ 
/******/ }
);