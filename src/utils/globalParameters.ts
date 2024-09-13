export const gradingScheme = [
    { grade: 'H1', minScore: 80, maxScore: 100, description: 'First Class Honours' },
    { grade: 'H2A', minScore: 75, maxScore: 80, description: 'Second Class Honours Division A' },
    { grade: 'H2B', minScore: 70, maxScore: 75, description: 'Second Class Honours Division B' },
    { grade: 'H3', minScore: 65, maxScore: 70, description: 'Third Class Honours' },
    { grade: 'P', minScore: 50, maxScore: 65, description: 'Pass' },
    { grade: 'N', minScore: 0, maxScore: 50, description: 'Fail' },
  ];
  
  export function getGrade(score: number): string {
    const gradeInfo = gradingScheme.find(g => score >= g.minScore && score <= g.maxScore);
    return gradeInfo ? gradeInfo.grade : 'Invalid Score';
  }