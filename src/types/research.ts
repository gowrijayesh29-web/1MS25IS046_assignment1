export interface SubQuestion {
  id: string;
  category: 'foundational' | 'algorithmic' | 'systems' | 'security_privacy' | 'frontiers';
  question: string;
  rationale: string;
  keyFacets: string[];
  priority: 'High' | 'Crucial' | 'Emerging';
}

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  abstractSummary: string;
  keyInnovation: string;
  primarySubQuestionId?: string;
  doi?: string;
  arxivId?: string;
  paperType: 'Seminal / Foundational' | 'Breakthrough Algorithm' | 'Empirical Benchmark' | 'Comprehensive Survey';
  citationsEstimate?: string;
  codeUrl?: string;
  bibtex?: string;
}

export interface KeyAuthor {
  name: string;
  affiliation: string;
  landmarkContribution: string;
  notablePapers: string[];
  scholarQuery?: string;
}

export interface TradeoffDimension {
  methodName: string;
  strengths: string;
  limitations: string;
  tradeoffs: string;
  idealUseCase: string;
}

export interface FindingSection {
  subQuestionId?: string;
  topic: string;
  consensus: string;
  keyMechanisms: string;
  empiricalEvidence: string;
}

export interface ResearchFindings {
  executiveSynthesis: string;
  thematicFindings: FindingSection[];
  tradeoffsMatrix: TradeoffDimension[];
  theoreticalFormulation?: string;
  stateOfArtMaturity: 'Nascent / Rapidly Evolving' | 'Maturing with Open Hard Problems' | 'Consolidated Foundations with Application Bottlenecks';
}

export interface ResearchGap {
  id: string;
  title: string;
  gapType: 'Theoretical Bottleneck' | 'Systems & Scalability' | 'Robustness & Security' | 'Evaluation & Benchmark Gap' | 'Cross-disciplinary Frontier';
  severity: 'Critical Open Problem' | 'High Impact Opportunity' | 'Moderate Engineering Challenge';
  description: string;
  whyExistingMethodsFail: string;
  actionableResearchAngle: string;
  recommendedHypothesis: string;
}

export interface ResearchAgentAnalysis {
  id: string;
  topic: string;
  timestamp: string;
  lens: string;
  thinkingSteps: {
    step1Reasoning: string;
    step2Reasoning: string;
    step3Reasoning: string;
    step4Reasoning: string;
  };
  step1SubQuestions: SubQuestion[];
  step2Papers: Paper[];
  step2KeyAuthors: KeyAuthor[];
  step3Findings: ResearchFindings;
  step4Gaps: ResearchGap[];
}

export interface DeepDiveResponse {
  targetTitle: string;
  targetType: 'sub_question' | 'gap' | 'paper';
  proposalTitle: string;
  problemStatement: string;
  coreHypothesis: string;
  proposedMethodology: string[];
  expectedChallenges: string[];
  benchmarkPlan: string;
  potentialImpact: string;
}
