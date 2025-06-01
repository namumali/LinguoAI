const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://10.0.0.60:8080';

// Auth
export async function loginUser(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return await res.json();
}

export async function registerUser(name: string, username: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, username, password }),
  });
  if (!res.ok) throw new Error('Registration failed');
  return await res.json();
}

// Update Languages
export async function updateLanguages(userId: string, nativeLanguage: string, targetLanguage: string) {
  const res = await fetch(`${BASE_URL}/user/update-languages`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, nativeLanguage, targetLanguage }),
  });
  if (!res.ok) throw new Error('Failed to update languages');
  return await res.json();
}

// Update Preferences
export async function updatePreferences(userId: string, preferences: any) {
  const res = await fetch(`${BASE_URL}/user/update-preferences`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, preferences }),
  });
  if (!res.ok) throw new Error('Failed to update preferences');
  return await res.json();
}


export async function generateWordCard(word: string, language: string) {
  const res = await fetch(`${BASE_URL}/generate/word-card`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word, language })
  });

  return await parseSSEJSON(res);
}

export async function generateAlphabetCard(letter: string) {
  const res = await fetch(`${BASE_URL}/generate/alphabet-card`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ letter })
  });

  return await parseSSEJSON(res);
}

export async function generateSpeakingPrompt(difficulty: string, topic: string) {
  const res = await fetch(`${BASE_URL}/generate/speaking-prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ difficulty, topic })
  });

  return await parseSSEJSON(res);
}

export async function getVoiceFeedback(text: string, audioAccuracy: number) {
  const res = await fetch(`${BASE_URL}/generate/voice-feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, audioAccuracy })
  });

  return await parseSSEJSON(res);
}

export async function getUserProgress(language: string) {
  const res = await fetch(`${BASE_URL}/progress/user?language=${language}`);
  return await res.json();
}

export async function getRecommendedMaterials(language: string) {
  const res = await fetch(`${BASE_URL}/materials/recommended?language=${language}`);
  return await res.json();
}

export async function getSchedule() {
  const res = await fetch(`${BASE_URL}/schedule/upcoming`);
  return await res.json();
}


async function parseSSEJSON(res: Response): Promise<any> {
  const reader = res.body?.getReader();
  const decoder = new TextDecoder();
  let jsonText = '';

  while (true) {
    const { done, value } = await reader?.read()!;
    if (done) break;
    jsonText += decoder.decode(value);
  }

  const cleaned = jsonText
    .split('\n')
    .filter(line => line.startsWith('data: '))
    .map(line => line.replace('data: ', ''))
    .filter(line => line !== '[DONE]')
    .join('');

  return JSON.parse(cleaned);
}
