import { Formula } from "./types";

export const formulasData: Formula[] = [
  // ==========================================
  // CATEGORY 1: Mathematics (Arithmetic & Geometry) (1 - 50)
  // ==========================================
  {
    id: 1,
    title: "Area of a Circle",
    formula: "$$A = kr$$",
    description: "Calculates the total region enclosed within a circle of radius r.",
    category: "Mathematics"
  },
  {
    id: 2,
    title: "Circumference of a Circle",
    formula: "$$C = 2\\pi r$$",
    description: "Calculates the perimeter or boundary distance around a circle.",
    category: "Mathematics"
  },
  {
    id: 3,
    title: "Area of a Triangle",
    formula: "$$A = \\frac{1}{2} b h$$",
    description: "Finds the area of any triangle given its base b and height h.",
    category: "Mathematics"
  },
  {
    id: 4,
    title: "Pythagorean Theorem",
    formula: "$$a^2 + b^2 = c^2$$",
    description: "Relates the three sides of a right-angled triangle.",
    category: "Mathematics"
  },
  {
    id: 5,
    title: "Area of a Rectangle",
    formula: "$$A = l \\cdot w$$",
    description: "Calculates area of a rectangle of length l and width w.",
    category: "Mathematics"
  },
  {
    id: 6,
    title: "Perimeter of a Rectangle",
    formula: "$$P = 2(l + w)$$",
    description: "Determines boundary length of a rectangle.",
    category: "Mathematics"
  },
  {
    id: 7,
    title: "Trigonometric Sine Ratio",
    formula: "$$\\sin(\\theta) = \\frac{\\text{Opposite}}{\\text{Hypotenuse}}$$",
    description: "Defines sine of an angle in a right triangle.",
    category: "Mathematics"
  },
  {
    id: 8,
    title: "Trigonometric Cosine Ratio",
    formula: "$$\\cos(\\theta) = \\frac{\\text{Adjacent}}{\\text{Hypotenuse}}$$",
    description: "Defines cosine of an angle in a right triangle.",
    category: "Mathematics"
  },
  {
    id: 9,
    title: "Trigonometric Tangent Ratio",
    formula: "$$\\tan(\\theta) = \\frac{\\text{Opposite}}{\\text{Adjacent}}$$",
    description: "Defines tangent of an angle in a right triangle.",
    category: "Mathematics"
  },
  {
    id: 10,
    title: "Law of Sines",
    formula: "$$\\frac{a}{\\sin(A)} = \\frac{b}{\\sin(B)} = \\frac{c}{\\sin(C)}$$",
    description: "Relates sides and angles of any general triangle.",
    category: "Mathematics"
  },
  {
    id: 11,
    title: "Law of Cosines",
    formula: "$$c^2 = a^2 + b^2 - 2ab \\cos(C)$$",
    description: "An extension of Pythagorean theorem for general triangles.",
    category: "Mathematics"
  },
  {
    id: 12,
    title: "Heron's Formula",
    formula: "$$A = \\sqrt{s(s-a)(s-b)(s-c)}$$",
    description: "Calculates area of a triangle given all three side lengths.",
    category: "Mathematics"
  },
  {
    id: 13,
    title: "Triangle Semi-perimeter",
    formula: "$$s = \\frac{a + b + c}{2}$$",
    description: "Used in Heron's formula; equals half of triangle's perimeter.",
    category: "Mathematics"
  },
  {
    id: 14,
    title: "Area of a Trapezoid",
    formula: "$$A = \\frac{a+b}{2} \\cdot h$$",
    description: "Finds the area of a trapezoid with parallel sides a, b and height h.",
    category: "Mathematics"
  },
  {
    id: 15,
    title: "Area of a Parallelogram",
    formula: "$$A = b \\cdot h$$",
    description: "Computes area of a parallelogram with base b and height h.",
    category: "Mathematics"
  },
  {
    id: 16,
    title: "Volume of a Sphere",
    formula: "$$V = \\frac{4}{3} \\pi r^3$$",
    description: "Three-dimensional space occupied by a sphere of radius r.",
    category: "Mathematics"
  },
  {
    id: 17,
    title: "Surface Area of a Sphere",
    formula: "$$A = 4\\pi r^2$$",
    description: "Total outer surface area of a spherical body.",
    category: "Mathematics"
  },
  {
    id: 18,
    title: "Volume of a Cylinder",
    formula: "$$V = \\pi r^2 h$$",
    description: "Capacity of a circular cylinder of radius r and height h.",
    category: "Mathematics"
  },
  {
    id: 19,
    title: "Surface Area of a Cylinder",
    formula: "$$A = 2\\pi r h + 2\\pi r^2$$",
    description: "Total area of lateral walls and two flat circular baseline caps.",
    category: "Mathematics"
  },
  {
    id: 20,
    title: "Volume of a Cone",
    formula: "$$V = \\frac{1}{3} \\pi r^2 h$$",
    description: "Enclosed volume of a circular cone with base r and height h.",
    category: "Mathematics"
  },
  {
    id: 21,
    title: "Surface Area of a Cone",
    formula: "$$A = \\pi r(r + \\sqrt{h^2 + r^2})$$",
    description: "Total area encompassing the circular base and sloped side walls.",
    category: "Mathematics"
  },
  {
    id: 22,
    title: "Euler's Polyhedron Formula",
    formula: "$$V - E + F = 2$$",
    description: "Relates vertices, edges, and faces of a convex polyhedron.",
    category: "Mathematics"
  },
  {
    id: 23,
    title: "2D Midpoint Formula",
    formula: "$$M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)$$",
    description: "Calculates the central coordinate between two given Cartesian points.",
    category: "Mathematics"
  },
  {
    id: 24,
    title: "Distance Formula (2D)",
    formula: "$$d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$$",
    description: "Determines the straight-line distance between two coordinates in a plane.",
    category: "Mathematics"
  },
  {
    id: 25,
    title: "Slope of a Line",
    formula: "$$m = \\frac{y_2 - y_1}{x_2 - x_1}$$",
    description: "Measures steepness and direction of a straight line passing through two points.",
    category: "Mathematics"
  },
  {
    id: 26,
    title: "Slope-Intercept Equation of Line",
    formula: "$$y = mx + b$$",
    description: "Straight line equation defined by its slope m and y-intercept b.",
    category: "Mathematics"
  },
  {
    id: 27,
    title: "Point-Slope Equation of Line",
    formula: "$$y - y_1 = m(x - x_1)$$",
    description: "Expresses a line matching slope m through a specific coordinate.",
    category: "Mathematics"
  },
  {
    id: 28,
    title: "General Linear Equation",
    formula: "$$Ax + By + C = 0$$",
    description: "Standard general equation of a 2D line.",
    category: "Mathematics"
  },
  {
    id: 29,
    title: "Pythagorean Trigonometric Identity",
    formula: "$$\\sin^2(\\theta) + \\cos^2(\\theta) = 1$$",
    description: "Fundamental correlation between trigonometric sine and cosine.",
    category: "Mathematics"
  },
  {
    id: 30,
    title: "Tangent Identity",
    formula: "$$\\tan(\\theta) = \\frac{\\sin(\\theta)}{\\cos(\\theta)}$$",
    description: "Expresses tangent in terms of sine and cosine.",
    category: "Mathematics"
  },
  {
    id: 31,
    title: "Secant Pythagorean Identity",
    formula: "$$1 + \\tan^2(\\theta) = \\sec^2(\\theta)$$",
    description: "Trigonometric relation linking tangent and secant functions.",
    category: "Mathematics"
  },
  {
    id: 32,
    title: "Cosecant Pythagorean Identity",
    formula: "$$1 + \\cot^2(\\theta) = \\csc^2(\\theta)$$",
    description: "Relates cotangent and cosecant identities.",
    category: "Mathematics"
  },
  {
    id: 33,
    title: "Angle Sum for Sine",
    formula: "$$\\sin(A + B) = \\sin(A)\\cos(B) + \\cos(A)\\sin(B)$$",
    description: "Expands sine of sum of two distinct angular inputs.",
    category: "Mathematics"
  },
  {
    id: 34,
    title: "Angle Difference for Sine",
    formula: "$$\\sin(A - B) = \\sin(A)\\cos(B) - \\cos(A)\\sin(B)$$",
    description: "Subtracts angular values within standard sine functions.",
    category: "Mathematics"
  },
  {
    id: 35,
    title: "Angle Sum for Cosine",
    formula: "$$\\cos(A + B) = \\cos(A)\\cos(B) - \\sin(A)\\sin(B)$$",
    description: "Expands standard cosine functionality on sum of angles.",
    category: "Mathematics"
  },
  {
    id: 36,
    title: "Angle Difference for Cosine",
    formula: "$$\\cos(A - B) = \\cos(A)\\cos(B) + \\sin(A)\\sin(B)$$",
    description: "Computes cosine of difference of angles.",
    category: "Mathematics"
  },
  {
    id: 37,
    title: "Double Angle for Sine",
    formula: "$$\\sin(2\\theta) = 2\\sin(\\theta)\\cos(\\theta)$$",
    description: "Trigonometric simplification of 2theta angular state under sine.",
    category: "Mathematics"
  },
  {
    id: 38,
    title: "Double Angle for Cosine",
    formula: "$$\\cos(2\\theta) = \\cos^2(\\theta) - \\sin^2(\\theta)$$",
    description: "Main simplification equations for cosine's doubled angles.",
    category: "Mathematics"
  },
  {
    id: 39,
    title: "Double Angle for Tangent",
    formula: "$$\\tan(2\\theta) = \\frac{2\\tan(\\theta)}{1 - \\tan^2(\\theta)}$$",
    description: "Resolves double angles of tangent operations.",
    category: "Mathematics"
  },
  {
    id: 40,
    title: "Half-Angle of Sine",
    formula: "$$\\sin^2\\left(\\frac{\\theta}{2}\\right) = \\frac{1 - \\cos(\\theta)}{2}$$",
    description: "Determines sine values at half of standard input angle.",
    category: "Mathematics"
  },
  {
    id: 41,
    title: "Half-Angle of Cosine",
    formula: "$$\\cos^2\\left(\\frac{\\theta}{2}\\right) = \\frac{1 + \\cos(\\theta)}{2}$$",
    description: "Simplifies cosine expressions utilizing half angles.",
    category: "Mathematics"
  },
  {
    id: 42,
    title: "Area of a Regular Polygon",
    formula: "$$A = \\frac{1}{2} P \\cdot a$$",
    description: "Enclosed region given polygon perimeter P and apothem a.",
    category: "Mathematics"
  },
  {
    id: 43,
    title: "Circular Arc Length",
    formula: "$$s = r \\cdot \\theta$$",
    description: "Measures distance of arc swept by angle theta in radians.",
    category: "Mathematics"
  },
  {
    id: 44,
    title: "Circular Sector Area",
    formula: "$$A = \\frac{1}{2} r^2 \\theta$$",
    description: "Determines the slice area formatted by angle theta (radians).",
    category: "Mathematics"
  },
  {
    id: 45,
    title: "Polygon Interior Angles Sum",
    formula: "$$S = (n - 2) \\cdot 180^\\circ$$",
    description: "Sum total of all internal angles inside any n-sided simple polygon.",
    category: "Mathematics"
  },
  {
    id: 46,
    title: "Individual Regular Polygon Interior Angle",
    formula: "$$I = \\frac{(n-2) \\cdot 180^\\circ}{n}$$",
    description: "Each interior angle of an equilateral and equiangular polygon.",
    category: "Mathematics"
  },
  {
    id: 47,
    title: "Exterior Angle of Regular Polygon",
    formula: "$$E = \\frac{360^\\circ}{n}$$",
    description: "Measures exterior angle swept by an n-sided regular polygon shape.",
    category: "Mathematics"
  },
  {
    id: 48,
    title: "Section (Internal Ratio) Formula",
    formula: "$$P = \\left(\\frac{mx_2+nx_1}{m+n}, \\frac{my_2+ny_1}{m+n}\\right)$$",
    description: "Finds coordinates dividing a line segment in internal ratio m:n.",
    category: "Mathematics"
  },
  {
    id: 49,
    title: "Area of an Ellipse",
    formula: "$$A = \\pi a b$$",
    description: "Total regional area of an ellipse with semi-major axes a and b.",
    category: "Mathematics"
  },
  {
    id: 50,
    title: "Volume of a Uniform Prism",
    formula: "$$V = A_b \\cdot h$$",
    description: "Finds the volume of a prism given baseline cross-sectional area and height.",
    category: "Mathematics"
  },

  // ==========================================
  // CATEGORY 2: Algebra (51 - 100)
  // ==========================================
  {
    id: 51,
    title: "Quadratic Equation Solution Formulation",
    formula: "$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$",
    description: "Finds roots of quadratic polynomial expressions of the type ax^2 + bx + c = 0.",
    category: "Algebra"
  },
  {
    id: 52,
    title: "Discriminant of Quadratic Function",
    formula: "$$\\Delta = b^2 - 4ac$$",
    description: "Indicates quantity/nature of roots inside general quadratics.",
    category: "Algebra"
  },
  {
    id: 53,
    title: "Slope of Linear Function",
    formula: "$$y = mx + b$$",
    description: "Primary linear algebraic equation format.",
    category: "Algebra"
  },
  {
    id: 54,
    title: "Arithmetic Series Common Term",
    formula: "$$a_n = a_1 + (n - 1)d$$",
    description: "Finds nth element value inside continuous arithmetic sequences.",
    category: "Algebra"
  },
  {
    id: 55,
    title: "Sum of Arithmetic Series",
    formula: "$$S_n = \\frac{n}{2}(a_1 + a_n)$$",
    description: "Accumulates total sum of first n terms in an arithmetic progression.",
    category: "Algebra"
  },
  {
    id: 56,
    title: "Geometric Progression Term",
    formula: "$$a_n = a_1 \\cdot r^{n-1}$$",
    description: "Determines nth element of standard exponents geometric series.",
    category: "Algebra"
  },
  {
    id: 57,
    title: "Sum of Finite Geometric Series",
    formula: "$$S_n = \\frac{a_1(1 - r^n)}{1 - r}$$",
    description: "Calculates combined list values of a finite geometric sequence.",
    category: "Algebra"
  },
  {
    id: 58,
    title: "Infinite Geometric Series Convergence",
    formula: "$$S = \\frac{a_1}{1 - r}$$",
    description: "Aggregate sum of infinite geometric series where absolute ratio is below 1.",
    category: "Algebra"
  },
  {
    id: 59,
    title: "Difference of Perfect Squares",
    formula: "$$a^2 - b^2 = (a-b)(a+b)$$",
    description: "Factors the algebraic difference between squared variables.",
    category: "Algebra"
  },
  {
    id: 60,
    title: "Perfect Square Expansion (Sum)",
    formula: "$$(a+b)^2 = a^2 + 2ab + b^2$$",
    description: "Expands binomial sums raised to power of 2.",
    category: "Algebra"
  },
  {
    id: 61,
    title: "Perfect Square Expansion (Difference)",
    formula: "$$(a-b)^2 = a^2 - 2ab + b^2$$",
    description: "Expands binomial differences raised to power of 2.",
    category: "Algebra"
  },
  {
    id: 62,
    title: "Sum of Perfect Cubes factorization",
    formula: "$$a^3 + b^3 = (a+b)(a^2 - ab + b^2)$$",
    description: "Decomposes perfect cubed algebraic sums.",
    category: "Algebra"
  },
  {
    id: 63,
    title: "Difference of Perfect Cubes factorization",
    formula: "$$a^3 - b^3 = (a-b)(a^2 + ab + b^2)$$",
    description: "Decomposes perfect cubed algebraic differences.",
    category: "Algebra"
  },
  {
    id: 64,
    title: "Completing the Square Identity",
    formula: "$$ax^2 + bx + c = a\\left(x + \\frac{b}{2a}\\right)^2 + c - \\frac{b^2}{4a}$$",
    description: "Transforms a standard quadratic into vertex form format.",
    category: "Algebra"
  },
  {
    id: 65,
    title: "Binomial Theorem Expansion",
    formula: "$$(x+y)^n = \\sum_{k=0}^{n} \\binom{n}{k} x^{n-k} y^k$$",
    description: "Expands exponential powers of any binomial polynomial.",
    category: "Algebra"
  },
  {
    id: 66,
    title: "Binomial Coefficient Counting",
    formula: "$$\\binom{n}{k} = \\frac{n!}{k!(n-k)!}$$",
    description: "Combinatorial calculation of ways to choose k items raw out of n elements.",
    category: "Algebra"
  },
  {
    id: 67,
    title: "Logarithm Product Identification Rule",
    formula: "$$\\log_b(xy) = \\log_b(x) + \\log_b(y)$$",
    description: "Converts multiplier variables inner logs into additive states.",
    category: "Algebra"
  },
  {
    id: 68,
    title: "Logarithm Division Identification Rule",
    formula: "$$\\log_b\\left(\\frac{x}{y}\\right) = \\log_b(x) - \\log_b(y)$$",
    description: "Converts fractions log states into comparative subtraction.",
    category: "Algebra"
  },
  {
    id: 69,
    title: "Logarithm Pow Rule",
    formula: "$$\\log_b(x^k) = k \\log_b(x)$$",
    description: "Extracts exponents of arguments outwards to scale operations.",
    category: "Algebra"
  },
  {
    id: 70,
    title: "Logarithmic Base Shift Formula",
    formula: "$$\\log_b(x) = \\frac{\\log_c(x)}{\\log_c(b)}$$",
    description: "Converts any standard base b logarithm into generic base c expressions.",
    category: "Algebra"
  },
  {
    id: 71,
    title: "Exponential and Logarithmic Relation",
    formula: "$$b^{\\log_b(x)} = x$$",
    description: "The reciprocal cancellation nature between exponents and logs.",
    category: "Algebra"
  },
  {
    id: 72,
    title: "Matrix Determinant (2x2 Matrix)",
    formula: "$$\\det(A) = ad - bc$$",
    description: "Computes the scale scalar of a 2x2 matrix variable list.",
    category: "Algebra"
  },
  {
    id: 73,
    title: "Reciprocal 2x2 Matrix Inverse",
    formula: "$$A^{-1} = \\frac{1}{ad-bc} \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}$$",
    description: "The calculation map to solve invertibility inside 2D matrices.",
    category: "Algebra"
  },
  {
    id: 74,
    title: "Symmetric Vector Dot Product",
    formula: "$$\\mathbf{a} \\cdot \\mathbf{b} = a_x b_x + a_y b_y + a_z b_z$$",
    description: "Calculates projection scale of two discrete vectors.",
    category: "Algebra"
  },
  {
    id: 75,
    title: "Determinant representation of Matrix (3x3)",
    formula: "$$\\det(A) = a(ei-fh) - b(di-fg) + c(dh-eg)$$",
    description: "Resolves scalar determinant calculations for a 3x3 dimensional matrix.",
    category: "Algebra"
  },
  {
    id: 76,
    title: "Permutations Calculation (Sequence Matter)",
    formula: "$$P(n, k) = \\frac{n!}{(n-k)!}$$",
    description: "Ordered pick structures of k outputs from n possibilities.",
    category: "Algebra"
  },
  {
    id: 77,
    title: "Combinations Calculation (Sequence No Matter)",
    formula: "$$C(n, k) = \\frac{n!}{k!(n-k)!}$$",
    description: "Unordered subsets creation equation counts.",
    category: "Algebra"
  },
  {
    id: 78,
    title: "Absolute Value Piecewise definition",
    formula: "$$|x| = \\begin{cases} x & \\text{if } x \\ge 0 \\\\ -x & \\text{if } x < 0 \\end{cases}$$",
    description: "Algebraic definition of variable's non-negative scalar modulus.",
    category: "Algebra"
  },
  {
    id: 79,
    title: "Complex Number Polar Representation",
    formula: "$$z = r(\\cos(\\theta) + i\\sin(\\theta))$$",
    description: "Converts real and imaginary parts into radial and angle representation.",
    category: "Algebra"
  },
  {
    id: 80,
    title: "De Moivre's Theorem",
    formula: "$$z^n = r^n(\\cos(n\\theta) + i\\sin(n\\theta))$$",
    description: "Computes exponents of complex numeric values represented circularly.",
    category: "Algebra"
  },
  {
    id: 81,
    title: "Euler's Formula Relationship",
    formula: "$$e^{i\\theta} = \\cos(\\theta) + i\\sin(\\theta)$$",
    description: "Bridges trigonometric identities with complex exponents.",
    category: "Algebra"
  },
  {
    id: 82,
    title: "Vieta's Formulas (Quadratic)",
    formula: "$$x_1 + x_2 = -\\frac{b}{a}, \\quad x_1 x_2 = \\frac{c}{a}$$",
    description: "Relates polynomial root sums and products directly to core coefficients.",
    category: "Algebra"
  },
  {
    id: 83,
    title: "Partial Fraction Decomposition (Simple Linear)",
    formula: "$$\\frac{px+q}{(x-a)(x-b)} = \\frac{A}{x-a} + \\frac{B}{x-b}$$",
    description: "Splits rational algebraic fractions into easily calculable components.",
    category: "Algebra"
  },
  {
    id: 84,
    title: "Cramer's Rule for Solving Systems",
    formula: "$$x_i = \\frac{\\det(A_i)}{\\det(A)}$$",
    description: "Solves linear equation matrices using determinant divisions.",
    category: "Algebra"
  },
  {
    id: 85,
    title: "Rational Root Theorem Setup",
    formula: "$$\\text{Possible Roots} = \\pm \\frac{\\text{Factors of } a_0}{\\text{Factors of } a_n}$$",
    description: "Narrows rational search candidates for high degree polynomial roots.",
    category: "Algebra"
  },
  {
    id: 86,
    title: "Sum of First n Natural Integers",
    formula: "$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$",
    description: "Computes sum of consecutive digits from 1 to n.",
    category: "Algebra"
  },
  {
    id: 87,
    title: "Sum of Squares of n Natural Integers",
    formula: "$$\\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}$$",
    description: "Arithmetic equation aggregating continuous squared natural numbers.",
    category: "Algebra"
  },
  {
    id: 88,
    title: "Sum of Cubes of n Natural Integers",
    formula: "$$\\sum_{i=1}^{n} i^3 = \\left[\\frac{n(n+1)}{2}\\right]^2$$",
    description: "The square of cumulative natural numbers equal to aggregate cubes.",
    category: "Algebra"
  },
  {
    id: 89,
    title: "Symmetric Exponent Identity 1",
    formula: "$$x^a \\cdot x^b = x^{a+b}$$",
    description: "Exponential properties when multiplying identical bases.",
    category: "Algebra"
  },
  {
    id: 90,
    title: "Symmetric Exponent Identity 2",
    formula: "$$\\frac{x^a}{x^b} = x^{a-b}$$",
    description: "Exponential properties when dividing identical bases.",
    category: "Algebra"
  },
  {
    id: 91,
    title: "Power of Power Exponent Rule",
    formula: "$$(x^a)^b = x^{ab}$$",
    description: "Bases raised to nested series exponent expressions.",
    category: "Algebra"
  },
  {
    id: 92,
    title: "Negative Exponent Inverse",
    formula: "$$x^{-a} = \\frac{1}{x^a}$$",
    description: "Negative exponents represent division inverted positions.",
    category: "Algebra"
  },
  {
    id: 93,
    title: "Fractional Exponent Radicals Rule",
    formula: "$$x^{a/b} = \\sqrt[b]{x^a}$$",
    description: "Translates exponential fractions into nested radical roots.",
    category: "Algebra"
  },
  {
    id: 94,
    title: "Zero Exponent Uniform Rule",
    formula: "$$x^0 = 1 \\quad (x \\ne 0)$$",
    description: "Any non-zero algebraic term raised to power of zero equals one.",
    category: "Algebra"
  },
  {
    id: 95,
    title: "Pascal's Triangle Binomial Entry Relationship",
    formula: "$$\\binom{n}{k} + \\binom{n}{k-1} = \\binom{n+1}{k}$$",
    description: "Additive core mechanics governing Pascal's visual triangle rows.",
    category: "Algebra"
  },
  {
    id: 96,
    title: "Logarithmic Identity For Multiplier Inverse",
    formula: "$$\\log_b\\left(\\frac{1}{x}\\right) = -\\log_b(x)$$",
    description: "Inverse fractions mirror negating logarithmic values.",
    category: "Algebra"
  },
  {
    id: 97,
    title: "Change of Log Index Location Identity",
    formula: "$$a^{\\log_b(c)} = c^{\\log_b(a)}$$",
    description: "Interchanges exponent base and inner logarithmic variable.",
    category: "Algebra"
  },
  {
    id: 98,
    title: "Descartes' Rule of Signs Limit Bounds",
    formula: "$$f(x) = a_n x^n + \\dots + a_0$$",
    description: "Analyzes systemic polynomial equation root change patterns.",
    category: "Algebra"
  },
  {
    id: 99,
    title: "Matrix Trace Definition Formula",
    formula: "$$\\text{Tr}(A) = \\sum_{i=1}^{n} a_{ii}$$",
    description: "Aggregates overall linear values diagonal down across matrix bounds.",
    category: "Algebra"
  },
  {
    id: 100,
    title: "Standard Cartesian Circle General Equation",
    formula: "$$(x - h)^2 + (y - k)^2 = r^2$$",
    description: "Circle of radius r centered on coordinates (h, k).",
    category: "Algebra"
  },

  // ==========================================
  // CATEGORY 3: Higher Mathematics (Calculus & Vectors) (101 - 150)
  // ==========================================
  {
    id: 101,
    title: "Definition of a Derivative by Limit",
    formula: "$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$",
    description: "Fundamental formal definition of instant rate change at a point.",
    category: "Higher Mathematics"
  },
  {
    id: 102,
    title: "Power Rule of Differentiation",
    formula: "$$\\frac{d}{dx}[x^n] = n x^{n-1}$$",
    description: "Calculates derivatives of algebraic power equations quickly.",
    category: "Higher Mathematics"
  },
  {
    id: 103,
    title: "Product Rule of Differentiation",
    formula: "$$\\frac{d}{dx}[u \\cdot v] = u'v + uv'$$",
    description: "Differentiates two multiplied functional variables.",
    category: "Higher Mathematics"
  },
  {
    id: 104,
    title: "Quotient Rule of Differentiation",
    formula: "$$\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u'v - uv'}{v^2}$$",
    description: "Differentiates division setups involving fractional variables.",
    category: "Higher Mathematics"
  },
  {
    id: 105,
    title: "Chain Rule of Composition",
    formula: "$$\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$$",
    description: "Processes derivatives of nested functional loops.",
    category: "Higher Mathematics"
  },
  {
    id: 106,
    title: "Derivative of Natural Exponential",
    formula: "$$\\frac{d}{dx}[e^x] = e^x$$",
    description: "The unique calculus state where derivative of the function is itself.",
    category: "Higher Mathematics"
  },
  {
    id: 107,
    title: "Derivative of Natural Logarithm",
    formula: "$$\\frac{d}{dx}[\\ln(x)] = \\frac{1}{x}$$",
    description: "The differential rate of change of the natural log function.",
    category: "Higher Mathematics"
  },
  {
    id: 108,
    title: "Derivative of Sinusoid Functions",
    formula: "$$\\frac{d}{dx}[\\sin(x)] = \\cos(x)$$",
    description: "Calculates instantaneous rate of change of trigonometric sine.",
    category: "Higher Mathematics"
  },
  {
    id: 109,
    title: "Derivative of Cosine Functions",
    formula: "$$\\frac{d}{dx}[\\cos(x)] = -\\sin(x)$$",
    description: "Calculates rate of change of trigonometric cosine.",
    category: "Higher Mathematics"
  },
  {
    id: 110,
    title: "Derivative of Tangent Functions",
    formula: "$$\\frac{d}{dx}[\\tan(x)] = \\sec^2(x)$$",
    description: "Finds derivative of trigonometric tangent functions.",
    category: "Higher Mathematics"
  },
  {
    id: 111,
    title: "Power Integration Inverse Formula",
    formula: "$$\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\ne -1)$$",
    description: "Integrates algebraic standard exponential functions.",
    category: "Higher Mathematics"
  },
  {
    id: 112,
    title: "Logarithmic Reciprocal Integral",
    formula: "$$\\int \\frac{1}{x} \\, dx = \\ln|x| + C$$",
    description: "Resolves integration of absolute reciprocal variables.",
    category: "Higher Mathematics"
  },
  {
    id: 113,
    title: "Integral of Natural Exponential",
    formula: "$$\\int e^x \\, dx = e^x + C$$",
    description: "Anti-derivative of natural base exponential functions.",
    category: "Higher Mathematics"
  },
  {
    id: 114,
    title: "Fundamental Theorem of Calculus (Evaluation)",
    formula: "$$\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)$$",
    description: "Evaluates definite integral values within bounds [a, b] given antiderivative F.",
    category: "Higher Mathematics"
  },
  {
    id: 115,
    title: "Integration by Parts Formula",
    formula: "$$\\int u \\, dv = uv - \\int v \\, du$$",
    description: "Calculus integration method reversing the functional product rule.",
    category: "Higher Mathematics"
  },
  {
    id: 116,
    title: "Average Value of a Function",
    formula: "$$\\bar{f} = \\frac{1}{b-a} \\int_{a}^{b} f(x) \\, dx$$",
    description: "Computes mean analytical value of continuous function on [a, b].",
    category: "Higher Mathematics"
  },
  {
    id: 117,
    title: "Arc Length of a Curve",
    formula: "$$L = \\int_{a}^{b} \\sqrt{1 + [f'(x)]^2} \\, dx$$",
    description: "Determines physical curved length over bounds using integration.",
    category: "Higher Mathematics"
  },
  {
    id: 118,
    title: "Volume of Solids of Revolution (Disk Method)",
    formula: "$$V = \\pi \\int_{a}^{b} [f(x)]^2 \\, dx$$",
    description: "Calculates rotational volumes spun around primary coordinate axes.",
    category: "Higher Mathematics"
  },
  {
    id: 119,
    title: "Taylor Series expansion about point a",
    formula: "$$f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!} (x-a)^n$$",
    description: "Approximates high-level analytic functions using infinite polynomial sums.",
    category: "Higher Mathematics"
  },
  {
    id: 120,
    title: "Maclaurin Series expansion",
    formula: "$$f(x) = f(0) + f'(0)x + \\frac{f''(0)}{2!}x^2 + \\dots$$",
    description: "Specialized Taylor series expansion centered strictly at x = 0.",
    category: "Higher Mathematics"
  },
  {
    id: 121,
    title: "Vector Magnitude calculation",
    formula: "$$|\\mathbf{v}| = \\sqrt{v_x^2 + v_y^2 + v_z^2}$$",
    description: "Finds direct geometric scalar length of a 3D vector.",
    category: "Higher Mathematics"
  },
  {
    id: 122,
    title: "Vector Angle Formulation via Dot Product",
    formula: "$$\\cos(\\theta) = \\frac{\\mathbf{a} \\cdot \\mathbf{b}}{|\\mathbf{a}| |\\mathbf{b}|}$$",
    description: "Calculates angular distance separator separating vector lines.",
    category: "Higher Mathematics"
  },
  {
    id: 123,
    title: "Vector Cross Product matrix determinant form",
    formula: "$$\\mathbf{a} \\times \\mathbf{b} = \\det \\begin{bmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ a_x & a_y & a_z \\\\ b_x & b_y & b_z \\end{bmatrix}$$",
    description: "Processes perpendicular 3D vector outputs from two vector inputs.",
    category: "Higher Mathematics"
  },
  {
    id: 124,
    title: "Unit Vector Creation",
    formula: "$$\\hat{\\mathbf{u}} = \\frac{\\mathbf{v}}{|\\mathbf{v}|}$$",
    description: "Normalizes direction vectors to have exact scalar length of one.",
    category: "Higher Mathematics"
  },
  {
    id: 125,
    title: "Equation of a Plane in 3D Space",
    formula: "$$A(x-x_0) + B(y-y_0) + C(z-z_0) = 0$$",
    description: "Generates flat planes perpendicular to normal vector [A, B, C].",
    category: "Higher Mathematics"
  },
  {
    id: 126,
    title: "Gradient vector of Scalar Field",
    formula: "$$\\nabla f = \\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\partial f}{\\partial z}\\right)$$",
    description: "Measures rates of multi-variable spatial direction changes.",
    category: "Higher Mathematics"
  },
  {
    id: 127,
    title: "Divergence vector operation",
    formula: "$$\\nabla \\cdot \\mathbf{F} = \\frac{\\partial F_x}{\\partial x} + \\frac{\\partial F_y}{\\partial y} + \\frac{\\partial F_z}{\\partial z}$$",
    description: "Measures net volume flux outflow densities within flow fields.",
    category: "Higher Mathematics"
  },
  {
    id: 128,
    title: "Curl vector operation rotation state",
    formula: "$$\\nabla \\times \\mathbf{F} = \\det \\begin{bmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ \\partial_x & \\partial_y & \\partial_z \\\\ F_x & F_y & F_z \\end{bmatrix}$$",
    description: "Measures localized rotatory speeds inside vector force fields.",
    category: "Higher Mathematics"
  },
  {
    id: 129,
    title: "First Order Linear Differential Equation",
    formula: "$$\\frac{dy}{dx} + P(x)y = Q(x)$$",
    description: "Linear continuous change problems solvable by integrating factors.",
    category: "Higher Mathematics"
  },
  {
    id: 130,
    title: "Integrating Factor method solver",
    formula: "$$I(x) = e^{\\int P(x) \\, dx}$$",
    description: "A scale multiplier function to balance standard linear differentials.",
    category: "Higher Mathematics"
  },
  {
    id: 131,
    title: "Laplace Transform of a Function",
    formula: "$$\\mathcal{L}\\{f(t)\\} = \\int_{0}^{\\infty} e^{-st} f(t) \\, dt$$",
    description: "Converts time domain equations into modular complex frequency domains.",
    category: "Higher Mathematics"
  },
  {
    id: 132,
    title: "Fourier Series Expansion (Periodic Function)",
    formula: "$$f(x) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} \\left(a_n \\cos(\\frac{n \\pi x}{L}) + b_n \\sin(\\frac{n \\pi x}{L})\\right)$$",
    description: "Expresses periodic wave formations using infinite sine/cosine sums.",
    category: "Higher Mathematics"
  },
  {
    id: 133,
    title: "Euler's Method (Numerical Integration Step)",
    formula: "$$y_{n+1} = y_n + h \\cdot f(x_n, y_n)$$",
    description: "Walks numerical approximation coordinates to solve unknown differential curves.",
    category: "Higher Mathematics"
  },
  {
    id: 134,
    title: "Double Integral over Area",
    formula: "$$V = \\iint_{R} f(x, y) \\, dA$$",
    description: "Integration across standard planes to determine 3D volumes.",
    category: "Higher Mathematics"
  },
  {
    id: 135,
    title: "Green's Theorem conversion",
    formula: "$$\\oint_{C} (P \\, dx + Q \\, dy) = \\iint_{D} \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) \\, dA$$",
    description: "Bridges line integrals encircling planar boundaries directly into area integrals.",
    category: "Higher Mathematics"
  },
  {
    id: 136,
    title: "Stoke's Theorem conversion",
    formula: "$$\\oint_{\\partial S} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_{S} (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S}$$",
    description: "Bridges boundary curve integrations with vector field surface curl states.",
    category: "Higher Mathematics"
  },
  {
    id: 137,
    title: "Divergence Theorem conversion",
    formula: "$$\\iint_{S} \\mathbf{F} \\cdot d\\mathbf{S} = \\iiint_{V} (\\nabla \\times \\mathbf{F}) \\, dV$$",
    description: "Relates solid volume divergence metrics to surface field flow.",
    category: "Higher Mathematics"
  },
  {
    id: 138,
    title: "Arc Length derivation of Vector Curve",
    formula: "$$s(t) = \\int_{a}^{t} |\\mathbf{r}'(u)| \\, du$$",
    description: "Measures lengths swept along parametric curves.",
    category: "Higher Mathematics"
  },
  {
    id: 139,
    title: "Limit Definition of Transcendental e",
    formula: "$$e = \\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n$$",
    description: "Underlying continuous compound mathematical limit defining base e.",
    category: "Higher Mathematics"
  },
  {
    id: 140,
    title: "Jacobian Matrix Determinant (2D Transformation)",
    formula: "$$J = \\frac{\\partial(x, y)}{\\partial(u, v)} = \\det \\begin{bmatrix} \\frac{\\partial x}{\\partial u} & \\frac{\\partial x}{\\partial v} \\\\ \\frac{\\partial y}{\\partial u} & \\frac{\\partial y}{\\partial v} \\end{bmatrix}$$",
    description: "Transforms multi-dimensional integrals to alternative coordinate bounds.",
    category: "Higher Mathematics"
  },
  {
    id: 141,
    title: "Work Integral definition",
    formula: "$$W = \\int_{C} \\mathbf{F} \\cdot d\\mathbf{r}$$",
    description: "Determines physical mechanical work executing along curved vectors.",
    category: "Higher Mathematics"
  },
  {
    id: 142,
    title: "Polar Double Integration Setup",
    formula: "$$\\iint_{R} f(x, y) \\, dx \\, dy = \\iint_{S} f(r\\cos\\theta, r\\sin\\theta) r \\, dr \\, d\\theta$$",
    description: "Resolves planar areas using circular coordinate geometry integrations.",
    category: "Higher Mathematics"
  },
  {
    id: 143,
    title: "Spherical Volume Integration element",
    formula: "$$dV = \\rho^2 \\sin(\\phi) \\, d\\rho \\, d\\theta \\, d\\phi$$",
    description: "Integrates spherical solid models coordinate transformations.",
    category: "Higher Mathematics"
  },
  {
    id: 144,
    title: "Newton-Raphson Root Approximations",
    formula: "$$x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}$$",
    description: "Rapidly converges linear iterations closer to exact function roots.",
    category: "Higher Mathematics"
  },
  {
    id: 145,
    title: "Secant Line Differentiation rate of rise",
    formula: "$$\\text{Average Rate} = \\frac{f(b) - f(a)}{b - a}$$",
    description: "Quantifies the gross change speed connecting separate coordinate bounds.",
    category: "Higher Mathematics"
  },
  {
    id: 146,
    title: "Integral of Sinusoid sin(x)",
    formula: "$$\\int \\sin(x) \\, dx = -\\cos(x) + C$$",
    description: "General trigonometric sine integration antiderivative resolution.",
    category: "Higher Mathematics"
  },
  {
    id: 147,
    title: "Integral of Cosine cos(x)",
    formula: "$$\\int \\cos(x) \\, dx = \\sin(x) + C$$",
    description: "General trigonometric cosine integration antiderivative resolution.",
    category: "Higher Mathematics"
  },
  {
    id: 148,
    title: "L'Hopital's Rule limit solver limit form",
    formula: "$$\\lim_{x \\to c} \\frac{f(x)}{g(x)} = \\lim_{x \\to c} \\frac{f'(x)}{g'(x)}$$",
    description: "Evaluates indeterminate 0/0 limit fractions using differentials.",
    category: "Higher Mathematics"
  },
  {
    id: 149,
    title: "Mean Value Theorem criterion",
    formula: "$$f'(c) = \\frac{f(b) - f(a)}{b - a}$$",
    description: "Assures curve slope matches secant chord slope somewhere on interval.",
    category: "Higher Mathematics"
  },
  {
    id: 150,
    title: "Curvature equation of parametric path",
    formula: "$$\\kappa = \\frac{|\\mathbf{r}'(t) \\times \\mathbf{r}''(t)|}{|\\mathbf{r}'(t)|^3}$$",
    description: "Determines instant turning curve tight bend factor in multi-dimensional space.",
    category: "Higher Mathematics"
  },

  // ==========================================
  // CATEGORY 4: Physics (151 - 200)
  // ==========================================
  {
    id: 151,
    title: "Newton's Second Law of Motion",
    formula: "$$\\mathbf{F} = m\\mathbf{a}$$",
    description: "Relates net external force vector acting on mass to its acceleration.",
    category: "Physics"
  },
  {
    id: 152,
    title: "Einstein's Mass-Energy Equivalence",
    formula: "$$E = m c^2$$",
    description: "Relates mass and energy, governed by velocity of light in vacuum squared.",
    category: "Physics"
  },
  {
    id: 153,
    title: "Newton's Universal Gravitation Law",
    formula: "$$F_g = G \\frac{m_1 m_2}{r^2}$$",
    description: "Magnitude of gravitational pull scale separating two planetary masses.",
    category: "Physics"
  },
  {
    id: 154,
    title: "Coulomb's Electrostatic Law",
    formula: "$$F_e = k_e \\frac{|q_1 q_2|}{r^2}$$",
    description: "Determines electrostatic attraction/repulsion separating charged particles.",
    category: "Physics"
  },
  {
    id: 155,
    title: "Ohm's Law of Resistance",
    formula: "$$V = I R$$",
    description: "Correlates voltage drop V to electric current I and circuit resistance R.",
    category: "Physics"
  },
  {
    id: 156,
    title: "Kinematic Equation 1: Velocity-Time",
    formula: "$$v_f = v_i + a t$$",
    description: "Solves constant-acceleration final straight line speeds over time.",
    category: "Physics"
  },
  {
    id: 157,
    title: "Kinematic Equation 2: Displacement-Time",
    formula: "$$d = v_i t + \\frac{1}{2} a t^2$$",
    description: "Finds displacement under linear acceleration with time parameters.",
    category: "Physics"
  },
  {
    id: 158,
    title: "Kinematic Equation 3: Velocity-Displacement",
    formula: "$$v_f^2 = v_i^2 + 2 a d$$",
    description: "Finds final speed ignoring transient timeline durations.",
    category: "Physics"
  },
  {
    id: 159,
    title: "Kinetic Energy function",
    formula: "$$E_k = \\frac{1}{2} m v^2$$",
    description: "Energy possessed by a moving particle of mass m at speed v.",
    category: "Physics"
  },
  {
    id: 160,
    title: "Gravitational Potential Energy",
    formula: "$$E_p = m g h$$",
    description: "Stored energy relative to height offset h in an acceleration field.",
    category: "Physics"
  },
  {
    id: 161,
    title: "Linear Momentum relation",
    formula: "$$\\mathbf{p} = m \\mathbf{v}$$",
    description: "Determines dynamic directional impact motion values of a body.",
    category: "Physics"
  },
  {
    id: 162,
    title: "Work Done by constant force",
    formula: "$$W = F d \\cos(\\theta)$$",
    description: "Mechanical energy transmission over linear offset distances d.",
    category: "Physics"
  },
  {
    id: 163,
    title: "Electric Power conversion",
    formula: "$$P = V I = I^2 R = \\frac{V^2}{R}$$",
    description: "Thermal/radiant electrical output generation rates over circuits.",
    category: "Physics"
  },
  {
    id: 164,
    title: "Centripetal Acceleration circular motion",
    formula: "$$a_c = \\frac{v^2}{r}$$",
    description: "Centrally oriented acceleration guiding a body spinning curvilinearly.",
    category: "Physics"
  },
  {
    id: 165,
    title: "Torque Equation rotary push",
    formula: "$$\\tau = r F \\sin(\\theta)$$",
    description: "Rotational vector forces sweeping angular moments around a pivot.",
    category: "Physics"
  },
  {
    id: 166,
    title: "Hooke's Elasticity spring Law",
    formula: "$$F_s = -k x$$",
    description: "Restorative physical force counteracting spring displacement.",
    category: "Physics"
  },
  {
    id: 167,
    title: "Ideal Gas State Equation",
    formula: "$$P V = n R T$$",
    description: "Relates thermodynamic states (Pressure, Volume, Temp) for an ideal gas.",
    category: "Physics"
  },
  {
    id: 168,
    title: "First Law of Thermodynamics",
    formula: "$$\\Delta U = Q - W$$",
    description: "Ensures thermal internal energy balances input heat minus work output.",
    category: "Physics"
  },
  {
    id: 169,
    title: "Wave Propagation Speed relation",
    formula: "$$v = f \\lambda$$",
    description: "Wave speed relative to frequency f and spatial wave length lambda.",
    category: "Physics"
  },
  {
    id: 170,
    title: "Snell's Law of Optical Refraction",
    formula: "$$n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)$$",
    description: "Refractive light bending pathways crossing different density barriers.",
    category: "Physics"
  },
  {
    id: 171,
    title: "Planck-Einstein Photon Energy formulation",
    formula: "$$E = h f$$",
    description: "Determines quantum packet energy relative to localized wave frequency.",
    category: "Physics"
  },
  {
    id: 172,
    title: "De Broglie Matter Wavelength relation",
    formula: "$$\\lambda = \\frac{h}{p}$$",
    description: "Assigns dual-wave nature properties to moving momentum particles.",
    category: "Physics"
  },
  {
    id: 173,
    title: "Maxwell's Electrostatic Ampere Gauss Law",
    formula: "$$\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}$$",
    description: "Spatially maps electric divergence lines outward from net charge densities.",
    category: "Physics"
  },
  {
    id: 174,
    title: "Maxwell's Solenoid Gauss Law of Magnetism",
    formula: "$$\\nabla \\cdot \\mathbf{B} = 0$$",
    description: "Asserts non-existence of magnetic monopoles in closed physical frames.",
    category: "Physics"
  },
  {
    id: 175,
    title: "Maxwell-Faraday Electromagnetic Induction Law",
    formula: "$$\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}$$",
    description: "Predicts electric vortex generation via changing magnetic flux.",
    category: "Physics"
  },
  {
    id: 176,
    title: "Maxwell-Ampere Circuit Law formulation",
    formula: "$$\\nabla \\times \\mathbf{B} = \\mu_0 \\left(\\mathbf{J} + \\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}\\right)$$",
    description: "Relates magnetism fields to electrical flows and changing displacement currents.",
    category: "Physics"
  },
  {
    id: 177,
    title: "Schrödinger Time-Independent Wave Equation",
    formula: "$$$\\hat{H}\\psi = E\\psi$$",
    description: "Fundamental quantum mechanical equation describing spatial wave states.",
    category: "Physics"
  },
  {
    id: 178,
    title: "Heisenberg's Uncertainty Principle limit",
    formula: "$$\\Delta x \\cdot \\Delta p \\ge \\frac{\\hbar}{2}$$",
    description: "Fundamental quantum limits to knowing position and momentum coordinates.",
    category: "Physics"
  },
  {
    id: 179,
    title: "Relativistic Expansion Time Dilation",
    formula: "$$\\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}}$$",
    description: "Lorentz factor scaling mechanical properties at relativistic speeds.",
    category: "Physics"
  },
  {
    id: 180,
    title: "Time Dilation relative motion",
    formula: "$$t' = \\gamma t$$",
    description: "Decelerated timescale passage observing fast moving frames.",
    category: "Physics"
  },
  {
    id: 181,
    title: "Relativistic Length Contraction",
    formula: "$$L' = \\frac{L}{\\gamma}$$",
    description: "Forecasts spatial compression lines along fast-moving relative directions.",
    category: "Physics"
  },
  {
    id: 182,
    title: "Lorentz Electromagnetic Force vector",
    formula: "$$\\mathbf{F} = q(\\mathbf{E} + \\mathbf{v} \\times \\mathbf{B})$$",
    description: "Aggregates combined electric and magnetic forces affecting active charges.",
    category: "Physics"
  },
  {
    id: 183,
    title: "Period of Simple Pendulum oscillation",
    formula: "$$T = 2\\pi \\sqrt{\\frac{L}{g}}$$",
    description: "Harmonic period of a pendulum under ideal gravity.",
    category: "Physics"
  },
  {
    id: 184,
    title: "Fluid Hydrostatic Pressure depth scale",
    formula: "$$P = \\rho g h$$",
    description: "Calculates weight-induced liquid forces at depths h.",
    category: "Physics"
  },
  {
    id: 185,
    title: "Bernoulli's Solid Fluid Flow Equilibrium",
    formula: "$$P + \\frac{1}{2} \\rho v^2 + \\rho g h = \\text{Constant}$$",
    description: "Conserves pressure, kinetics, and potential energies inside flowing liquids.",
    category: "Physics"
  },
  {
    id: 186,
    title: "Stefan-Boltzmann Blackbody Radiation Law",
    formula: "$$P = \\sigma A T^4$$",
    description: "Emitted heat energies radiated outwards from raw blackbodies.",
    category: "Physics"
  },
  {
    id: 187,
    title: "Wien's Displacement Radiation Heat Peak",
    formula: "$$\\lambda_{\\text{max}} T = b$$",
    description: "Correlates top emission wavelengths to blackbody temperature scales.",
    category: "Physics"
  },
  {
    id: 188,
    title: "Capacitance electrical storage ratio",
    formula: "$$C = \\frac{Q}{V}$$",
    description: "Measures charge collection capacities on capacitor plates.",
    category: "Physics"
  },
  {
    id: 189,
    title: "Parallel Plate Capacitance structural scale",
    formula: "$$C = \\frac{\\varepsilon_0 A}{d}$$",
    description: "Relates dimensions of parallel plates to storage capability.",
    category: "Physics"
  },
  {
    id: 190,
    title: "Magnetic Field intensity of Infinitely Long Wire",
    formula: "$$B = \\frac{\\mu_0 I}{2\\pi r}$$",
    description: "Calculates induced magnetic loops surrounding straight wire currents.",
    category: "Physics"
  },
  {
    id: 191,
    title: "Inductance electrical magnetic storage scale",
    formula: "$$V_L = L \\frac{dI}{dt}$$",
    description: "Counter-electric potential generated by inductive current changes.",
    category: "Physics"
  },
  {
    id: 192,
    title: "Carnot Thermal Engine Max Efficiency",
    formula: "$$\\eta_{\\text{max}} = 1 - \\frac{T_C}{T_H}$$",
    description: "Absolute theoretical performance boundaries converting heat into work.",
    category: "Physics"
  },
  {
    id: 193,
    title: "Linear Thermal Expansion coefficient",
    formula: "$$\\Delta L = \\alpha L_0 \\Delta T$$",
    description: "Predicts dimensional size changes under temperature swings.",
    category: "Physics"
  },
  {
    id: 194,
    title: "Doppler Sound Frequency Shift relative motion",
    formula: "$$f' = f \\left(\\frac{v \\pm v_o}{v \\mp v_s}\\right)$$",
    description: "Acoustic wavelength compressions observing moving sound generators.",
    category: "Physics"
  },
  {
    id: 195,
    title: "Einstein's Photoelectric Effect Threshold work",
    formula: "$$K_{\\text{max}} = hf - \\Phi$$",
    description: "Max kinetic energy threshold of emitted photoelectrons.",
    category: "Physics"
  },
  {
    id: 196,
    title: "Radioactive Half-Life Decay Rate",
    formula: "$$N(t) = N_0 e^{-\\lambda t}$$",
    description: "Predicts mass reduction curves of unstable nuclear elements over time.",
    category: "Physics"
  },
  {
    id: 197,
    title: "Kepler's Third Planetary Loop Law",
    formula: "$$T^2 = \\left( \\frac{4\\pi^2}{G M} \\right) a^3$$",
    description: "Ties orbital years directly to average planetary distance cubes.",
    category: "Physics"
  },
  {
    id: 198,
    title: "Escape Velocity planetary minimum boundary",
    formula: "$$v_e = \\sqrt{\\frac{2 G M}{r}}$$",
    description: "Inbound kinetic seed needed to break planetary gravity wells entirely.",
    category: "Physics"
  },
  {
    id: 199,
    title: "Magnetic Flux over physical area bounds",
    formula: "$$\\Phi_B = B \\cdot A \\cdot \\cos(\\theta)$$",
    description: "Quantifies magnetic lines tracing inside specific flat frames.",
    category: "Physics"
  },
  {
    id: 200,
    title: "Rutherford Alpha Scattering path boundaries",
    formula: "$$b = \\frac{z Z e^2}{4\\pi\\varepsilon_0 K} \\cot\\left(\\frac{\\theta}{2}\\right)$$",
    description: "Identifies deflection angles analyzing atom atomic nuclei structure.",
    category: "Physics"
  },

  // ==========================================
  // CATEGORY 5: Chemistry (201 - 250)
  // ==========================================
  {
    id: 201,
    title: "Chemical Solution Molarity definition",
    formula: "$$M = \\frac{n_{\\text{solute}}}{V_{\\text{solution}}}$$",
    description: "Quantifies chemical agent concentration in moles per liter.",
    category: "Chemistry"
  },
  {
    id: 202,
    title: "Logarithmic pH Acidity Formulation",
    formula: "$$\\text{pH} = -\\log_{10}[\\text{H}^+]$$",
    description: "Calculates hydrogen ion concentration to determine acidity/alkalinity.",
    category: "Chemistry"
  },
  {
    id: 203,
    title: "Logarithmic pOH Basicity Formulation",
    formula: "$$\\text{pOH} = -\\log_{10}[\\text{OH}^-]$$",
    description: "Measures alkaline hydroxide ion densities in solution.",
    category: "Chemistry"
  },
  {
    id: 204,
    title: "Aqueous Solution Auto-Ionization Constant",
    formula: "$$\\text{pH} + \\text{pOH} = 14 \\quad (25^\\circ\\text{C})$$",
    description: "The reciprocal acidic and basic balance in water limits.",
    category: "Chemistry"
  },
  {
    id: 205,
    title: "Henderson-Hasselbalch Buffer Equation",
    formula: "$$\\text{pH} = \\text{p}K_a + \\log_{10}\\left(\\frac{[\\text{A}^-]}{[\\text{HA}]}\\right)$$",
    description: "Estimates programmatic buffer solution acidity balances.",
    category: "Chemistry"
  },
  {
    id: 206,
    title: "Boyle's Gas Law correlation",
    formula: "$$P_1 V_1 = P_2 V_2$$",
    description: "Evaluates inverse pressure-volume changes at matching gas temperature.",
    category: "Chemistry"
  },
  {
    id: 207,
    title: "Charles' Gas Law correlation",
    formula: "$$\\frac{V_1}{T_1} = \\frac{V_2}{T_2}$$",
    description: "Evaluates standard volume transformations corresponding directly to warm scalar temperatures.",
    category: "Chemistry"
  },
  {
    id: 208,
    title: "Gay-Lussac's Gas Law correlation",
    formula: "$$\\frac{P_1}{T_1} = \\frac{P_2}{T_2}$$",
    description: "Forecasts pressure shifts direct proportional changes matching gas temperature changes.",
    category: "Chemistry"
  },
  {
    id: 209,
    title: "Avogadro's Gas Mole Law correlation",
    formula: "$$\\frac{V_1}{n_1} = \\frac{V_2}{n_2}$$",
    description: "Relates volume occupied directly to overall raw item molecular counts.",
    category: "Chemistry"
  },
  {
    id: 210,
    title: "Combined Gas Law system",
    formula: "$$\\frac{P_1 V_1}{T_1} = \\frac{P_2 V_2}{T_2}$$",
    description: "Blends multiple gas relationships into standard temperature pressure volume loops.",
    category: "Chemistry"
  },
  {
    id: 211,
    title: "Dalton's Partial Pressures gaseous mixture",
    formula: "$$P_{\\text{total}} = \\sum_{i=1}^{k} P_i$$",
    description: "Aggregates comparative force values swept by mixed individual gas species.",
    category: "Chemistry"
  },
  {
    id: 212,
    title: "Graham's Gas Gaseous Effusion Law",
    formula: "$$\\frac{\\text{Rate}_1}{\\text{Rate}_2} = \\sqrt{\\frac{M_2}{M_1}}$$",
    description: "Effusion speed ratio comparing molecular weights of gases.",
    category: "Chemistry"
  },
  {
    id: 213,
    title: "Gibbs Free Energy Equilibrium state",
    formula: "$$\\Delta G = \\Delta H - T \\Delta S$$",
    description: "Determines spontaneity of a chemical reaction using enthalpy and entropy changes.",
    category: "Chemistry"
  },
  {
    id: 214,
    title: "Gibbs Free Energy Reaction correlation",
    formula: "$$\\Delta G^\\circ = -R T \\ln(K)$$",
    description: "Ties standard state thermodynamic reaction drives directly into chemical equilibrium factors.",
    category: "Chemistry"
  },
  {
    id: 215,
    title: "Arrhenius Reaction Speed rate equation",
    formula: "$$k = A e^{-\\frac{E_a}{R T}}$$",
    description: "Relates kinetic speed rates directly to baseline chemical activation barriers.",
    category: "Chemistry"
  },
  {
    id: 216,
    title: "Nernst Electrochemical Potential",
    formula: "$$E = E^\\circ - \\frac{R T}{n F} \\ln(Q)$$",
    description: "Predicts electric cell voltage drop factoring reactive mixture ion ratios.",
    category: "Chemistry"
  },
  {
    id: 217,
    title: "Faraday's Electrochemical Weight electrolysis Law",
    formula: "$$m = \\left(\\frac{Q}{F}\\right) \\cdot \\left(\\frac{M}{z}\\right)$$",
    description: "Predicts the absolute mass of material deposited during electrolysis.",
    category: "Chemistry"
  },
  {
    id: 218,
    title: "Beer-Lambert Absorbance Spectroscopy Rule",
    formula: "$$A = \\varepsilon c l$$",
    description: "Correlates light absorption in science assays to dissolved solute concentrations.",
    category: "Chemistry"
  },
  {
    id: 219,
    title: "Specific Heat Heat Capacity Transfer equation",
    formula: "$$q = m c \\Delta T$$",
    description: "Measures energy required to alter the temperature of a given mass.",
    category: "Chemistry"
  },
  {
    id: 220,
    title: "Chemical Dilution Conservation",
    formula: "$$C_1 V_1 = C_2 V_2$$",
    description: "Preserves total solute molecules during concentration changes.",
    category: "Chemistry"
  },
  {
    id: 221,
    title: "Acid Dissociation Constant formulation",
    formula: "$$K_a = \\frac{[\\text{H}^+][\\text{A}^-]}{[\\text{HA}]}$$",
    description: "Measures the programmatic strength of acids dissolving in water.",
    category: "Chemistry"
  },
  {
    id: 222,
    title: "Base Dissociation Constant formulation",
    formula: "$$K_b = \\frac{[\\text{BH}^+][\\text{OH}^-]}{[\\text{B}]}$$",
    description: "Measures the strength of chemical bases dissolving in water.",
    category: "Chemistry"
  },
  {
    id: 223,
    title: "Self-Ionization Water Product",
    formula: "$$K_w = [\\text{H}^+][\\text{OH}^-] = 1.0 \\times 10^{-14}$$",
    description: "Water equilibrium constant at standard temperature.",
    category: "Chemistry"
  },
  {
    id: 224,
    title: "Chemical Equilibrium Constant expression",
    formula: "$$K_c = \\frac{[C]^c [D]^d}{[A]^a [B]^b}$$",
    description: "Relates reactant and product concentrations at chemical equilibrium.",
    category: "Chemistry"
  },
  {
    id: 225,
    title: "Partial Pressures Equilibrium Constant",
    formula: "$$K_p = K_c(R T)^{\\Delta n}$$",
    description: "Relates gaseous pressure constants to concentration constants.",
    category: "Chemistry"
  },
  {
    id: 226,
    title: "Clausius-Clapeyron Vapor Curve transition",
    formula: "$$\\ln\\left(\\frac{P_2}{P_1}\\right) = -\\frac{\\Delta H_{\\text{vap}}}{R} \\left(\\frac{1}{T_2} - \\frac{1}{T_1}\\right)$$",
    description: "Determines vapor pressures at varying temperatures.",
    category: "Chemistry"
  },
  {
    id: 227,
    title: "Raoult's Vapor Pressure Solution Law",
    formula: "$$P_{\\text{soln}} = \\chi_{\\text{solvent}} P^{\\circ}_{\\text{solvent}}$$",
    description: "Vapor pressure of solutions containing non-volatile solutes.",
    category: "Chemistry"
  },
  {
    id: 228,
    title: "Boiling Point Elevation colligative property",
    formula: "$$\\Delta T_b = i K_b m$$",
    description: "Predicts the boiling point increase in solutions.",
    category: "Chemistry"
  },
  {
    id: 229,
    title: "Freezing Point Depression colligative property",
    formula: "$$\\Delta T_f = i K_f m$$",
    description: "Predicts the freezing point drop in solutions.",
    category: "Chemistry"
  },
  {
    id: 230,
    title: "Osmotic Pressure colligative property",
    formula: "$$\\Pi = i M R T$$",
    description: "Calculates pressure needed to prevent osmotic flow across membranes.",
    category: "Chemistry"
  },
  {
    id: 231,
    title: "Henry's Soluble Gaseous Liquid Law",
    formula: "$$C = k P_{\\text{gas}}$$",
    description: "Relates the solubility of a gas in a liquid to its partial pressure.",
    category: "Chemistry"
  },
  {
    id: 232,
    title: "Ideal Gas van der Waals Correction",
    formula: "$$\\left(P + \\frac{a n^2}{V^2}\\right)(V - n b) = n R T$$",
    description: "Accounts for intermolecular attractions and molecular volumes in real gases.",
    category: "Chemistry"
  },
  {
    id: 233,
    title: "Chemical Mass Percentage concentration",
    formula: "$$\\text{Mass \\%} = \\frac{m_{\\text{solute}}}{m_{\\text{total}}} \\times 100$$",
    description: "Expresses concentration as a percentage of total solution weight.",
    category: "Chemistry"
  },
  {
    id: 234,
    title: "Mole Fraction structural scale",
    formula: "$$\\chi_A = \\frac{n_t_h}{n_{\\text{total}}}$$",
    description: "Ratio of target component molecules to total molecular count.",
    category: "Chemistry"
  },
  {
    id: 235,
    title: "Solution Molality concentration scale",
    formula: "$$m = \\frac{n_{\\text{solute}}}{\\text{kg of solvent}}$$",
    description: "Measures solution concentration relative to solvent weight in kg.",
    category: "Chemistry"
  },
  {
    id: 236,
    title: "Chemical Density Definition",
    formula: "$$\\rho = \\frac{m}{V}$$",
    description: "Compares substance density as mass per unit volume.",
    category: "Chemistry"
  },
  {
    id: 237,
    title: "Enthalpy thermodynamic function Definition",
    formula: "$$H = U + P V$$",
    description: "Combines internal state energy with pressure-volume values.",
    category: "Chemistry"
  },
  {
    id: 238,
    title: "Hess's Constant Enthalpy Summation Law",
    formula: "$$\\Delta H_{\\text{reaction}} = \\sum \\Delta H_f^{\\circ}(\\text{products}) - \\sum \\Delta H_f^{\\circ}(\\text{reactants})$$",
    description: "Enthalpy changes of a reaction calculated from standard enthalpies of formation.",
    category: "Chemistry"
  },
  {
    id: 239,
    title: "Entropy thermodynamic variable Definition",
    formula: "$$\\Delta S = \\int \\frac{dq_{\\text{rev}}}{T}$$",
    description: "Entropy change as reversible heat exchange divided by temperature.",
    category: "Chemistry"
  },
  {
    id: 240,
    title: "Boltzmann Entropy Equation",
    formula: "$$S = k_B \\ln(W)$$",
    description: "Relates thermodynamic entropy to microscopic states.",
    category: "Chemistry"
  },
  {
    id: 241,
    title: "Bragg's X-Ray Crystal Diffraction",
    formula: "$$n \\lambda = 2d \\sin(\\theta)$$",
    description: "Predicts the angle of constructive wave interference in crystals.",
    category: "Chemistry"
  },
  {
    id: 242,
    title: "Avogadro Constant relation",
    formula: "$$N_A = 6.022 \\times 10^{23} \\text{ mol}^{-1}$$",
    description: "Underlying chemical count of particles per unit mole.",
    category: "Chemistry"
  },
  {
    id: 243,
    title: "First-Order Reaction Integrated Rate Law",
    formula: "$$\\ln[A]_t = -k t + \\ln[A]_0$$",
    description: "Plots concentration decrease in first-order reactions over time.",
    category: "Chemistry"
  },
  {
    id: 244,
    title: "Second-Order Reaction Integrated Rate Law",
    formula: "$$\\frac{1}{[A]_t} = k t + \\frac{1}{[A]_0}$$",
    description: "Plots concentration decrease in second-order reactions over time.",
    category: "Chemistry"
  },
  {
    id: 245,
    title: "Zero-Order Reaction Integrated Rate Law",
    formula: "$$[A]_t = -k t + [A]_0$$",
    description: "Plots concentration decrease in constant-speed reactions over time.",
    category: "Chemistry"
  },
  {
    id: 246,
    title: "First-Order Half-Life Period",
    formula: "$$t_{1/2} = \\frac{\\ln(2)}{k}$$",
    description: "Time required for half of a reactant to decompose.",
    category: "Chemistry"
  },
  {
    id: 247,
    title: "Michaelis-Menten Enzyme Kinetics",
    formula: "$$v = \\frac{V_{\\text{max}}[S]}{K_m + [S]}$$",
    description: "Models enzyme reaction velocity based on substrate concentration.",
    category: "Chemistry"
  },
  {
    id: 248,
    title: "Root-Mean-Square Gas Molecular Speed",
    formula: "$$v_{\\text{rms}} = \\sqrt{\\frac{3RT}{M}}$$",
    description: "Calculates average velocity of gas particles scaling with temperature.",
    category: "Chemistry"
  },
  {
    id: 249,
    title: "Water Solubility Constant expression",
    formula: "$$K_{\\text{sp}} = [A^y+]^x [B^x-]^y$$",
    description: "Equilibrium constant for dissolved sparingly soluble salts.",
    category: "Chemistry"
  },
  {
    id: 250,
    title: "Formal Charge atomic evaluation",
    formula: "$$\\text{FC} = V - N - \\frac{B}{2}$$",
    description: "Assigns localized valence charge shares to atoms in Lewis structures.",
    category: "Chemistry"
  }
];
