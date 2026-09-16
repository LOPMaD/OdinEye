# OdinEye — Development Log

## Day 0 — Planning

### Project idea

I wanted to build a lightweight, flexible IP analyzer for SOC teams. SOC teams often build their own tools for this, so I thought it would be good to make one convenient tool where you can get all the information you need about an IP in detail, configure exactly what you want to see, and get the result as a PDF file or a table that can be handed to whoever requested the analysis of a given IP range.

### Choosing data sources

I initially planned to scrape [bgp.he.net](https://bgp.he.net/) for IP data, but later decided that was ugly, slower, and didn't provide the full range of information I wanted my tool to show. I settled on getting data through:

- the **RDAP** protocol
- **reverse DNS** queries
- the **Team Cymru IP-to-ASN** tool

### Why by hand, not Claude Code

I initially considered using Claude Code, but decided it was better to do everything by hand to gain more knowledge. For this project, my main goal is to learn more about how protocols work, gain more experience with Python and project structure, and generally improve my skills as a developer.

I understand that AI skills are also important for speeding up work and increasing productivity, but I believe that a junior developer like myself should first learn the fundamentals. Once you move to a senior level with that foundation of knowledge, you can use AI to optimize and improve your own productivity.

### Choosing the frontend

I decided not to use large frontend frameworks like Svelte for this — it would bloat the project by several times over when it isn't needed. I'm using **Flask** — a lightweight web framework for Python.

### Project structure
 
```
OdinEye/
├── app.py
├── requirements.txt
├── src/
│   ├── categories_maps.py
│   └── labels.py
├── templates/
│   └── index.html
└── static/
    ├── css/
    │   └── style.css
    └── js/
        ├── api.js
        ├── app.js
        ├── debug.js
        └── render.js
```
 
The structure is this way because Flask uses the `templates` folder by default for the `render_template()` method when generating a web page from an HTML file.
 
> Quote from the Flask documentation:
> *"Flask will look for templates in the `templates` folder. So if your application is a module, this folder is next to that module; if it's a package, it's actually inside your package."*
 
The same applies to the `static` folder — Flask recommends keeping static files there. The `src/` folder holds the label/category dictionaries used to map raw RDAP fields to filterable categories, and the frontend JS is split across `api.js` (network requests), `render.js` (DOM rendering), `debug.js` (the debug view), and `app.js` (orchestration).
 
---

## Day 1 — Revisiting Flask

I spent most of the day revisiting web development and studying material on Flask.

I also learned from the Flask docs that its built-in server isn't suitable for production if it's going to be used at scale. So I'm adding an Nginx setup to the plan, though that's for the very end.

All the code added in this commit is mostly testing and refreshing syntax.

---

## Day 2 — Digging into the RDAP structure

I spent most of the day analyzing the object returned by `ipwhois`. I made a debug function that simply analyzes an IP and returns the parsed response in a readable format, so I could better understand its structure.

Experimented, and started documenting what each key means.

Hoping to get the output into a table format without redundant values tomorrow.

The first bits of work are visible in this commit.

---

## Day 3-4 — Filters and the nesting problem

Figured out how to build filters using a dict, but ran into a new problem: some fields can have multiple values, and sometimes they're nested inside each other several levels deep.

---

## Day 5 — Tree traversal and formatting

Solved the tree traversal problem for the keys I was using to parse data, and improved data formatting.

Tomorrow I'll refactor the code, since it's already looking complex and tangled, and start on the CSS for the frontend.

---

## Last day — refactoring, decomposition, and CSS

Refactored the code and worked on decomposition. The renderer is now completely different — block-based, which lets CSS be applied to every element individually. Fixed the logic in a few places, added basic error handling. Reworked input handling — it now accepts bulk IPs.

Finally did the CSS. I did this part with Claude's help — I was quite tired and didn't want to spend several more days learning frontend and styling.

The result turned out decent — it now looks much more like a finished prototype. Of course, the core features like CSV and PDF export are still missing, and I'd like to make the interface more user-friendly, but that's for future updates if I come back to this project.

---

## What I learned along the way

- Gained more experience with JS — asynchronicity (`async`/`await`, `fetch`), working with arrays and objects, destructuring.
- Learned what recursion is, and solved a tree traversal problem for arbitrarily nested structures.
- Got better at refactoring code — moved logic into separate modules, learned to give variables and functions consistent, meaningful names.
- Learned about RDAP and how AS works, Entity roles, and nested contacts.
- Practiced with Flask — routes, `jsonify`, working with `request`.
