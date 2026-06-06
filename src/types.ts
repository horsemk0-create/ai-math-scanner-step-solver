export interface Formula {
  id: number;
  title: string;
  formula: string;
  description: string;
  category: "Mathematics" | "Algebra" | "Higher Mathematics" | "Physics" | "Chemistry";
}

export interface SolutionStep {
  id: number;
  title: string;
  equation: string;
  explanation: string;
}

export interface SolutionResult {
  identifiedProblem: string;
  quickAnswer: string;
  steps: SolutionStep[];
  rawMarkdown?: string;
  mcqQuestion?: string;
  mcqOptions?: string[];
  mcqCorrectAnswer?: string;
  mcqExplanation?: string;
  shortAnswer?: string;
}

export interface SolvedHistoryItem {
  id: string;
  timestamp: string;
  input: string;
  inputType: "scan" | "type";
  subject: string;
  classLevel: string;
  language: string;
  solution: SolutionResult;
}
