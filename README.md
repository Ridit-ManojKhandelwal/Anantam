# Anantam - Anything is Possible

Anantam is a custom-built, next-generation Integrated Development Environment (IDE) designed to empower developers with interactive and real-time capabilities. The name "Anantam" translates to *anything is possible*, embodying the limitless potential of this tool for developers and data enthusiasts.

Anantam focuses on providing a modern, data-driven development experience, with groundbreaking features like an intelligent **Custom Chart System** and a **Global Variable System**. Currently, it supports **Python** development, with plans to expand further.

> **Status:** In Development  
> **Beta Version Release:** ~1 Month

---

## Key Features

### 1. Custom Chart System
Anantam redefines how developers interact with data visualizations. The **Custom Chart System** automatically processes user-created charts and data to produce modern, interactive, and highly touchable visualizations.

#### How It Works:
- Users create a chart or define their data in Python code.
- Anantam processes the data and generates **real-time, interactive charts**.
- Charts are modern, intuitive, and optimized for both mouse and touch interactions.
- Supports automatic chart generation based on Python data structures like Pandas DataFrames, lists, and dictionaries.
- Allows easy **customization** of chart aesthetics, such as colors, labels, and interactivity settings.
- Offers quick export options to **image formats** (PNG, SVG) or **JSON** for data sharing.
- **Infx Custom Language Support:** Create dozens of charts easily using Anantam's own custom language, **Infx**.
- **Chart Creation in Infx:** Code for creating charts in `.infx` files will be available in a future release.

#### Example (Python):
```python
import pandas as pd

data = {
    'Year': [2020, 2021, 2022],
    'Revenue': [100, 150, 200]
}
df = pd.DataFrame(data)
# Chart system will detect this DataFrame and visualize it interactively
```
```

---

### 2. Global Variable System
The **Global Variable System** allows users to manage variables across the entire IDE workspace effortlessly.

#### Features:
- Save variables linked to **Excel, CSV, or JSON** file paths.
- Anantam creates an internal copy of the file, ensuring data consistency.
- The saved variable can be used across **any file** within the IDE without reloading or redefining it.
- Exporting variables automatically generates ready-to-use code for reuse in other IDEs.
- Designed for seamless integration with Pandas for DataFrame manipulation.
- Enables quick access to frequently used datasets and variables.
- Supports **version control** for saved variables, keeping track of changes over time.
- Import variables manually using **Infx custom syntax**.

#### Example Workflow:
1. Save and import a file as a global variable manually:
   ```infx
   excel_df var_name = excel_data("path/to/file.xlsx")
   csv_df var_name = csv_data("path/to/file.csv")
   json_df var_name = json_data("path/to/file.json")
   ```
2. Use it in Python code:
   ```python
   import pandas as pd
   df = pd.read_csv(var_name)
   ```
3. Export to another IDE:
   - Anantam generates code to recreate the variable:
     ```python
     import pandas as pd
     data = pd.read_csv("path/to/file.csv")
     ```

---

## Upcoming Features (Post-Beta Release)
Anantam's capabilities will expand after the beta release with additional features, including:

- **Auto Error Solving:**
   - Detects code errors in real-time.
   - Prompts users to fix errors manually or automatically resolve them.
   - Configurable settings allow users to automate error resolution and proceed with execution seamlessly.
- **Chart Creation in Infx:** Code syntax and functionality to create charts directly using the **Infx language** will be rolled out in future updates.
- **Multi-Language Support:** Integration of languages like JavaScript, R, and Julia.
- **Advanced Debugger:** A powerful debugging interface with breakpoint controls, variable insights, and execution flow tracking.
- **Data Analytics Toolkit:** Built-in tools for data cleaning, transformation, and real-time statistical analysis.
- **AI-Powered Code Suggestions:** Smart autocomplete and suggestions based on machine learning models.
- **Customizable Workspace:** Fully configurable UI, themes, and shortcuts to suit user preferences.
- **Collaborative Coding:** Real-time collaboration features for teams, including code sharing and live editing.
- **Cloud Integration:** Integration with cloud platforms for seamless data storage and access.

---

## Current Roadmap
- **Beta Release:** Approximately 1 month from now.
- **Python Support:** Currently available and functional.
- **Expansions:** Future plans include support for additional programming languages, enhanced debugging, and advanced analytics.

---

## Installation
The installation guide will be available at [mnovus.com](http://mnovus.com) upon release.  
> **Note:** The website is currently under development and will go live at release.

---

## Credits
Anantam uses the following technologies and libraries:
- **CodeMirror** for code editing.
- **Highlight.js** for syntax highlighting.
- Additional open-source libraries to ensure a robust development experience.

For **commercial use**, proper credits must be given to Anantam and its underlying open-source components.

---

## License
**MIT License**  
Anantam is released under the MIT License, allowing open and flexible usage.

---

## Contact
For updates and questions, feel free to reach out:
- **Email:** [riyanjangra9@gmail.com](mailto:riyanjangra9@gmail.com)
- **Updates:** Follow the project repository for regular progress.

---

> *Anantam - Where Anything is Possible.*

