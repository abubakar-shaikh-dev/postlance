export async function evaluateProposal({ studentProfile, project, proposal }) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return fallbackEvaluation({ studentProfile, project, proposal });
  }

  const prompt = `You are an AI evaluator for a student freelance platform. Evaluate this proposal:

PROJECT:
Title: ${project.title}
Description: ${project.description}
Skills Required: ${project.skillsRequired?.join(', ')}
Budget: ₹${project.budget}

STUDENT PROFILE:
Skills: ${studentProfile.skills?.join(', ') || 'Not provided'}
Bio: ${studentProfile.bio || 'Not provided'}
Portfolio Links: ${studentProfile.portfolioLinks?.join(', ') || 'Not provided'}
Reliability Score: ${studentProfile.reliabilityScore || 0}
Education: ${studentProfile.education || 'Not provided'}

PROPOSAL:
Cover Letter: ${proposal.coverLetter}
Proposed Budget: ₹${proposal.proposedBudget}

Rate each criterion from 0-100:
1. skillMatch: How well the student's skills match the project requirements
2. portfolioRelevance: How relevant the student's portfolio is to this project
3. reliabilityScore: Based on the student's past reliability score
4. proposalQuality: Quality, clarity, and enthusiasm in the cover letter
5. availabilityMatch: How well the proposed budget matches the project budget

Respond ONLY with a valid JSON object:
{
  "skillMatch": number,
  "portfolioRelevance": number,
  "reliabilityScore": number,
  "proposalQuality": number,
  "availabilityMatch": number,
  "overallScore": number,
  "summary": "string explaining the evaluation"
}`;

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    const result = JSON.parse(content.replace(/```json|```/g, '').trim());

    return {
      skillMatch: result.skillMatch || 0,
      portfolioRelevance: result.portfolioRelevance || 0,
      reliabilityScore: result.reliabilityScore || 0,
      proposalQuality: result.proposalQuality || 0,
      availabilityMatch: result.availabilityMatch || 0,
      overallScore: result.overallScore || 0,
      summary: result.summary || '',
    };
  } catch (error) {
    console.error('AI evaluation error:', error);
    return fallbackEvaluation({ studentProfile, project, proposal });
  }
}

function fallbackEvaluation({ studentProfile, project, proposal }) {
  const studentSkills = new Set(
    (studentProfile.skills || []).map((s) => s.toLowerCase())
  );
  const requiredSkills = (project.skillsRequired || []).map((s) =>
    s.toLowerCase()
  );
  const matchedSkills = requiredSkills.filter((s) => studentSkills.has(s));
  const skillMatch =
    requiredSkills.length > 0
      ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
      : 50;

  const budgetRatio = proposal.proposedBudget / project.budget;
  const availabilityMatch =
    budgetRatio <= 1
      ? 100 - Math.round(Math.abs(budgetRatio - 0.5) * 100)
      : Math.max(0, 100 - Math.round((budgetRatio - 1) * 150));

  const proposalQuality = Math.min(90, proposal.coverLetter.length > 50 ? 70 : 40);

  const overallScore = Math.min(100, Math.round(
    skillMatch * 0.35 +
    (studentProfile.reliabilityScore || 50) * 0.25 +
    availabilityMatch * 0.2 +
    proposalQuality * 0.2
  ));

  return {
    skillMatch,
    portfolioRelevance: 50,
    reliabilityScore: studentProfile.reliabilityScore || 50,
    proposalQuality,
    availabilityMatch: Math.max(0, Math.min(100, availabilityMatch)),
    overallScore,
    summary: 'Auto-evaluated (AI unavailable). Based on skill match and budget alignment.',
  };
}
