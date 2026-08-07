(() => {
  "use strict";

  const root = document.querySelector("[data-practice-root]");
  if (!root) return;

  const groups = {
    featured: {
      label: "Featured Practice",
      unit: "Program",
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

  const milestones = root.querySelector(".practice-milestones");
  const milestoneButtons = [...root.querySelectorAll("[data-practice-group]")];
  const milestoneCards = [...root.querySelectorAll("[data-practice-card]")];
  const slotElements = [...root.querySelectorAll("[data-practice-slot]")];
  const slots = Object.fromEntries(slotElements.map((item) => [item.dataset.practiceSlot, item]));
  const explorers = {
    featured: root.querySelector('[data-practice-explorer="featured"]'),
    archive: root.querySelector('[data-practice-explorer="archive"]'),
  };

  let slot = slots.featured;
  let explorer = explorers.featured;
  let groupLabel = explorer?.querySelector("[data-practice-group-label]");
  let progress = explorer?.querySelector("[data-practice-progress]");
  let list = explorer?.querySelector("[data-practice-list]");
  let detail = explorer?.querySelector("[data-practice-detail]");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (
    !milestones ||
    slotElements.length !== 2 ||
    !slots.featured ||
    !slots.archive ||
    !explorers.featured ||
    !explorers.archive
  ) return;

  let activeGroup = "featured";
  let activeExercise = 0;
  let copyTimer = 0;
  const pad = (value) => String(value).padStart(2, "0");
  const tabId = (groupName, index) => `practice-tab-${groupName}-${index}`;

  const bindExplorer = (name) => {
    const nextExplorer = explorers[name];
    const nextSlot = slots[name];
    if (!nextExplorer || !nextSlot) return false;

    explorer = nextExplorer;
    slot = nextSlot;
    groupLabel = explorer.querySelector("[data-practice-group-label]");
    progress = explorer.querySelector("[data-practice-progress]");
    list = explorer.querySelector("[data-practice-list]");
    detail = explorer.querySelector("[data-practice-detail]");

    return Boolean(groupLabel && progress && list && detail);
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
      let quoteIndex = i + (prefix ? prefix[0].length : 0);
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
        let cls = "tok-name";
        if (KEYWORDS.has(value)) cls = "tok-keyword";
        else if (BUILTINS.has(value)) cls = "tok-builtin";
        else if (CONSTANTS.has(value)) cls = "tok-constant";
        addToken(row, value, cls); i += value.length; continue;
      }

      const pair = line.slice(i, i + 2);
      if (OP2.has(pair)) { addToken(row, pair, "tok-operator"); i += 2; continue; }
      if (OP1.has(char)) { addToken(row, char, "tok-operator"); i += 1; continue; }
      if (PUNCT.has(char)) { addToken(row, char, "tok-punctuation"); i += 1; continue; }
      addToken(row, char); i += 1;
    }
  };

  const setCode = (target, code) => {
    target.textContent = "";
    code.split("\n").forEach((line) => {
      const row = document.createElement("span");
      row.className = "practice-code-line";
      if (line) highlightPythonLine(row, line);
      else row.appendChild(document.createTextNode(" "));
      target.appendChild(row);
    });
  };

  const resetCopyFeedback = () => {
    window.clearTimeout(copyTimer);
    if (!detail) return;
    const button = detail.querySelector("[data-practice-copy]");
    const status = detail.querySelector("[data-practice-copy-status]");
    button?.classList.remove("is-copied");
    button?.querySelector("span")?.replaceChildren(document.createTextNode("Copy code"));
    if (status) status.textContent = "";
  };

  const renderDetail = () => {
    const group = groups[activeGroup];
    const exercise = group.exercises[activeExercise];
    resetCopyFeedback();
    detail.setAttribute("aria-labelledby", tabId(activeGroup, activeExercise));
    detail.dataset.challenge = String(Boolean(exercise.challenge));
    detail.querySelector("[data-practice-detail-index]").textContent = `${group.unit} ${pad(activeExercise + 1)}`;
    detail.querySelector("[data-practice-detail-badge]").textContent = exercise.badge;
    detail.querySelector("[data-practice-detail-title]").textContent = exercise.title;
    detail.querySelector("[data-practice-detail-summary]").textContent = exercise.summary;
    detail.querySelector("[data-practice-detail-concept]").textContent = exercise.concept;
    detail.querySelector("[data-practice-code-title]").textContent = exercise.title;
    progress.textContent = `${pad(activeExercise + 1)} / ${pad(group.exercises.length)}`;

    const skills = detail.querySelector("[data-practice-detail-skills]");
    skills.textContent = "";
    exercise.skills.forEach((skill) => {
      const item = document.createElement("li");
      item.textContent = skill;
      skills.appendChild(item);
    });

    setCode(detail.querySelector("[data-practice-code]"), exercise.code);
    detail.querySelector("[data-practice-copy]").dataset.code = exercise.code;
  };

  const syncTabs = () => {
    [...list.querySelectorAll(".practice-exercise-tab")].forEach((item, index) => {
      const selected = index === activeExercise;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
  };

  const renderList = () => {
    const group = groups[activeGroup];
    list.textContent = "";
    groupLabel.textContent = group.label;
    explorer.dataset.activeGroup = activeGroup;

    group.exercises.forEach((exercise, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.id = tabId(activeGroup, index);
      button.className = "practice-exercise-tab";
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", detail.id);
      button.setAttribute("aria-selected", String(index === activeExercise));
      button.tabIndex = index === activeExercise ? 0 : -1;
      button.classList.toggle("is-active", index === activeExercise);
      button.innerHTML = `<span class="practice-exercise-tab-index">${pad(index + 1)}</span><span class="practice-exercise-tab-label"></span>`;
      button.querySelector(".practice-exercise-tab-label").textContent = exercise.title;

      button.addEventListener("click", () => {
        if (index === activeExercise) return;
        activeExercise = index; syncTabs(); renderDetail();
      });

      button.addEventListener("keydown", (event) => {
        if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const max = group.exercises.length - 1;
        if (event.key === "Home") activeExercise = 0;
        else if (event.key === "End") activeExercise = max;
        else if (event.key === "ArrowDown" || event.key === "ArrowRight") activeExercise = activeExercise >= max ? 0 : activeExercise + 1;
        else activeExercise = activeExercise <= 0 ? max : activeExercise - 1;
        syncTabs(); renderDetail();
        list.querySelectorAll(".practice-exercise-tab")[activeExercise]?.focus();
      });
      list.appendChild(button);
    });
    renderDetail();
  };

  let explorerOpen = false;
  let interactionToken = 0;
  let scrollFrame = 0;

  const actionText = {
    featured: { closed: "Explore programs", open: "Hide programs" },
    archive: { closed: "Open archive", open: "Close archive" },
  };

  const rightChevron = "m3.5 3 5 7-5 7";
  const leftChevron = "m8.5 3-5 7 5 7";
  const wait = (ms) => ms > 0 ? new Promise((resolve) => window.setTimeout(resolve, ms)) : Promise.resolve();

  const restartClass = (element, className, duration) => {
    if (!element) return;
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
    window.setTimeout(() => element.classList.remove(className), reduceMotion ? 0 : duration);
  };

  const syncCollectionState = () => {
    milestoneButtons.forEach((button) => {
      const selected = explorerOpen && button.dataset.practiceGroup === activeGroup;
      const card = button.closest("[data-practice-card]");
      const label = button.querySelector("[data-practice-action-label]");
      const path = button.querySelector("[data-practice-chevron-path]");
      card?.classList.toggle("is-active", selected);
      button.setAttribute("aria-expanded", String(selected));
      if (label) label.textContent = selected ? actionText[button.dataset.practiceGroup].open : actionText[button.dataset.practiceGroup].closed;
      if (path) path.setAttribute("d", selected ? leftChevron : rightChevron);
    });
  };

  let practiceScrollFrame = 0;

  const cancelPracticeScroll = () => {
    if (!practiceScrollFrame) return;
    window.cancelAnimationFrame(practiceScrollFrame);
    practiceScrollFrame = 0;
  };

  const practiceScrollEase = (progressValue) => {
    return progressValue * progressValue * progressValue *
      (progressValue * (progressValue * 6 - 15) + 10);
  };

  const scrollToOpenedPanel = (name, token) => {
    const targetSlot = slots[name];
    if (!targetSlot || token !== interactionToken) return;

    cancelPracticeScroll();

    const viewport = Math.max(window.innerHeight, 1);
    const offset = window.innerWidth <= 700 ? 68 : 90;
    const targetTop = Math.max(
      0,
      targetSlot.getBoundingClientRect().top + window.scrollY - offset
    );
    const startTop = window.scrollY;
    const distance = targetTop - startTop;

    if (reduceMotion || Math.abs(distance) < 3) {
      if (token === interactionToken) {
        window.scrollTo({ top: targetTop, left: 0, behavior: "auto" });
      }
      return;
    }

    const screenDistance = Math.min(2.6, Math.abs(distance) / viewport);
    const duration = Math.round(
      (window.innerWidth <= 700 ? 1560 : 1440) + screenDistance * 250
    );
    const startedAt = performance.now();

    const step = (now) => {
      if (token !== interactionToken || !targetSlot.classList.contains("is-open")) {
        practiceScrollFrame = 0;
        return;
      }

      const progressValue = Math.min(1, (now - startedAt) / duration);
      const eased = practiceScrollEase(progressValue);

      window.scrollTo({
        top: startTop + distance * eased,
        left: 0,
        behavior: "auto",
      });

      if (progressValue < 1) {
        practiceScrollFrame = window.requestAnimationFrame(step);
      } else {
        practiceScrollFrame = 0;
      }
    };

    practiceScrollFrame = window.requestAnimationFrame(step);
  };

  window.addEventListener("wheel", cancelPracticeScroll, { passive: true });
  window.addEventListener("touchstart", cancelPracticeScroll, { passive: true });
  window.addEventListener("keydown", (event) => {
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) {
      cancelPracticeScroll();
    }
  });

  const nextPaint = () => new Promise((resolve) => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(resolve));
  });

  const setSlotOpen = (name, open) => {
    const targetSlot = slots[name];
    if (!targetSlot) return;
    targetSlot.classList.toggle("is-open", open);
    targetSlot.setAttribute("aria-hidden", String(!open));
  };

  const closeOtherSlots = (exceptName = "") => {
    Object.keys(slots).forEach((name) => {
      if (name !== exceptName) setSlotOpen(name, false);
    });
  };

  const openGroup = async (name) => {
    if (!groups[name] || !slots[name] || !explorers[name]) return;

    cancelPracticeScroll();
    const token = ++interactionToken;

    const targetAlreadyOpen =
      explorerOpen &&
      activeGroup === name &&
      slots[name].classList.contains("is-open");

    if (targetAlreadyOpen) {
      explorerOpen = false;
      syncCollectionState();
      setSlotOpen(name, false);
      return;
    }

    /* Close the other permanent panel first. No DOM element is moved. */
    closeOtherSlots(name);

    activeGroup = name;
    activeExercise = 0;

    if (!bindExplorer(name)) return;
    renderList();

    await nextPaint();
    if (token !== interactionToken) return;

    /* A short compositional pause makes both cards feel identical. */
    await wait(reduceMotion ? 0 : 150);
    if (token !== interactionToken) return;

    explorerOpen = true;
    syncCollectionState();
    setSlotOpen(name, true);

    /* Let expansion clearly start, then synchronize the slower scroll. */
    await wait(reduceMotion ? 0 : (window.innerWidth <= 700 ? 520 : 450));

    if (
      token !== interactionToken ||
      !slots[name].classList.contains("is-open")
    ) return;

    scrollToOpenedPanel(name, token);
  };

  milestoneButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      restartClass(button, "is-button-pressed", 460);
      openGroup(button.dataset.practiceGroup);
    });
  });

  root.addEventListener("click", async (event) => {
    const button = event.target.closest?.("[data-practice-copy]");
    if (!button) return;

    const ownerExplorer = button.closest("[data-practice-explorer]");
    const status = ownerExplorer?.querySelector("[data-practice-copy-status]");
    const value = button.dataset.code || "";
    try {
      await navigator.clipboard.writeText(value);
      button.classList.add("is-copied");
      button.querySelector("span")?.replaceChildren(document.createTextNode("Copied"));
      if (status) status.textContent = "Code copied to clipboard";
      copyTimer = window.setTimeout(resetCopyFeedback, 1800);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      textarea.remove();
      if (status) status.textContent = copied ? "Code copied to clipboard" : "Copy failed — select the code manually";
    }
  });

  /* Workshop-wide shimmer prototype:
     same timing on Foundation, Applied, Python Programming and both practice cards.
     Nested action buttons keep their own independent press feedback. */
  const workshopSweepCards = [
    ...document.querySelectorAll(".workshop-card"),
    ...document.querySelectorAll(".current-track-card"),
    ...document.querySelectorAll(".practice-milestone"),
  ];

  const sweepTimers = new WeakMap();

  const runUnifiedSweep = (card) => {
    const previous = sweepTimers.get(card);
    if (previous) window.clearTimeout(previous);

    card.classList.remove("is-unified-sweeping");
    void card.offsetWidth;
    card.classList.add("is-unified-sweeping");

    const timer = window.setTimeout(() => {
      card.classList.remove("is-unified-sweeping");
      sweepTimers.delete(card);
    }, reduceMotion ? 0 : 680);

    sweepTimers.set(card, timer);
  };

  workshopSweepCards.forEach((card) => {
    card.classList.add("workshop-unified-sweep");
    card.addEventListener("click", (event) => {
      if (event.target.closest?.("button, a")) return;
      runUnifiedSweep(card);
    });
  });

  slotElements.forEach((item) => {
    item.classList.remove("is-open");
    item.setAttribute("aria-hidden", "true");
  });

  /* Pre-render both permanent explorer instances once.
     This avoids first-open layout surprises on either card. */
  ["featured", "archive"].forEach((name) => {
    activeGroup = name;
    activeExercise = 0;
    if (bindExplorer(name)) renderList();
  });

  activeGroup = "featured";
  activeExercise = 0;
  bindExplorer("featured");
  explorerOpen = false;
  syncCollectionState();

})();
