(() => {
  "use strict";

  const root = document.querySelector("[data-practice-root]");
  if (!root) return;

  const groups = {
    featured: {
      label: "Featured Practice",
      unit: "Program",
      hint: "Swipe through programs",
      exercises: [
        {
          title: "Prime Number Analyzer",
          badge: "Featured build",
          challenge: true,
          summary: "A fuller version of the prime-number exercise that validates the input, counts divisor checks, reports the first factor found and allows repeated analysis from one run.",
          concept: "Builds directly on the original prime checker: Boolean state, modulo, while, break and the square-root stopping condition are kept, then organized into a clearer program flow.",
          skills: ["while", "Boolean", "%", "break", "Validation", "Program Flow"],
          code: `print("=" * 46)\nprint("          PRIME NUMBER ANALYZER")\nprint("=" * 46)\nprint("Enter 0 whenever you want to exit.\\n")\n\nwhile True:\n    number = int(input("Enter an integer: "))\n\n    if number == 0:\n        print("\\nAnalyzer closed. Thank you!")\n        break\n\n    if number < 2:\n        print(f"{number} is not a prime number.")\n        print("Reason: prime numbers start from 2.\\n")\n    else:\n        divisor = 2\n        checks = 0\n        first_divisor = 0\n        is_prime = True\n\n        while divisor <= number ** 0.5:\n            checks = checks + 1\n\n            if number % divisor == 0:\n                is_prime = False\n                first_divisor = divisor\n                break\n\n            divisor = divisor + 1\n\n        print("\\n" + "-" * 46)\n        print("ANALYSIS RESULT")\n        print("-" * 46)\n        print(f"Number checked : {number}")\n        print(f"Divisor checks : {checks}")\n\n        if is_prime:\n            print("Status         : PRIME")\n            print(f"Conclusion     : {number} has no divisors other than 1 and itself.")\n        else:\n            quotient = number // first_divisor\n            print("Status         : NOT PRIME")\n            print(f"First factor   : {first_divisor}")\n            print(f"Factor pair    : {first_divisor} x {quotient} = {number}")\n\n        print("-" * 46 + "\\n")`,
        },
        {
          title: "Triangle Analyzer",
          badge: "Featured build",
          challenge: true,
          summary: "Turns the triangle classification exercise into a compact analyzer with positive-value validation, triangle-rule validation, type classification and a formatted perimeter report.",
          concept: "Keeps the original nested-condition logic, but separates input validation, triangle validation and classification so the decision path is easier to read and explain.",
          skills: ["Nested if", "and / or", "Validation", "Classification", "Arithmetic"],
          code: `print("=" * 46)\nprint("              TRIANGLE ANALYZER")\nprint("=" * 46)\n\nside1 = float(input("Enter the first side : "))\nside2 = float(input("Enter the second side: "))\nside3 = float(input("Enter the third side : "))\n\nprint("\\n" + "-" * 46)\n\nif side1 <= 0 or side2 <= 0 or side3 <= 0:\n    print("INVALID INPUT")\n    print("All triangle sides must be greater than zero.")\nelse:\n    is_triangle = (\n        side1 + side2 > side3\n        and side1 + side3 > side2\n        and side2 + side3 > side1\n    )\n\n    if is_triangle:\n        perimeter = side1 + side2 + side3\n\n        if side1 == side2 and side2 == side3:\n            triangle_type = "Equilateral"\n        elif side1 == side2 or side1 == side3 or side2 == side3:\n            triangle_type = "Isosceles"\n        else:\n            triangle_type = "Scalene"\n\n        print("TRIANGLE REPORT")\n        print("-" * 46)\n        print(f"Sides      : {side1:g}, {side2:g}, {side3:g}")\n        print(f"Type       : {triangle_type}")\n        print(f"Perimeter  : {perimeter:g}")\n        print("Validation : The three sides form a valid triangle.")\n    else:\n        print("INVALID TRIANGLE")\n        print("The entered sides do not satisfy the triangle rule.")\n\nprint("-" * 46)`,
        },
        {
          title: "Student Grade Analyzer",
          badge: "Refined practice",
          challenge: false,
          summary: "Expands the grade-range exercise into a repeatable student analyzer with validation, detailed grade bands and a session average when the user finishes.",
          concept: "Builds on ordered if/elif ranges while adding a loop, input boundaries and running totals to make the exercise behave more like a complete console program.",
          skills: ["if / elif / else", "while", "Ranges", "Validation", "Average"],
          code: `print("=" * 48)\nprint("           STUDENT GRADE ANALYZER")\nprint("=" * 48)\nprint("Enter -1 to finish and view the session summary.\\n")\n\nstudent_count = 0\ntotal_percentage = 0\n\nwhile True:\n    percentage = float(input("Enter student percentage: "))\n\n    if percentage == -1:\n        break\n\n    if percentage < 0 or percentage > 100:\n        print("Invalid percentage. Enter a value from 0 to 100.\\n")\n    else:\n        if percentage >= 90:\n            grade = "A+"\n            message = "Excellent performance"\n        elif percentage >= 80:\n            grade = "A"\n            message = "Very good performance"\n        elif percentage >= 70:\n            grade = "B"\n            message = "Good performance"\n        elif percentage >= 60:\n            grade = "C"\n            message = "Passed — keep improving"\n        elif percentage >= 50:\n            grade = "D"\n            message = "Passed — more practice is recommended"\n        else:\n            grade = "F"\n            message = "Needs more practice"\n\n        student_count = student_count + 1\n        total_percentage = total_percentage + percentage\n\n        print("\\n" + "-" * 48)\n        print(f"Percentage : {percentage:.2f}%")\n        print(f"Grade      : {grade}")\n        print(f"Feedback   : {message}")\n        print("-" * 48 + "\\n")\n\nprint("\\n" + "=" * 48)\nprint("SESSION SUMMARY")\nprint("=" * 48)\n\nif student_count > 0:\n    average = total_percentage / student_count\n    print(f"Students analyzed : {student_count}")\n    print(f"Session average   : {average:.2f}%")\nelse:\n    print("No valid student percentages were entered.")`,
        },
        {
          title: "Smart Discount Calculator",
          badge: "Refined practice",
          challenge: false,
          summary: "Refines the original discount exercise into a validated calculator that prints a clean purchase summary with the original price, savings and final amount.",
          concept: "Uses the same percentage formula as the original exercise, with additional boundary checks and a more professional output structure.",
          skills: ["float", "Percentage", "Validation", "Formatting", "f-string"],
          code: `print("=" * 46)\nprint("          SMART DISCOUNT CALCULATOR")\nprint("=" * 46)\n\nprice = float(input("Enter the original price: $ "))\ndiscount = float(input("Enter discount percentage: "))\n\nif price <= 0:\n    print("\\nInvalid price. The product price must be greater than zero.")\nelif discount < 0 or discount > 100:\n    print("\\nInvalid discount. Enter a value from 0 to 100.")\nelse:\n    discount_amount = (price * discount) / 100\n    final_price = price - discount_amount\n\n    print("\\n" + "-" * 46)\n    print("PURCHASE SUMMARY")\n    print("-" * 46)\n    print(f"Original price : $ {price:.2f}")\n    print(f"Discount       : {discount:.2f}%")\n    print(f"You save       : $ {discount_amount:.2f}")\n    print(f"Final price    : $ {final_price:.2f}")\n    print("-" * 46)\n\n    if discount >= 50:\n        print("Large discount applied successfully.")\n    elif discount > 0:\n        print("Discount applied successfully.")\n    else:\n        print("No discount was applied.")`,
        },
        {
          title: "BMI Analyzer",
          badge: "Refined practice",
          challenge: false,
          summary: "Builds on the original BMI formula by validating measurements and classifying the result into numeric ranges before printing a concise report.",
          concept: "Keeps the float input and BMI calculation from the first exercise set, then adds condition ranges and formatted output to turn one calculation into a complete analyzer.",
          skills: ["float", "Formula", "if / elif / else", "Validation", ".2f"],
          code: `print("=" * 44)\nprint("              BMI ANALYZER")\nprint("=" * 44)\n\nheight = float(input("Enter height in meters   : "))\nweight = float(input("Enter weight in kilograms: "))\n\nif height <= 0 or weight <= 0:\n    print("\\nInvalid measurements. Height and weight must be positive.")\nelse:\n    bmi = weight / (height * height)\n\n    if bmi < 18.5:\n        category = "Underweight"\n    elif bmi < 25:\n        category = "Normal range"\n    elif bmi < 30:\n        category = "Overweight"\n    else:\n        category = "High BMI range"\n\n    print("\\n" + "-" * 44)\n    print("BMI REPORT")\n    print("-" * 44)\n    print(f"Height   : {height:.2f} m")\n    print(f"Weight   : {weight:.2f} kg")\n    print(f"BMI      : {bmi:.2f}")\n    print(f"Category : {category}")\n    print("-" * 44)`,
        },
      ],
    },
    archive: {
      label: "Learning Archive",
      unit: "Exercise",
      hint: "Swipe through exercises",
      exercises: [
        {
          title: "Even or Odd",
          badge: "Original exercise",
          summary: "A compact condition exercise that checks the remainder after division by two.",
          concept: "One of the early steps into decision-making with modulo and if/else.",
          skills: ["if / else", "%", "Comparison", "int"],
          code: `number = int(input("Enter an integer number: "))\n\nif number % 2 == 0:\n    print(f"{number} is even.")\nelse:\n    print(f"{number} is odd.")`,
        },
        {
          title: "Age Classification",
          badge: "Original exercise",
          summary: "Classifies an entered age into child, teenager or adult using ordered branches.",
          concept: "Early practice with if, elif, else and a compound range condition.",
          skills: ["if", "elif", "else", "and"],
          code: `age = int(input("Enter your age: "))\n\nif age < 12:\n    print("You are a child.")\nelif age >= 12 and age <= 18:\n    print("You are a teenager.")\nelse:\n    print("You are an adult.")`,
        },
        {
          title: "Positive Number Validator",
          badge: "Original exercise",
          summary: "Rejects zero and negative integers and accepts positive input.",
          concept: "A direct validation exercise using one numeric boundary condition.",
          skills: ["Validation", "<=", "if / else", "f-string"],
          code: `number = int(input("Enter a positive integer: "))\n\nif number <= 0:\n    print("Invalid input. Please enter a positive integer.")\nelse:\n    print(f"Positive integer accepted: {number}")`,
        },
        {
          title: "Time Converter",
          badge: "Foundation exercise",
          summary: "Converts a total number of minutes into complete hours and remaining minutes.",
          concept: "A useful early exercise for floor division and modulo working together.",
          skills: ["//", "%", "int", "f-string"],
          code: `total_minutes = int(input("Enter the number of minutes: "))\n\nhours = total_minutes // 60\nremaining_minutes = total_minutes % 60\n\nprint(f"Time: {hours} hour(s) and {remaining_minutes} minute(s).")`,
        },
        {
          title: "Arithmetic Calculator",
          badge: "Foundation exercise",
          summary: "Reads two numbers and displays the four basic arithmetic results, including a safe division check.",
          concept: "Preserves the arithmetic exercise as an early example of variables, operators and formatted output.",
          skills: ["+ - * /", "Variables", "int", "Validation"],
          code: `first_number = int(input("Enter the first number : "))\nsecond_number = int(input("Enter the second number: "))\n\naddition = first_number + second_number\nsubtraction = first_number - second_number\nmultiplication = first_number * second_number\n\nprint("\\nArithmetic Results")\nprint("-" * 28)\nprint(f"Addition       : {addition}")\nprint(f"Subtraction    : {subtraction}")\nprint(f"Multiplication : {multiplication}")\n\nif second_number != 0:\n    division = first_number / second_number\n    print(f"Division       : {division:.2f}")\nelse:\n    print("Division       : Cannot divide by zero")`,
        },
        {
          title: "Eligibility Logic",
          badge: "Logic exercise",
          summary: "Combines age, residence years and a yes/no permission flag into one classroom logic decision.",
          concept: "Kept explicitly as a programming-logic exercise rather than a statement of real voting law.",
          skills: ["and / or", "Nested if", ".lower()", "Boolean logic"],
          code: `age = int(input("Enter your age: "))\nresidence_years = int(input("Enter residence years: "))\nspecial_permission = input("Special permission? Yes or No: ").lower()\n\neligible = age >= 18 and (\n    residence_years >= 5 or special_permission == "yes"\n)\n\nif eligible:\n    if residence_years >= 5:\n        print("Eligible through the residence condition.")\n    else:\n        print("Eligible through the special-permission condition.")\nelse:\n    print("The exercise conditions were not met.")`,
        },
        {
          title: "Name & Age",
          badge: "First exercise",
          summary: "The simplest starting exercise is kept at the end of the archive, where it documents the beginning without leading the portfolio presentation.",
          concept: "A first step with input, variables, integer conversion and f-string output.",
          skills: ["input", "Variables", "int", "f-string"],
          code: `name = input("Enter your name: ")\nage = int(input("Enter your age: "))\n\nprint(f"Welcome {name}. You are {age} years old.")`,
        },
      ],
    },
  };

  const KEYWORDS = new Set(["if", "elif", "else", "while", "for", "break", "continue", "and", "or", "not", "in", "is", "def", "return", "from", "import", "as", "pass"]);
  const BUILTINS = new Set(["input", "print", "int", "float", "str", "round", "len", "range", "min", "max", "sum"]);
  const CONSTANTS = new Set(["True", "False", "None"]);
  const OP2 = new Set(["==", "!=", "<=", ">=", "**", "//", "+=", "-=", "*=", "/=", "%="]);
  const OP1 = new Set(["=", "+", "-", "*", "/", "%", "<", ">"]);
  const PUNCT = new Set(["(", ")", "[", "]", "{", "}", ":", ",", "."]);

  const buttons = [...root.querySelectorAll("[data-practice-group]")];
  const slotElements = [...root.querySelectorAll("[data-practice-slot]")];
  const slots = Object.fromEntries(slotElements.map((slot) => [slot.dataset.practiceSlot, slot]));
  const explorers = Object.fromEntries(Object.keys(groups).map((name) => [name, root.querySelector(`[data-practice-explorer="${name}"]`)]));
  if (Object.values(slots).some((slot) => !slot) || Object.values(explorers).some((explorer) => !explorer)) return;

  const activeIndex = { featured: 0, archive: 0 };
  let openGroupName = "";
  let copyTimer = 0;

  const pad = (value) => String(value).padStart(2, "0");
  const actionText = {
    featured: { closed: "Explore programs", open: "Hide programs" },
    archive: { closed: "Open archive", open: "Close archive" },
  };
  const rightChevron = "m3.5 3 5 7-5 7";
  const leftChevron = "m8.5 3-5 7 5 7";

  const viewFor = (name) => {
    const explorer = explorers[name];
    return {
      explorer,
      list: explorer.querySelector("[data-practice-list]"),
      progress: explorer.querySelector("[data-practice-progress]"),
      detail: explorer.querySelector("[data-practice-detail]"),
    };
  };

  const addToken = (parent, text, className = "") => {
    if (!text) return;
    const span = document.createElement("span");
    if (className) span.className = className;
    span.textContent = text;
    parent.appendChild(span);
  };

  const highlightPythonLine = (row, line) => {
    let i = 0;
    while (i < line.length) {
      const char = line[i];
      if (char === "#") { addToken(row, line.slice(i), "tok-comment"); break; }
      if (/\s/.test(char)) {
        let j = i + 1;
        while (j < line.length && /\s/.test(line[j])) j += 1;
        addToken(row, line.slice(i, j)); i = j; continue;
      }
      const prefix = line.slice(i).match(/^(?:[rRuUbBfF]{1,2})(?=["'])/);
      const quoteIndex = i + (prefix ? prefix[0].length : 0);
      if (line[quoteIndex] === '"' || line[quoteIndex] === "'") {
        const quote = line[quoteIndex];
        let j = quoteIndex + 1;
        let escaped = false;
        while (j < line.length) {
          const current = line[j];
          if (escaped) escaped = false;
          else if (current === "\\") escaped = true;
          else if (current === quote) { j += 1; break; }
          j += 1;
        }
        addToken(row, line.slice(i, j), "tok-string"); i = j; continue;
      }
      if (/\d/.test(char) || (char === "." && /\d/.test(line[i + 1] || ""))) {
        const match = line.slice(i).match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/);
        const value = match ? match[0] : char;
        addToken(row, value, "tok-number"); i += value.length; continue;
      }
      if (/[A-Za-z_]/.test(char)) {
        const value = line.slice(i).match(/^[A-Za-z_][A-Za-z0-9_]*/)[0];
        let className = "tok-name";
        if (KEYWORDS.has(value)) className = "tok-keyword";
        else if (BUILTINS.has(value)) className = "tok-builtin";
        else if (CONSTANTS.has(value)) className = "tok-constant";
        addToken(row, value, className); i += value.length; continue;
      }
      const pair = line.slice(i, i + 2);
      if (OP2.has(pair)) { addToken(row, pair, "tok-operator"); i += 2; continue; }
      if (OP1.has(char)) { addToken(row, char, "tok-operator"); i += 1; continue; }
      if (PUNCT.has(char)) { addToken(row, char, "tok-punctuation"); i += 1; continue; }
      addToken(row, char); i += 1;
    }
  };

  const setCode = (target, code) => {
    target.replaceChildren();
    code.split("\n").forEach((line) => {
      const row = document.createElement("span");
      row.className = "practice-code-line";
      if (line) highlightPythonLine(row, line);
      else row.appendChild(document.createTextNode(" "));
      target.appendChild(row);
    });
  };

  const resetCopyFeedback = (detail) => {
    window.clearTimeout(copyTimer);
    const button = detail.querySelector("[data-practice-copy]");
    const status = detail.querySelector("[data-practice-copy-status]");
    button?.classList.remove("is-copied");
    button?.querySelector("span")?.replaceChildren(document.createTextNode("Copy code"));
    if (status) status.textContent = "";
  };

  const animateDetail = (detail, direction) => {
    detail.classList.remove("is-slide-next", "is-slide-prev", "is-slide-refresh");
    void detail.offsetWidth;
    detail.classList.add(direction > 0 ? "is-slide-next" : direction < 0 ? "is-slide-prev" : "is-slide-refresh");
  };

  const syncCarousel = (name) => {
    const group = groups[name];
    const view = viewFor(name);
    const index = activeIndex[name];
    const counter = view.explorer.querySelector("[data-practice-swipe-counter]");
    const dots = [...view.explorer.querySelectorAll("[data-practice-dot]")];
    if (counter) counter.textContent = `${pad(index + 1)} / ${pad(group.exercises.length)}`;
    if (view.progress) view.progress.textContent = `${pad(index + 1)} / ${pad(group.exercises.length)}`;
    dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === index));
  };

  const renderDetail = (name, index, direction = 0) => {
    const group = groups[name];
    const exercise = group.exercises[index];
    const view = viewFor(name);
    const detail = view.detail;
    activeIndex[name] = index;
    resetCopyFeedback(detail);

    detail.dataset.challenge = String(Boolean(exercise.challenge));
    detail.querySelector("[data-practice-detail-index]").textContent = `${group.unit} ${pad(index + 1)}`;
    detail.querySelector("[data-practice-detail-badge]").textContent = exercise.badge;
    detail.querySelector("[data-practice-detail-title]").textContent = exercise.title;
    detail.querySelector("[data-practice-detail-summary]").textContent = exercise.summary;
    detail.querySelector("[data-practice-detail-concept]").textContent = exercise.concept;
    detail.querySelector("[data-practice-code-title]").textContent = exercise.title;

    const skills = detail.querySelector("[data-practice-detail-skills]");
    skills.replaceChildren(...exercise.skills.map((skill) => {
      const item = document.createElement("li");
      item.textContent = skill;
      return item;
    }));

    setCode(detail.querySelector("[data-practice-code]"), exercise.code);
    detail.querySelector("[data-practice-copy]").dataset.code = exercise.code;
    syncCarousel(name);
    animateDetail(detail, direction);
  };

  const move = (name, direction) => {
    const total = groups[name].exercises.length;
    const current = activeIndex[name];
    const next = (current + direction + total) % total;
    renderDetail(name, next, direction);
  };

  const buildCarouselControls = (name) => {
    const group = groups[name];
    const view = viewFor(name);
    view.list?.closest(".practice-exercise-nav")?.setAttribute("aria-hidden", "true");

    const controls = document.createElement("div");
    controls.className = "practice-swipe-controls";
    controls.setAttribute("aria-label", `${group.label} navigation`);
    controls.innerHTML = `
      <button type="button" class="practice-swipe-arrow" data-practice-prev aria-label="Previous ${group.unit.toLowerCase()}">
        <svg aria-hidden="true" viewBox="0 0 12 20"><path d="m8.5 3-5 7 5 7"></path></svg>
      </button>
      <div class="practice-swipe-meta">
        <span class="practice-swipe-hint">${group.hint}</span>
        <strong data-practice-swipe-counter>${pad(1)} / ${pad(group.exercises.length)}</strong>
        <span class="practice-swipe-dots" aria-hidden="true">${group.exercises.map((_, index) => `<i data-practice-dot class="${index === 0 ? "is-active" : ""}"></i>`).join("")}</span>
      </div>
      <button type="button" class="practice-swipe-arrow" data-practice-next aria-label="Next ${group.unit.toLowerCase()}">
        <svg aria-hidden="true" viewBox="0 0 12 20"><path d="m3.5 3 5 7-5 7"></path></svg>
      </button>`;

    view.detail.before(controls);
    controls.querySelector("[data-practice-prev]").addEventListener("click", () => move(name, -1));
    controls.querySelector("[data-practice-next]").addEventListener("click", () => move(name, 1));

    let startX = 0;
    let startY = 0;
    let tracking = false;

    view.detail.addEventListener("touchstart", (event) => {
      const touch = event.touches[0];
      if (!touch || event.target.closest("button")) return;
      startX = touch.clientX;
      startY = touch.clientY;
      tracking = true;
    }, { passive: true });

    view.detail.addEventListener("touchend", (event) => {
      if (!tracking) return;
      tracking = false;
      const touch = event.changedTouches[0];
      if (!touch) return;
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (Math.abs(dx) < 44 || Math.abs(dx) <= Math.abs(dy) * 1.15) return;
      move(name, dx < 0 ? 1 : -1);
    }, { passive: true });

    view.detail.tabIndex = 0;
    view.detail.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      move(name, event.key === "ArrowRight" ? 1 : -1);
    });
  };

  const syncCollectionState = () => {
    buttons.forEach((button) => {
      const name = button.dataset.practiceGroup;
      const selected = openGroupName === name;
      const card = button.closest("[data-practice-card]");
      const label = button.querySelector("[data-practice-action-label]");
      const path = button.querySelector("[data-practice-chevron-path]");
      card?.classList.toggle("is-active", selected);
      button.setAttribute("aria-expanded", String(selected));
      if (label) label.textContent = selected ? actionText[name].open : actionText[name].closed;
      if (path) path.setAttribute("d", selected ? leftChevron : rightChevron);
    });
  };

  const setSlot = (name, open) => {
    const slot = slots[name];
    slot.style.removeProperty("height");
    slot.classList.remove("is-settled", "is-closing");
    slot.classList.toggle("is-open", open);
    slot.hidden = !open;
    slot.setAttribute("aria-hidden", String(!open));
  };

  const toggleGroup = (name) => {
    if (!groups[name]) return;
    if (openGroupName === name) {
      setSlot(name, false);
      openGroupName = "";
      syncCollectionState();
      return;
    }

    if (openGroupName) setSlot(openGroupName, false);
    openGroupName = name;
    setSlot(name, true);
    renderDetail(name, activeIndex[name], 0);
    syncCollectionState();
  };

  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleGroup(button.dataset.practiceGroup);
    });
  });

  const copyCode = async (button) => {
    const value = button.dataset.code || "";
    const owner = button.closest("[data-practice-explorer]");
    const status = owner?.querySelector("[data-practice-copy-status]");
    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) await navigator.clipboard.writeText(value);
      else throw new Error("Clipboard API unavailable");
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      textarea.remove();
      if (!copied) {
        if (status) status.textContent = "Copy failed — select the code manually";
        return;
      }
    }

    window.clearTimeout(copyTimer);
    button.classList.add("is-copied");
    button.querySelector("span")?.replaceChildren(document.createTextNode("Copied"));
    if (status) status.textContent = "Code copied to clipboard";
    copyTimer = window.setTimeout(() => {
      button.classList.remove("is-copied");
      button.querySelector("span")?.replaceChildren(document.createTextNode("Copy code"));
      if (status) status.textContent = "";
    }, 1500);
  };

  root.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-practice-copy]");
    if (button) void copyCode(button);
  });

  Object.keys(groups).forEach((name) => {
    setSlot(name, false);
    buildCarouselControls(name);
    renderDetail(name, 0, 0);
  });
  syncCollectionState();
})();