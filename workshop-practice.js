(() => {
  "use strict";

  const root = document.querySelector("[data-practice-root]");
  if (!root) return;

  const groups = {
    fundamentals: {
      label: "Python Fundamentals",
      exercises: [
        {
          title: "Name & Age",
          badge: "Input exercise",
          summary: "Collects a name and age from the user, converts the age to an integer, then displays the values in a formatted message.",
          concept: "Using input, variables, integer conversion and an f-string to turn simple user data into a clear output.",
          skills: ["input", "Variables", "int", "f-string"],
          code: `name = input("Hello, Enter your name: ")\nage = int(input("Enter your age: "))\n\nprint(f"Welcome {name}, Your age is {age} years old.")`,
        },
        {
          title: "Arithmetic Operations",
          badge: "Math exercise",
          summary: "Reads two integers and calculates addition, subtraction, multiplication and division results.",
          concept: "Practicing arithmetic operators, storing results in variables and formatting several outputs in one print statement.",
          skills: ["+ - * /", "Variables", "int", "Formatting"],
          code: `first_number = int(input("Enter the first number: "))\nsecond_number = int(input("Enter the second number: "))\n\naddition = first_number + second_number\nsubtraction = first_number - second_number\nmultiplication = first_number * second_number\ndivision = first_number / second_number\n\nprint(\n\n    f"Addition result is: { addition } \\n"\n    f"Subtraction result is: { subtraction } \\n"\n    f"Multiplication result is: { multiplication } \\n"\n    f"Division result is: { division } "\n)`,
        },
        {
          title: "Body Mass Index",
          badge: "Calculation exercise",
          summary: "Accepts height and weight as decimal values and calculates BMI to two decimal places.",
          concept: "Using float input, a formula with multiplication and division, and numeric formatting with two decimal places.",
          skills: ["float", "Formula", "Division", ".2f"],
          code: `height = float(input("Enter your height in meters: "))\nweight = float(input("Enter your weight in kilograms: "))\n\nbmi = weight / ( height * height )\n\nprint(f"The body mass index (BMI) is: {bmi:.2f}")`,
        },
        {
          title: "Product Discount",
          badge: "Percentage exercise",
          summary: "Calculates the discount amount from a percentage and subtracts it from the original product price.",
          concept: "Breaking a percentage calculation into clear intermediate values before producing the final price.",
          skills: ["float", "Percentage", "Variables", ".2f"],
          code: `price = float(input("Welcome our customer, enter the product price: "))\ndiscount = float(input("Enter the discount percentage: "))\n\ndiscount_amount = (price * discount) / 100\nfinal_price = price - discount_amount\n\nprint(f"The discount amount is: {discount_amount:.2f} and the final price after the discount is: {final_price:.2f} Thank you!")`,
        },
        {
          title: "Convert Minutes",
          badge: "Division exercise",
          summary: "Converts a total number of minutes into complete hours and the remaining minutes.",
          concept: "Using floor division to find complete hours and modulo to keep the remaining minutes.",
          skills: ["//", "%", "int", "f-string"],
          code: `total_minutes = int(input("Enter the number of minutes: "))\n\nhours = total_minutes // 60\nremaining_minutes = total_minutes % 60\n\nprint(f"The time is { hours } hours and { remaining_minutes } minutes.")`,
        },
      ],
    },
    logic: {
      label: "Conditions, Logic & Loops",
      exercises: [
        {
          title: "Even or Odd",
          badge: "Condition exercise",
          summary: "Checks whether an integer is even or odd using modulo and a simple if/else branch.",
          concept: "Using the remainder of division by 2 as a condition that selects one of two outputs.",
          skills: ["if / else", "%", "Comparison", "int"],
          code: `number = int (input("enter a number: "))\nif number % 2 == 0:\n    print (" the number is even.")\nelse:\n    print ("the number is odd.")`,
        },
        {
          title: "Age Classification",
          badge: "Branching exercise",
          summary: "Places an entered age into child, teenager or adult categories using if, elif and else.",
          concept: "Building multiple branches in a clear order so only one age category is selected.",
          skills: ["if", "elif", "else", "and"],
          code: `age = int (input("hello, enter your age: "))\nif age < 12:\n    print ("you are a child")\nelif age >= 12 and age <= 18:\n    print ("you are a teenager.")\nelse:\n    print ("you are an adult.")`,
        },
        {
          title: "Grade Classification",
          badge: "Range exercise",
          summary: "Classifies a percentage into A, B, C or fail ranges by testing ordered conditions.",
          concept: "Using elif ranges to evaluate one numeric value against several grade boundaries.",
          skills: ["elif", "Ranges", "and", "float"],
          code: `percentage = float (input(" enter your percentage: "))\nif percentage >= 90:\n    print ("your grade is: A")\nelif percentage >= 75 and percentage < 90: \n    print ("your grade is: B")\nelif percentage >= 65 and percentage < 75:\n    print ("your grade is: C")\nelse:\n    print ("sorry, you failed.")`,
        },
        {
          title: "Eligibility Logic",
          badge: "Boolean logic",
          summary: "A programming exercise that combines age, residence years and a yes/no permission flag into one eligibility decision.",
          concept: "Practicing grouped conditions with and/or, normalized text input and a nested condition that explains which path qualified.",
          skills: ["and / or", "Nested if", ".lower()", "Boolean logic"],
          code: `age = int (input("hello, enter your age: "))\nresidence_years = int (input("enter your residence years: "))\nspecial_permission = input ("do you have special permission? Yes or No!: ").lower()\nif age >= 18 and ( residence_years >= 5 or special_permission == "yes" ):\n    if residence_years >= 5: \n        print ("very good!, you are eligible to vote.")\n    else :\n        print ("you are eligible through your special permission!.")\nelse:\n    print ("sorry!, you are not eligible to vote.")`,
        },
        {
          title: "Positive Number Validation",
          badge: "Validation exercise",
          summary: "Checks whether the entered integer is positive before accepting and displaying it.",
          concept: "Using a boundary condition to reject zero and negative values while allowing positive integers.",
          skills: ["Validation", "<=", "if / else", "f-string"],
          code: `number = int (input("enter a positive integer number: "))\nif number <= 0 : \n    print ("sorry, the number you entered is incorrect, please! enter a positive number.")\nelse:\n    print (f"a positive integer was entered: {number}")`,
        },
        {
          title: "Prime Number Checker",
          badge: "Logic challenge",
          summary: "Determines whether an integer is prime by testing possible divisors and stopping when a factor is found.",
          concept: "Combining a Boolean flag, while loop, modulo, square-root limit and break to control a complete checking process.",
          skills: ["while", "Boolean", "%", "break", "** 0.5"],
          code: `number = int (input(" enter an integer number: "))\ndivisor = 2 \nis_prime = True \nif number < 2:\n    is_prime = False\nelse:\n    while divisor <= number ** 0.5:\n        if number % divisor == 0: \n            is_prime = False \n            break\n        divisor = divisor + 1\nif is_prime:\n    print (f" the number {number} is prime.")\nelse:\n    print (f" the number {number} is not prime.")`,
        },
        {
          title: "Triangle Classification",
          badge: "Logic challenge",
          summary: "Validates whether three side lengths can form a triangle, then classifies the result as equilateral, isosceles or scalene.",
          concept: "Using a validation condition first, then nested branching to classify a valid result by equality relationships.",
          skills: ["Nested if", "and / or", "Validation", "Classification"],
          code: `side1 = float (input("enter the first side: "))\nside2 = float (input("enter the second side: "))\nside3 = float (input("enter the third side: "))\n\nif side1 + side2 > side3 and side1 + side3 > side2 and side2 + side3 > side1:\n    if side1 == side2 and side2 == side3:\n        print ("the triangle is equilateral.")\n    elif side1 == side2 or side1 == side3 or side2 == side3:\n        print ("the triangle is isosceles.")\n    else:\n        print ("the triangle is scalene.")\nelse:\n    print ("The sides do not form a triangle.")`,
        },
      ],
    },
  };

  const milestoneButtons = [...root.querySelectorAll("[data-practice-group]")];
  const explorer = root.querySelector("[data-practice-explorer]");
  const groupLabel = root.querySelector("[data-practice-group-label]");
  const progress = root.querySelector("[data-practice-progress]");
  const list = root.querySelector("[data-practice-list]");
  const detail = root.querySelector("[data-practice-detail]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!explorer || !list || !detail) return;

  detail.id = detail.id || "practice-detail-panel";

  let activeGroup = "fundamentals";
  let activeExercise = 0;
  let copyTimer = 0;

  const pad = (value) => String(value).padStart(2, "0");
  const tabId = (groupName, index) => `practice-tab-${groupName}-${index}`;

  const setCode = (target, code) => {
    target.textContent = "";
    code.split("\n").forEach((line) => {
      const row = document.createElement("span");
      row.className = "practice-code-line";
      row.textContent = line || " ";
      target.appendChild(row);
    });
  };

  const fallbackCopy = (value) => {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.setAttribute("aria-hidden", "true");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.opacity = "0";
    textarea.style.fontSize = "16px";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    if (!copied) throw new Error("Copy command failed");
  };

  const copyText = async (value) => {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(value);
        return;
      } catch {
        fallbackCopy(value);
        return;
      }
    }
    fallbackCopy(value);
  };

  const resetCopyFeedback = () => {
    window.clearTimeout(copyTimer);
    copyTimer = 0;
    const copyButton = detail.querySelector("[data-practice-copy]");
    const copyStatus = detail.querySelector("[data-practice-copy-status]");
    if (copyButton) {
      copyButton.classList.remove("is-copied");
      copyButton.querySelector("span")?.replaceChildren(document.createTextNode("Copy code"));
    }
    if (copyStatus) copyStatus.textContent = "";
  };

  const renderDetail = () => {
    const group = groups[activeGroup];
    const exercise = group.exercises[activeExercise];
    const index = detail.querySelector("[data-practice-detail-index]");
    const badge = detail.querySelector("[data-practice-detail-badge]");
    const title = detail.querySelector("[data-practice-detail-title]");
    const summary = detail.querySelector("[data-practice-detail-summary]");
    const concept = detail.querySelector("[data-practice-detail-concept]");
    const skills = detail.querySelector("[data-practice-detail-skills]");
    const codeTitle = detail.querySelector("[data-practice-code-title]");
    const code = detail.querySelector("[data-practice-code]");
    const copyButton = detail.querySelector("[data-practice-copy]");

    resetCopyFeedback();

    detail.setAttribute("aria-labelledby", tabId(activeGroup, activeExercise));
    detail.dataset.challenge = String(exercise.badge === "Logic challenge");

    if (index) index.textContent = `Exercise ${pad(activeExercise + 1)}`;
    if (badge) badge.textContent = exercise.badge;
    if (title) title.textContent = exercise.title;
    if (summary) summary.textContent = exercise.summary;
    if (concept) concept.textContent = exercise.concept;
    if (codeTitle) codeTitle.textContent = exercise.title;
    if (progress) progress.textContent = `${pad(activeExercise + 1)} / ${pad(group.exercises.length)}`;

    if (skills) {
      skills.textContent = "";
      exercise.skills.forEach((skill) => {
        const item = document.createElement("li");
        item.textContent = skill;
        skills.appendChild(item);
      });
    }

    if (code) setCode(code, exercise.code);
    if (copyButton) copyButton.dataset.code = exercise.code;
  };

  const syncTabState = () => {
    [...list.querySelectorAll(".practice-exercise-tab")].forEach((item, itemIndex) => {
      const selected = itemIndex === activeExercise;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
  };

  const renderList = () => {
    const group = groups[activeGroup];
    list.textContent = "";
    if (groupLabel) groupLabel.textContent = group.label;
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
        activeExercise = index;
        syncTabState();
        renderDetail();
      });

      button.addEventListener("keydown", (event) => {
        if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const max = group.exercises.length - 1;
        if (event.key === "Home") activeExercise = 0;
        else if (event.key === "End") activeExercise = max;
        else if (event.key === "ArrowDown" || event.key === "ArrowRight") activeExercise = activeExercise >= max ? 0 : activeExercise + 1;
        else activeExercise = activeExercise <= 0 ? max : activeExercise - 1;
        syncTabState();
        renderDetail();
        list.querySelectorAll(".practice-exercise-tab")[activeExercise]?.focus();
      });

      list.appendChild(button);
    });

    renderDetail();
  };

  const setGroup = (groupName, { focusExplorer = false } = {}) => {
    if (!groups[groupName]) return;
    activeGroup = groupName;
    activeExercise = 0;
    milestoneButtons.forEach((button) => {
      const selected = button.dataset.practiceGroup === activeGroup;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    renderList();

    if (focusExplorer) {
      explorer.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
      window.setTimeout(() => list.querySelector(".practice-exercise-tab")?.focus({ preventScroll: true }), reduceMotion ? 0 : 260);
    }
  };

  milestoneButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.practiceGroup === activeGroup));
    button.addEventListener("click", () => setGroup(button.dataset.practiceGroup, { focusExplorer: true }));
  });

  root.addEventListener("click", async (event) => {
    const copyButton = event.target.closest?.("[data-practice-copy]");
    if (!copyButton || !root.contains(copyButton)) return;

    const value = copyButton.dataset.code || "";
    if (!value) return;
    const status = detail.querySelector("[data-practice-copy-status]");

    try {
      await copyText(value);
      window.clearTimeout(copyTimer);
      copyButton.classList.add("is-copied");
      copyButton.querySelector("span")?.replaceChildren(document.createTextNode("Copied"));
      if (status) status.textContent = "Code copied to clipboard";
      copyTimer = window.setTimeout(() => {
        copyButton.classList.remove("is-copied");
        copyButton.querySelector("span")?.replaceChildren(document.createTextNode("Copy code"));
        if (status) status.textContent = "";
      }, reduceMotion ? 1100 : 1800);
    } catch (error) {
      console.error("Practice code copy failed", error);
      if (status) status.textContent = "Copy failed — select the code manually";
    } finally {
      copyButton.blur();
    }
  });

  renderList();
})();
