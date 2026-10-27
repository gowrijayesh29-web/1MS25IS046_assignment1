import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client according to AI Studio guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Curated high-fidelity demonstration for Federated Learning
const FEDERATED_LEARNING_DEMO = {
  id: 'fl-curated-demo',
  topic: 'Federated Learning',
  timestamp: new Date().toISOString(),
  lens: 'Comprehensive Academic Review',
  thinkingSteps: {
    step1Reasoning: "Deconstructing 'Federated Learning' by separating client-edge data heterogeneity (non-IID distribution) from communication bottlenecks, privacy leakage vectors (gradient inversion), Byzantine/poisoning resilience, and personalization.",
    step2Reasoning: "Pinpointing McMahan et al. (2017) as the seminal foundational anchor, followed by Li et al. (FedProx) and Karimireddy et al. (SCAFFOLD) for variance reduction, Bonawitz et al. for secure aggregation, and leading PIs like H. Brendan McMahan, Virginia Smith, and Peter Richtárik.",
    step3Reasoning: "Synthesizing convergence bounds under non-convex loss functions; comparing gradient averaging vs model parameter interpolation; contrasting differential privacy trade-offs with communication compression (e.g., top-k sparsification, quantization).",
    step4Reasoning: "Detecting critical unresolved frontiers: auditability of client contributions without violating privacy, certified robustness against backdoor attacks under non-IID conditions, and federated learning on heterogeneous foundation models."
  },
  step1SubQuestions: [
    {
      id: 'sq-1',
      category: 'foundational',
      question: 'How does client data heterogeneity (non-IID distributions) compromise objective convergence and client drift?',
      rationale: 'In real-world edge devices, data is non-identically distributed across clients. When local models optimize local objectives, client drift pulls the global model away from true global empirical risk minimization.',
      keyFacets: ['Statistical Heterogeneity', 'Client Drift', 'Non-convex Optimization Bounds', 'Dirichlet Distribution Benchmarks'],
      priority: 'Crucial'
    },
    {
      id: 'sq-2',
      category: 'systems',
      question: 'What are the communication bounds and bandwidth optimization strategies for uplink/downlink synchronization?',
      rationale: 'Edge devices face asymmetric, constrained uplink bandwidth. Transmitting full multi-billion parameter model updates per round is infeasible on cellular and IoT hardware.',
      keyFacets: ['Gradient Quantization', 'Top-k Sparsification', 'Over-the-Air Aggregation', 'Asynchronous Staggering'],
      priority: 'High'
    },
    {
      id: 'sq-3',
      category: 'security_privacy',
      question: 'How effective are gradient inversion and membership inference attacks, and what are the utility-privacy trade-offs of Local DP vs Secure Aggregation?',
      rationale: 'While raw data stays on-device, sharing intermediate gradients leaks private features unless protected by Cryptographic Secure Multi-Party Computation (SMPC) or Local Differential Privacy (LDP).',
      keyFacets: ['Gradient Inversion Attacks', 'Differential Privacy Epsilon Budgets', 'Secure Aggregation Overhead', 'Trusted Execution Environments (TEEs)'],
      priority: 'Crucial'
    },
    {
      id: 'sq-4',
      category: 'algorithmic',
      question: 'How do personalization algorithms (meta-learning, local adapters, multi-task FL) resolve the tension between global generalization and client-specific performance?',
      rationale: 'A single global consensus model often underperforms on minority client distributions. Personalization balances shared representations with tailored local adapters.',
      keyFacets: ['Model-Agnostic Meta-Learning (MAML)', 'Per-FedAvg', 'pFedMe', 'LoRA / Parameter-Efficient Fine-Tuning in FL'],
      priority: 'High'
    },
    {
      id: 'sq-5',
      category: 'frontiers',
      question: 'How can Federated Learning be scaled to decentralized Foundation Models (Federated LLMs) without catastrophic memory and compute exhaustion?',
      rationale: 'Modern foundational LLMs exceed the memory capabilities of consumer edge devices, necessitating split learning, federated parameter-efficient fine-tuning (PEFT), and federated retrieval.',
      keyFacets: ['Federated LoRA (FedLoRA)', 'Split Learning & Offloading', 'Federated Retrieval-Augmented Generation', 'Device Orchestration'],
      priority: 'Emerging'
    }
  ],
  step2Papers: [
    {
      id: 'p-1',
      title: 'Communication-Efficient Learning of Deep Networks from Decentralized Data',
      authors: ['H. Brendan McMahan', 'Eider Moore', 'Daniel Ramage', 'Seth Hampson', 'Blaise Agüera y Arcas'],
      year: 2017,
      venue: 'AISTATS (20th International Conference on Artificial Intelligence and Statistics)',
      abstractSummary: 'Introduced the foundational Federated Averaging (FedAvg) algorithm, demonstrating that deep learning models can be trained across decentralized edge devices using synchronized local stochastic gradient descent steps with periodic server aggregation.',
      keyInnovation: 'Introduced the Federated Learning paradigm and FedAvg algorithm with empirical proof of robust convergence with multiple local SGD epochs.',
      primarySubQuestionId: 'sq-1',
      doi: '10.48550/arXiv.1602.05629',
      arxivId: '1602.05629',
      paperType: 'Seminal / Foundational',
      citationsEstimate: '15,000+',
      codeUrl: 'https://github.com/tensorflow/federated',
      bibtex: '@inproceedings{mcmahan2017communication,\n  title={Communication-efficient learning of deep networks from decentralized data},\n  author={McMahan, Brendan and Moore, Eider and Ramage, Daniel and Hampson, Seth and y Arcas, Blaise Aguera},\n  booktitle={Artificial intelligence and statistics},\n  pages={1273--1282},\n  year={2017},\n  organization={PMLR}\n}'
    },
    {
      id: 'p-2',
      title: 'Federated Optimization in Heterogeneous Networks (FedProx)',
      authors: ['Tian Li', 'Anit Kumar Sahu', 'Manzil Zaheer', 'Maziar Sanjabi', 'Ameet Talwalkar', 'Virginia Smith'],
      year: 2020,
      venue: 'MLSys (Conference on Machine Learning and Systems)',
      abstractSummary: 'Tackled systems and statistical heterogeneity simultaneously by adding a proximal regularization term to the local client objective function, preventing local iterates from diverging wildly during high non-IID conditions.',
      keyInnovation: 'Proximal regularization term (FedProx) ensuring stable convergence when client updates vary in computational capacity and data distributions.',
      primarySubQuestionId: 'sq-1',
      doi: '10.48550/arXiv.1812.06127',
      arxivId: '1812.06127',
      paperType: 'Breakthrough Algorithm',
      citationsEstimate: '4,500+',
      codeUrl: 'https://github.com/litian96/FedProx',
      bibtex: '@article{li2020federated,\n  title={Federated optimization in heterogeneous networks},\n  author={Li, Tian and Sahu, Anit Kumar and Zaheer, Manzil and Sanjabi, Maziar and Talwalkar, Ameet and Smith, Virginia},\n  journal={Proceedings of Machine Learning and Systems},\n  volume={2},\n  pages={429--450},\n  year={2020}\n}'
    },
    {
      id: 'p-3',
      title: 'SCAFFOLD: Stochastic Controlled Averaging for Federated Learning',
      authors: ['Sai Praneeth Karimireddy', 'Satyen Kale', 'Mehryar Mohri', 'Sashank Reddi', 'Sebastian Stich', 'Ananda Theertha Suresh'],
      year: 2020,
      venue: 'ICML (International Conference on Machine Learning)',
      abstractSummary: 'Formally identified client-drift as the root cause of slow convergence in FedAvg and proposed control variates (variance reduction) to correct local client gradient directions.',
      keyInnovation: 'Variance-reduced client-drift correction that achieves linear speedup even under severe non-IID conditions.',
      primarySubQuestionId: 'sq-1',
      doi: '10.48550/arXiv.1910.06378',
      arxivId: '1910.06378',
      paperType: 'Breakthrough Algorithm',
      citationsEstimate: '2,800+',
      bibtex: '@inproceedings{karimireddy2020scaffold,\n  title={SCAFFOLD: Stochastic controlled averaging for federated learning},\n  author={Karimireddy, Sai Praneeth and Kale, Satyen and Mohri, Mehryar and Reddi, Sashank and Stich, Sebastian and Suresh, Ananda Theertha},\n  booktitle={International Conference on Machine Learning},\n  pages={5132--5143},\n  year={2020},\n  organization={PMLR}\n}'
    },
    {
      id: 'p-4',
      title: 'Practical Secure Aggregation for Privacy-Preserving Machine Learning',
      authors: ['Keith Bonawitz', 'Vladimir Ivanov', 'Ben Kreuter', 'Antonio Marcedone', 'H. Brendan McMahan', 'Sarvar Patel', 'Daniel Ramage', 'Aaron Segal', 'Karn Seth'],
      year: 2017,
      venue: 'ACM CCS (Computer and Communications Security)',
      abstractSummary: 'Designed a novel cryptographic protocol based on Shamir secret sharing and double-masking that allows the central server to compute the aggregate sum of thousands of high-dimensional vectors without observing any individual vector, robust to device dropouts.',
      keyInnovation: 'Dropout-tolerant Secure Aggregation protocol with logarithmic communication overhead for federated edge deployments.',
      primarySubQuestionId: 'sq-3',
      doi: '10.1145/3133956.3133982',
      arxivId: '1611.04482',
      paperType: 'Seminal / Foundational',
      citationsEstimate: '3,200+',
      bibtex: '@inproceedings{bonawitz2017practical,\n  title={Practical secure aggregation for privacy-preserving machine learning},\n  author={Bonawitz, Keith and Ivanov, Vladimir and Kreuter, Ben and Marcedone, Antonio and McMahan, H Brendan and Patel, Sarvar and Ramage, Daniel and Segal, Aaron and Seth, Karn},\n  booktitle={Proceedings of the 2017 ACM SIGSAC Conference on Computer and Communications Security},\n  pages={1175--1191},\n  year={2017}\n}'
    },
    {
      id: 'p-5',
      title: 'Advances and Open Problems in Federated Learning',
      authors: ['Peter Kairouz', 'H. Brendan McMahan', 'Brendan Avent', 'Aurelien Bellet', 'Adria Gascon', 'Virginia Smith', 'and 50+ co-authors'],
      year: 2021,
      venue: 'Foundations and Trends in Machine Learning (FnTML)',
      abstractSummary: 'Comprehensive multi-institution treatise defining the core taxonomy of federated learning, covering cross-silo vs cross-device setups, non-IID optimization, privacy attacks, incentive engineering, and production systems.',
      keyInnovation: 'Definitive survey formalizing federated learning challenges and defining the open research agenda for the decade.',
      primarySubQuestionId: 'sq-5',
      doi: '10.1561/2200000083',
      arxivId: '1912.04977',
      paperType: 'Comprehensive Survey',
      citationsEstimate: '4,100+',
      bibtex: '@article{kairouz2021advances,\n  title={Advances and open problems in federated learning},\n  author={Kairouz, Peter and McMahan, H Brendan and Avent, Brendan and Bellet, Aurelien and others},\n  journal={Foundations and Trends in Machine Learning},\n  volume={14},\n  number={1--2},\n  pages={1--210},\n  year={2021}\n}'
    }
  ],
  step2KeyAuthors: [
    {
      name: 'H. Brendan McMahan',
      affiliation: 'Google Research, Seattle',
      landmarkContribution: 'Co-inventor of Federated Learning and author of the landmark FedAvg and Secure Aggregation papers.',
      notablePapers: ['Communication-Efficient Learning of Deep Networks from Decentralized Data', 'Practical Secure Aggregation', 'Advances and Open Problems in FL']
    },
    {
      name: 'Virginia Smith',
      affiliation: 'Carnegie Mellon University (CMU)',
      landmarkContribution: 'Pioneered federated multi-task learning (MOCHA) and heterogeneity-aware optimization (FedProx, LEAF benchmark).',
      notablePapers: ['Federated Multi-Task Learning', 'FedProx in Heterogeneous Networks', 'LEAF: A Benchmark for Federated Settings']
    },
    {
      name: 'Peter Richtárik',
      affiliation: 'KAUST / University of Edinburgh',
      landmarkContribution: 'Mathematical foundations of distributed optimization, federated momentum, quantized gradient aggregation, and error-feedback SGD.',
      notablePapers: ['Federated Optimization: Distributed Machine Learning for On-Device Intelligence', 'EF21: A New, Simpler, Theoretically Better Engine for Gradient Compression']
    },
    {
      name: 'Tian Li',
      affiliation: 'University of Chicago (ex-CMU)',
      landmarkContribution: 'Formulated algorithmic frameworks for federated fairness (q-FedAvg) and robust optimization under heterogeneity (FedProx).',
      notablePapers: ['Fair Resource Allocation in Federated Learning (q-FFL)', 'Federated Optimization in Heterogeneous Networks']
    }
  ],
  step3Findings: {
    executiveSynthesis: "Federated Learning has transitioned from an exploratory paradigm (2016-2019) into a core pillar of privacy-preserving machine learning. The consensus is that while standard FedAvg converges under IID settings, real-world heterogeneous client distributions require variance reduction (e.g., SCAFFOLD) or proximal regularization (FedProx). Combining Local Differential Privacy with Cryptographic Secure Aggregation is essential to prevent reconstructed training data from leaked client gradients. Personalization via parameter-efficient fine-tuning (Fed-PEFT/FedLoRA) has emerged as the modern strategy to bridge global generalizability and local client specialization.",
    thematicFindings: [
      {
        topic: 'Convergence Under Heterogeneity (Non-IID)',
        consensus: 'FedAvg experiences severe client-drift when local client distributions vary significantly (Dirichlet alpha < 0.1). Theoretical convergence guarantees require bounding gradient dissimilarity or employing control variates.',
        keyMechanisms: 'Proximal local penalties (FedProx ||w - w_t||^2) and dual-side stateful control variates (SCAFFOLD) correct directional bias.',
        empiricalEvidence: 'On partitioned non-IID CIFAR-10 and Shakespeare benchmarks, control variate methods converge up to 5x faster in rounds with 12-18% higher top-1 accuracy than naive FedAvg.'
      },
      {
        topic: 'Communication vs Computation Trade-offs',
        consensus: 'Transmitting full model gradients in every round is the primary operational bottleneck. Periodic local SGD (multiple local epochs E > 1) combined with compression delivers the highest communication efficiency.',
        keyMechanisms: 'Top-k gradient sparsification, error feedback mechanisms (EF21), and structured matrix low-rank factorization.',
        empiricalEvidence: 'Compression ratios exceeding 99% can be attained with sub-1% loss in model utility when coupled with error accumulator buffers.'
      },
      {
        topic: 'Privacy & Leakage Limits',
        consensus: 'Raw gradients are NOT inherently private. DLG (Deep Leakage from Gradients) and generative inversion attacks can reconstruct pixel-level images and token sequences from gradient updates.',
        keyMechanisms: 'Renyi Differential Privacy noise injection coupled with SecAgg (Secure Aggregation) prevents single-client inspection.',
        empiricalEvidence: 'Without DP noise, gradient inversion attacks succeed in reconstructing training batches in under 100 iterations on standard ResNet models.'
      }
    ],
    tradeoffsMatrix: [
      {
        methodName: 'FedAvg',
        strengths: 'Minimal server overhead, straightforward implementation, highly efficient under IID data.',
        limitations: 'Suffers severe client drift and divergent gradient directions when data is non-IID.',
        tradeoffs: 'Low computation, high vulnerability to statistical heterogeneity.',
        idealUseCase: 'Cross-silo settings where data is partitioned relatively uniformly.'
      },
      {
        methodName: 'FedProx',
        strengths: 'Guaranteed convergence with variable local work; stable under stragglers.',
        limitations: 'Requires tuning proximal hyperparameter mu; slower per-round local solver.',
        tradeoffs: 'Moderate local compute overhead in exchange for robust non-IID convergence.',
        idealUseCase: 'Edge environments with heterogeneous battery levels and computation speeds.'
      },
      {
        methodName: 'SCAFFOLD',
        strengths: 'Mathematically overcomes client drift using control variates; linear speedup.',
        limitations: 'Doubles client-server communication footprint due to transmitting control variates.',
        tradeoffs: 'Higher communication payload per round in exchange for dramatically fewer total rounds.',
        idealUseCase: 'Bandwidth-rich networks where rapid wall-clock convergence is paramount.'
      },
      {
        methodName: 'FedLoRA / Fed-PEFT',
        strengths: 'Reduces trainable client parameters by 99%+, enabling LLM fine-tuning on consumer edge devices.',
        limitations: 'Base model must remain frozen; aggregate rank updates can suffer rank collapse.',
        tradeoffs: 'Extreme memory/compute savings at the cost of limited full-model parameter plasticity.',
        idealUseCase: 'On-device LLM adaptation and private conversational assistants.'
      }
    ],
    theoreticalFormulation: "min_{w} f(w) = sum_{k=1}^K p_k F_k(w), where F_k(w) = E_{x ~ D_k}[l(w; x)] and p_k >= 0, sum p_k = 1. In non-IID regimes, E[grad F_k(w)] != grad f(w), inducing client drift drift(k) = ||grad F_k(w) - grad f(w)||.",
    stateOfArtMaturity: 'Maturing with Open Hard Problems'
  },
  step4Gaps: [
    {
      id: 'gap-1',
      title: 'Certified Byzantine & Backdoor Robustness Under Non-IID Skew',
      gapType: 'Robustness & Security',
      severity: 'Critical Open Problem',
      description: 'Current robust aggregation rules (Coordinate-wise Median, Trimmed Mean, Krum, Bulyan) assume honest clients share similar gradient trajectories. Under natural non-IID data skew, an honest client looks statistically identical to an adversarial poisoned/backdoor update, causing robust aggregators to discard legitimate minority demographic data.',
      whyExistingMethodsFail: 'Geometric distance-based outlier filters fail to distinguish benign distribution divergence from malicious perturbation vectors.',
      actionableResearchAngle: 'Develop certified non-IID attribution methods combining zero-knowledge proof of dataset properties with invariant representation learning.',
      recommendedHypothesis: 'Hypothesis: Conditioning gradient distance metrics on a provably private summary statistic of local label distributions will reduce false rejection of minority honest clients by >40% without relaxing Byzantine tolerance bounds.'
    },
    {
      id: 'gap-2',
      title: 'Verifiable Contribution Valuation & Fair Incentive Allocation',
      gapType: 'Evaluation & Benchmark Gap',
      severity: 'High Impact Opportunity',
      description: 'In cross-silo federated learning (e.g., competing hospital networks or financial institutions), participating institutions require mathematical attribution of their contribution (Shapley Value). However, calculating exact Data Shapley requires retraining exponential permutations of clients (O(2^K)), and existing approximations leak private client data through validation performance checks.',
      whyExistingMethodsFail: 'Monte Carlo Shapley sampling is computationally prohibitive in federated iterative rounds and violates differential privacy guarantees.',
      actionableResearchAngle: 'Design privacy-preserving single-run influence function estimators computed during forward-backward passes under secure aggregation.',
      recommendedHypothesis: 'Hypothesis: A localized Hessian-free influence estimator integrated into the server aggregation step can approximate client marginal utility with error bounded by epsilon while adding zero privacy degradation.'
    },
    {
      id: 'gap-3',
      title: 'Heterogeneous Model Architectures & Federated Knowledge Distillation',
      gapType: 'Systems & Scalability',
      severity: 'Critical Open Problem',
      description: 'Standard FL enforces a strict homogeneous parameter space: every phone, watch, or server must train the exact same tensor shapes. In reality, edge devices differ by 1000x in RAM and FLOPS. Attempting to fit a 7B parameter model on a smartwatch is impossible.',
      whyExistingMethodsFail: 'Parameter-averaging (FedAvg) mathematically requires identical weight matrices, completely breaking down if clients use heterogeneous neural architectures.',
      actionableResearchAngle: 'Leverage Federated Dual Distillation with self-supervised feature alignment on unlabeled public proxy datasets without sharing private representations.',
      recommendedHypothesis: 'Hypothesis: Decoupling architecture constraints via mutual logit distillation over an uncurated open-web anchor dataset retains 92%+ of full-parameter model performance across variable-capacity edge models.'
    },
    {
      id: 'gap-4',
      title: 'Unlearning & Right-to-be-Forgotten in Aggregated Global Models',
      gapType: 'Theoretical Bottleneck',
      severity: 'High Impact Opportunity',
      description: 'Under GDPR and CCPA, a client who revokes consent has the legal right to have their data removed. In federated models, a single client updates have been diffused and non-linearly compounded across hundreds of subsequent training rounds.',
      whyExistingMethodsFail: 'Exact machine unlearning requires rolling back to the round before the client participated and retraining from scratch, defeating the efficiency of federated edge learning.',
      actionableResearchAngle: 'Formulate projected gradient unlearning that leverages historical server-side momentum vectors to calculate an inverse parameter trajectory with verifiable certified deletion bounds.',
      recommendedHypothesis: 'Hypothesis: Projected Hessian unlearning with second-order Newton steps can guarantee an unlearning certifiability metric (membership inference risk < 0.505) within 3 rollback iterations.'
    }
  ]
};

// API Route: Main Research Paper Agent Analysis
app.post('/api/research/analyze', async (req, res) => {
  try {
    const { topic, lens = 'Comprehensive Academic Review', timeHorizon = 'all_time' } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ error: 'A valid research topic is required.' });
    }

    const trimmedTopic = topic.trim();

    // Fast-path for default example to give instantaneous snappy feedback if matched
    if (trimmedTopic.toLowerCase() === 'federated learning' && lens === 'Comprehensive Academic Review') {
      return res.json({
        success: true,
        data: {
          ...FEDERATED_LEARNING_DEMO,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Call Gemini API via Google GenAI SDK (Server-Side)
    const prompt = `
You are ScholarPulse, an autonomous expert Academic Research Paper Agent.
Your task is to analyze the research topic: "${trimmedTopic}"
Lens/Focus: ${lens}
Time Horizon: ${timeHorizon}

You MUST think step-by-step through the following 4 academic phases:
(1) Sub-Questions: Break the topic into 4-6 distinct, deep sub-questions (categorized into foundational, algorithmic, systems, security_privacy, or frontiers).
(2) Papers & Authors: Suggest 4-6 authoritative, real landmark papers (with authors, publication year, venue/conference, abstract summary, key innovation, arXiv ID/DOI, paper type, and bibtex citation) and 3-5 seminal authors/PIs with their institutions and core contributions.
(3) Summary of Findings: Synthesize state-of-the-art findings, theoretical formulation, consensus vs open debates, and a structured comparative tradeoffs matrix of key methods/approaches.
(4) Research Gaps: Identify 3-5 critical open research gaps (categorized by Theoretical Bottleneck, Systems & Scalability, Robustness & Security, Evaluation & Benchmark Gap, or Cross-disciplinary Frontier), explaining why existing methods fail, an actionable research angle, and a testable hypothesis.

Also provide your internal reasoning for each of the 4 steps in 'thinkingSteps'.

Return ONLY valid JSON matching this exact structure:
{
  "id": "analysis-${Date.now()}",
  "topic": "${trimmedTopic}",
  "timestamp": "${new Date().toISOString()}",
  "lens": "${lens}",
  "thinkingSteps": {
    "step1Reasoning": "string explaining how you decomposed the topic into sub-questions",
    "step2Reasoning": "string explaining paper selection criteria and landmark authors",
    "step3Reasoning": "string explaining how you synthesized findings and tradeoffs",
    "step4Reasoning": "string explaining how you detected gaps and formulated hypotheses"
  },
  "step1SubQuestions": [
    {
      "id": "sq-1",
      "category": "foundational",
      "question": "string",
      "rationale": "string",
      "keyFacets": ["string", "string"],
      "priority": "High"
    }
  ],
  "step2Papers": [
    {
      "id": "p-1",
      "title": "string",
      "authors": ["string", "string"],
      "year": 2020,
      "venue": "string (e.g. NeurIPS, ICML, CVPR, Nature, IEEE S&P)",
      "abstractSummary": "string",
      "keyInnovation": "string",
      "primarySubQuestionId": "sq-1",
      "doi": "string or empty",
      "arxivId": "string or empty",
      "paperType": "Seminal / Foundational",
      "citationsEstimate": "string (e.g. 3,500+)",
      "codeUrl": "string or empty",
      "bibtex": "string"
    }
  ],
  "step2KeyAuthors": [
    {
      "name": "string",
      "affiliation": "string",
      "landmarkContribution": "string",
      "notablePapers": ["string", "string"]
    }
  ],
  "step3Findings": {
    "executiveSynthesis": "string",
    "thematicFindings": [
      {
        "topic": "string",
        "consensus": "string",
        "keyMechanisms": "string",
        "empiricalEvidence": "string"
      }
    ],
    "tradeoffsMatrix": [
      {
        "methodName": "string",
        "strengths": "string",
        "limitations": "string",
        "tradeoffs": "string",
        "idealUseCase": "string"
      }
    ],
    "theoreticalFormulation": "string",
    "stateOfArtMaturity": "Maturing with Open Hard Problems"
  },
  "step4Gaps": [
    {
      "id": "gap-1",
      "title": "string",
      "gapType": "Theoretical Bottleneck",
      "severity": "Critical Open Problem",
      "description": "string",
      "whyExistingMethodsFail": "string",
      "actionableResearchAngle": "string",
      "recommendedHypothesis": "string"
    }
  ]
}
Ensure all papers, authors, and venues are real, respected academic references.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const textOutput = response.text || '';
    let parsedData;
    try {
      const cleaned = textOutput.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      parsedData = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('Failed to parse Gemini output as JSON:', textOutput.slice(0, 500));
      return res.status(500).json({
        error: 'Failed to parse structured literature analysis from AI model.',
        raw: textOutput.slice(0, 1000)
      });
    }

    res.json({
      success: true,
      data: parsedData
    });
  } catch (err: any) {
    console.error('Research analyze error:', err);
    res.status(500).json({
      error: err.message || 'Internal server error while executing research agent.'
    });
  }
});

// API Route: Deep-Dive into a Specific Sub-Question or Research Gap
app.post('/api/research/deep-dive', async (req, res) => {
  try {
    const { targetTitle, targetType, contextTopic, extraDetails } = req.body;

    const prompt = `
You are an expert Academic Advisor and Research Grant Reviewer.
The user wants an in-depth research proposal and experimental methodology deep dive for:
Target: "${targetTitle}" (${targetType})
Context Domain: "${contextTopic}"
Additional Context: "${extraDetails || 'None'}"

Generate a rigorous, publication-grade research plan addressing this item.
Return ONLY valid JSON matching this schema:
{
  "targetTitle": "${targetTitle}",
  "targetType": "${targetType}",
  "proposalTitle": "A concise, impactful academic paper/grant title",
  "problemStatement": "Detailed rigorous 2-3 paragraph breakdown of why this remains an open question",
  "coreHypothesis": "Formal testable scientific hypothesis (H1 vs H0)",
  "proposedMethodology": [
    "Step 1: Dataset curation and synthetic generation protocol",
    "Step 2: Novel algorithmic formulation / mathematical architecture",
    "Step 3: Baselines and ablation configurations",
    "Step 4: Statistical validation and significance testing"
  ],
  "expectedChallenges": [
    "Potential failure mode 1",
    "Potential failure mode 2"
  ],
  "benchmarkPlan": "Specific evaluation metrics, datasets, and target improvement thresholds",
  "potentialImpact": "Expected scientific contribution to the field if hypothesis is validated"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const textOutput = response.text || '';
    const cleaned = textOutput.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(cleaned);

    res.json({ success: true, data: parsed });
  } catch (err: any) {
    console.error('Deep dive error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate deep dive proposal.' });
  }
});

// API Route: Follow-up Grounded Chat with the Research Agent
app.post('/api/research/chat', async (req, res) => {
  try {
    const { topic, message, currentAnalysisSummary } = req.body;

    const systemInstruction = `
You are ScholarPulse, an interactive AI Academic Research Agent.
You are assisting a graduate researcher exploring "${topic}".
Use the current literature analysis as grounding context:
${JSON.stringify(currentAnalysisSummary || {}).slice(0, 3000)}

Respond with intellectual rigor, citing specific authors, papers, and mathematical/empirical concepts where relevant. Format clearly with markdown, bullet points, and code/math equations when helpful.
`;

    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction,
      },
    });

    const response = await chat.sendMessage({
      message: message,
    });

    res.json({
      success: true,
      reply: response.text || ''
    });
  } catch (err: any) {
    console.error('Research chat error:', err);
    res.status(500).json({ error: err.message || 'Failed to process chat message.' });
  }
});

// Start server
async function startServer() {
  const PORT = parseInt(process.env.PORT || '3000', 10);

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ScholarPulse Research Agent server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
